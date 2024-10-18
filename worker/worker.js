import { createClient } from "redis";
import jest from "jest";
import { dirname } from "node:path"; // Use node: prefix for built-in modules
import { fileURLToPath } from "node:url";

// Manual definition of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisHost = process.env.REDIS_HOST || "localhost";

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

await redisClient.connect();

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

const queueName = "submissions";

async function runTests() {
  try {
    // Define Jest configuration options
    const jestConfig = {
      projects: [__dirname],
      silent: true,
    };

    const { results } = await jest.runCLI(jestConfig, [__dirname]);

    if (results.success) {
      return true;
    } else {
      console.log(
        `Tests failed. Number of failed tests: ${results.numFailedTests}`,
      );
      return false;
    }
  } catch (error) {
    console.log(`Error running tests: ${error.message}`);
    return false;
  }
}

async function pullFromQueue() {
  try {
    const data = await redisClient.brPop(queueName, 0);

    if (data) {
      const item = data.element;
      console.log(`Worker ${process.pid} received item from queue:`, item);
      //add entry to db with progress pending
      const { backendUrl, webSocketUrl } = JSON.parse(item);
      console.log({ backendUrl, webSocketUrl });
      globalThis.backendUrl = backendUrl;
      globalThis.webSocketUrl = webSocketUrl;
      console.log(
        globalThis.backendUrl,
        globalThis.webSocketUrl,
        "hello world",
      );

      const testSuccessful = await runTests();
      //progress success / false with stastics
      console.log({ testSuccessful });
    }
    pullFromQueue();
  } catch (err) {
    console.error("Error pulling from queue:", err);
    setTimeout(pullFromQueue, 1000);
  }
}

pullFromQueue();
