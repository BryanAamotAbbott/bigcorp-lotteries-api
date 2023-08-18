import { onRegisterClick } from "./src/onRegisterClick";
import { updateLotteries } from "./src/updateLotteries";

const registerButton = document.getElementById("register");
registerButton.onclick = onRegisterClick;

updateLotteries();