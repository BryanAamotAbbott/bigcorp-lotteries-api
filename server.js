const express = require("express");
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

app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
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
    await client.connect();

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
