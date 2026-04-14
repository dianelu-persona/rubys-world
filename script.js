(function () {
  const btn = document.getElementById("greet-btn");
  const message = document.getElementById("message");
  if (!btn || !message) return;

  btn.addEventListener("click", () => {
    message.textContent = "Hi — your JavaScript is working.";
    message.hidden = false;
  });
})();
