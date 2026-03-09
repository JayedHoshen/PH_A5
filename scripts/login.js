document.getElementById("btn-login").addEventListener("click", (event) => {
  const inputUsername = document.getElementById("input-username");
  const inputPassword = document.getElementById("input-password");

  const username = inputUsername.value.trim();
  const password = inputPassword.value.trim();

  if (username === "admin" && password === "admin123") {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    inputUsername.value = "";
    inputPassword.value = "";
    alert("Invalid username or password.");
    return;
  }
});
