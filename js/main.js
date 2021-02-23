var searchForm = document.querySelector('.search-form');
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');


searchForm.addEventListener('submit', submitAction);

function submitAction(event) {
  event.preventDefault();
  searchForm.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  searchForm.className = "search-move";
  getResults();
}

function getResults() {
  console.log('this ran');
  var search = new XMLHttpRequest();
  search.open('GET', 'https://www.cheapshark.com/api/1.0/games?title=batman&limit=60');
  search.responseType = 'json';
  search.addEventListener('load', function () {
    console.log('status', search.status);
    console.log('response', search.response);
  });
  search.send()
}

// function getUsers() {
//   var users = document.querySelector('#user-list');
//   var request = new XMLHttpRequest();
//   request.open('GET', 'https://jsonplaceholder.typicode.com/users');
//   request.responseType = 'json';
//   request.addEventListener('load', function () {
//     console.log('status', request.status);
//     console.log('response', request.response);
//     var i;
//     for (i = 0; i < this.response.length; i++) {
//       var list = document.createElement('li');
//       list.textContent = this.response[i].name;
//       users.appendChild(list);

//     }

//   })
//   request.send()
// }
