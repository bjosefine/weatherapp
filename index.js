addEventListener("DOMContentLoaded", () => {
  console.log("index javascript file");
  const navButton = document.getElementById("navButton");
  const navList = document.getElementById("navList");

  function navButtonClick() {
    if (navList.style.display === "block") {
      navList.style.display = "none";
    } else {
      navList.style.display = "block";
    }
  }

  navButton.addEventListener("click", navButtonClick);
});
