import { createClient } from "redis";
import random from "random";

const { REDIS_URL } = process.env;
const client = createClient({ url: REDIS_URL });
client.on("error", (error) => {
  console.error(error);
});

async function finalizeLottery() {
  if (process.argv.length !== 3) {
		console.log(
      "Incorrect usage. Usage: npm run finalize-lottery <LOTTERY_ID>"
    );
    return;
  }

  const lotteryId = process.argv[2];

  try {
		await client.connect();
		// TODO: Implement me

  } catch (e) {
    console.log("Error finalizing the lottery:", e.message);
  } finally {
    await client.disconnect();
  }
}

finalizeLottery();