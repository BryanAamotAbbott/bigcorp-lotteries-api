const express = require("express");
const app = express();
const port = 3000;

const { REDIS_URL } = process.env;

app.use(express.json({ limit: '10kb' }));

app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
