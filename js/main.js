var searchForm = document.querySelector('.search-form');
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results')


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
  search.open('GET', 'https://www.cheapshark.com/api/1.0/games?title=batman&limit=10')
  search.responseType = 'json';
  search.addEventListener('load', function () {
    console.log('status', search.status);
    console.log('response', search.response);
    for (var i = 0; i < this.response.length; i++) {
      var result = document.createElement('li');
      result.textContent = this.response[i].external;
      searchResults.appendChild(result);
      var thumbnail = document.createElement('img');
      thumbnail.setAttribute('src', this.response[i].thumb);
      searchResults.appendChild(thumbnail);
      var cheapestPrice =  document.createElement('li');
      cheapestPrice.textContent = this.response[i].cheapest
      searchResults.appendChild(cheapestPrice);
    }
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
