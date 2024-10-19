import { createClient } from "redis";
import jest from "jest";
import { dirname } from "node:path"; // Use node: prefix for built-in modules
import { fileURLToPath } from "node:url";

// Manual definition of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisHost = process.env.REDIS_HOST || "localhost";
const nextAppUrl = process.env.NEXT_APP_URL || "http://localhost:3000";

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

await redisClient.connect();

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

const queueName = "submissions";

async function runTests(id) {
  try {
    // Define Jest configuration options
    const jestConfig = {
      projects: [__dirname],
      silent: true,
    };

    const { results } = await jest.runCLI(jestConfig, [__dirname]);

    const executionTime = (
      results.testResults[0].perfStats.end -
      results.testResults[0].perfStats.start
    ).toString();

    if (results.success) {
      //progress success / false with stastics
      const status = "done";

      fetch("http://localhost:3000/api/submission", {
        method: "POST",
        body: JSON.stringify({ values: { id, executionTime, status } }),
      });
    } else {
      console.log(
        `Tests failed. Number of failed tests: ${results.numFailedTests}`,
      );
      const status = "failed";

      console.log({ id, executionTime, status });

      fetch("http://localhost:3000/api/submission", {
        method: "POST",
        body: JSON.stringify({ values: { id, executionTime, status } }),
      });
    }
  } catch (error) {
    console.log(`Error running tests: ${error.message}`);

    const status = "failed";

    fetch("http://localhost:3000/api/submission", {
      method: "POST",
      body: JSON.stringify({ values: { id, executionTime: "-1", status } }),
    });
  }
}

async function pullFromQueue() {
  try {
    const data = await redisClient.brPop(queueName, 0);

    if (data) {
      const item = data.element;
      console.log(`Worker ${process.pid} received item from queue:`, item);
      //add entry to db with progress pending
      const { id, backendUrl, websocketUrl } = JSON.parse(item);
      globalThis.backendUrl = backendUrl;
      globalThis.websocketUrl = websocketUrl;
      globalThis.id = id;

      await runTests(id);
    }
    pullFromQueue();
  } catch (err) {
    console.error("Error pulling from queue:", err);
    setTimeout(pullFromQueue, 1000);
  }
}

pullFromQueue();
