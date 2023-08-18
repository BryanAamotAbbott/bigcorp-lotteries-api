import { onRegisterClick } from "./src/onRegisterClick";
import { updateLotteries } from "./src/updateLotteries";

const registerButton = document.getElementById("register");
registerButton.onclick = onRegisterClick;

const POLLING_INVERVAL_IN_MS = 10_000;

updateLotteries();

setInterval(() => updateLotteries(), POLLING_INVERVAL_IN_MS);