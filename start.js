addEventListener("DOMContentLoaded", () => {
  const greeting = document.getElementById("greeting");
  const searchValue = document.querySelector("#searchCity");
  //få greeting att försvinna när man börjar skriva
  searchValue.addEventListener("input", inputGreeting);
  function inputGreeting() {
    if (searchValue.value.length === 0) {
      greeting.style.opacity = 100;
    } else {
      greeting.style.opacity = 0;
    }
  }
});
