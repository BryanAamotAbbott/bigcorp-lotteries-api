export async function onRegisterClick() {
    const nameInput = document.getElementById("name");
    const checkboxes = Array.from(
      document.querySelectorAll("input[type=checkbox]")
    );
  
    // TODO: Register the user for each selected lottery using the POST /register endpoint.
    // 1. Use the `fetch` API to make the request.
    // 2. Obtain the user's name from the `nameInput` element.
    // 3. Check status of the lottery checkboxes using the `checked` property.

    const currName = nameInput.value;
    const isAnyChecked = checkboxes.some((checkbox) => checkbox.checked);
  
    if (currName && isAnyChecked) {
      try {
        await Promise.all(
          checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) =>
              fetch("http://localhost:5173/register", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  lotteryId: checkbox.id,
                  name: currName,
                }),
              })
            )
        );
  
        nameInput.value = ""; // clear the input field
        alert(`Successfully registered ${currName} for the selected lotteries!`);
      } catch (e) {
        console.error("Error registering for lotteries");
      }
    } else {
        alert("Please enter a name and select an item.")
    }
  }