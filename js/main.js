var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('#game-search')
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results');

searchForm.addEventListener('submit', submitAction);

function submitAction(event) {
  event.preventDefault();
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  removeAllChildNodes(searchResults);
  searchForm.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  searchForm.className = "search-move";
  var searchRequest = searchBar.value;
  console.log(searchRequest)
  getResults(searchRequest);
}

function getResults(searchRequest) {
  var search = new XMLHttpRequest();
  search.open('GET', 'https://www.cheapshark.com/api/1.0/games?title=' + searchRequest + '&limit=10')
  search.responseType = 'json';
  search.addEventListener('load', function () {
    for (var i = 0; i < this.response.length; i++) {
      var result = document.createElement('li');
      searchResults.appendChild(result);
      result.className = "result-row"
      var thumbnail = document.createElement('img');
      thumbnail.setAttribute('src', this.response[i].thumb);
      result.appendChild(thumbnail);
      thumbnail.className = 'list-image picture-column';
      var title = document.createElement('h3');
      title.textContent = this.response[i].external;
      title.className = 'title-column'
      result.appendChild(title);
      var cheapestPrice = document.createElement('h3');
      cheapestPrice.textContent = this.response[i].cheapest
      cheapestPrice.className = 'price-column'
      result.appendChild(cheapestPrice);
      var buyLink = document.createElement('h3');
      buyLink.textContent = 'Buy Now'
      buyLink.className = 'buy-column'
      result.appendChild(buyLink);
      var buyButton = document.querySelectorAll('.buy-column');
      console.log(buyButton)
      for (var j=0 ; j < buyButton.length; j++) {
        buyButton[j].addEventListener('click', buyNow)
      }
    }
  });
  search.send()
}

function buyNow (event) {
  console.log('buy now');
  searchResults.className = "hidden"
}
