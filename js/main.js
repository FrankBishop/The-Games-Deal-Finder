var searchForm = document.querySelector('.search-form');
var searchBar =  document.querySelector('#game-search')
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
  var searchRequest = searchBar.value;
  console.log(searchRequest)
  getResults(searchRequest);
}

function getResults(searchRequest) {
  console.log('this ran');
  var search = new XMLHttpRequest();
  search.open('GET', 'https://www.cheapshark.com/api/1.0/games?title=' + searchRequest + '&limit=10')
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
