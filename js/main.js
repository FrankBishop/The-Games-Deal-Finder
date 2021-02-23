var searchForm = document.querySelector('.search-form');
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');


searchForm.addEventListener('submit', submitAction);

function submitAction(event) {
  event.preventDefault();
  console.log('this works');
  searchForm.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
}
