const express = require("express");
const cors = require("cors");
const redis = require("redis");
const ulid = require("ulid");

const { REDIS_URL } = process.env;
const client = redis.createClient({ url: REDIS_URL });

// This is going to write any Redis error to console.
client.on("error", (error) => {
  console.error(error);
});

const app = express();
const port = 3000;
app.use(express.json({ limit: '10kb' }));

// if (process.env.NODE_ENV === "development") {
  // Enabling Cross-Origin Resource Sharing in development, as we run
  // the frontend and the backend code on different ports while developing.
  app.use(cors());
// }

app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
});

app.get("/lottery/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();

    const lottery = await client.hGetAll(`lottery.${id}`);

    if (!Object.keys(lottery).length) {
      res
        .status(404)
        .json({ error: "A lottery with the given ID does not exist" });
      return;
    }
    await client.disconnect();

    res.json(lottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lottery data" });
  }  
});

app.get("/lotteries", async (req, res) => {
  try {
    await client.connect();

    const lotteryIds = await client.lRange("lotteries", 0, -1);

    const transaction = client.multi();
    lotteryIds.forEach((id) => transaction.hGetAll(`lottery.${id}`));
    const lotteries = await transaction.exec();

    await client.disconnect();

    res.json(lotteries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lotteries data" });
  }
});

app.post("/register", async (req, res) => {
  const { lotteryId, name } = req.body;

  if (typeof lotteryId !== "number") {
    res.status(422).json({ error: "Invalid lottery id" });
    return;
  }

  if (typeof name !== "string" || name.length < 3) {
    res.status(422).json({ error: "Invalid lottery name" });
    return;
  }

  try {
    // await client.connect();

    const lottery = await client.hGet(`lottery.${lotteryId}`, "status");

    if (!lotteryStatus) {
      throw new Error("A lottery with the given ID doesn't exist");
    }

    if (lotteryStatus === "finished") {
      throw new Error("A lottery with the given ID is already finished");
    }

    await client.lPush(`lottery.${lotteryId}.participants`, name);

    res.json({ status: "Success" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to register for the lottery: ${error.message}` });
  }

});

app.post("/lotteries", async (req, res) => {
  const { type, name, prize } = req.body;

  if (type !== "simple") {
    res.status(422).json({ error: "Invalid lottery type" });
    return;
  }

  if (typeof name !== "string" || name.length < 3) {
    res.status(422).json({ error: "Invalid lottery name" });
    return;
  }

  if (typeof prize !== "string" || prize.length < 3) {
    res.status(422).json({ error: "Invalid lottery prize" });
    return;
  }

  const id = ulid.ulid();
  const newLottery = {
    id,
    name,
    prize,
    type,
    status: "running",
  };

  try {
    // await client.connect();

    await client
      .multi()
      .hSet(`lottery.${id}`, newLottery)
      .lPush("lotteries", id)
      .exec();

   await client.disconnect();
   res.json(newLottery);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to create lottery" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
