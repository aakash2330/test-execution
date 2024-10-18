import express from "express";
import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST || "localhost";

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

await redisClient.connect();

// Register event handlers before attempting to connect
redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  return res.send("hello world");
});

app.post("/push", async (req, res) => {
  try {
    const { backendUrl, webSocketUrl } = req.body.data;

    if (!backendUrl || !webSocketUrl) {
      return res.status(400).json({ message: "Data is required" });
    }
    const reply = await redisClient.lPush(
      "submissions",
      JSON.stringify({ backendUrl, webSocketUrl }),
    );
    res
      .status(200)
      .json({ message: "Data added to queue", queueLength: reply });
  } catch (err) {
    console.error("Error adding data to Redis queue:", err);
    res.status(500).json({ message: "Error adding data to Redis queue" });
  }
});

app.post("/user/create/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    res.status(201).json({ message: `User ${userId} created` });
  } catch (err) {
    console.error({ err });
    res.status(500).json({ message: "error creating user" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
