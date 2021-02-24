var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('#game-search')
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results');
var storeListings = document.querySelector('.store-listings-results')

searchForm.addEventListener('submit', submitAction);

function submitAction(event) {
  event.preventDefault();
  searchResults.classList.remove("hidden");
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
  searchResults.className = "search-results";
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
      var gameId = result.setAttribute('gameid', this.response[i].gameID);
      var gameTitle = result.setAttribute('game-title', this.response[i].external);
      for (var j = 0; j < buyButton.length; j++) {
        buyButton[j].addEventListener('click', buyNow)
      }
    }
  });
  search.send()
}

function buyNow(event) {
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  removeAllChildNodes(storeListings);
  searchResults.className = "hidden";
  var gameIdResult = this.parentNode.getAttribute("gameid");
  console.log('gameIdResult', gameIdResult)
  var prices = new XMLHttpRequest();
  prices.open("GET", "https://www.cheapshark.com/api/1.0/games?id=" + gameIdResult)
  prices.responseType = 'json';
  prices.addEventListener('load', function () {
    console.log('status', prices.status);
    console.log('response', prices.response);
    for (var i = 0; i < this.response.deals.length; i++) {
      console.log(this.response.deals[i])
      storeListings.className = "search-results";
      var priceResult = document.createElement('li');
      priceResult.className = "result-row"
      storeListings.appendChild(priceResult);
      var storeIcon = document.createElement('img')
      storeIcon.setAttribute('src', 'images/Steam_icon_logo.svg.png');
      storeIcon.className = 'list-image picture-column';
      priceResult.appendChild(storeIcon);
      var storeName = document.createElement('h3');
      storeName.textContent = 'Steam';
      storeName.className = 'title-column'
      priceResult.appendChild(storeName);
      var storePrice = document.createElement('h3');
      storePrice.textContent = '$19.99';
      storePrice.className = 'price-column';
      priceResult.appendChild(storePrice);
      var storeBuyLink = document.createElement('h3');
      storeBuyLink.textContent = 'Buy Now'
      storeBuyLink.className = 'buy-column'
      priceResult.appendChild(storeBuyLink);
    }

  });
  prices.send();
}
