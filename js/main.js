var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('#game-search')
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results');
var storeListings = document.querySelector('.store-listings-results');
var watchlistDiv = document.querySelector('.watchlist-div')
var watchlistResults = document.querySelector('.watchlist-results')


var storesList = [];

window.addEventListener('DOMContentLoaded', loadWatchlist);
searchForm.addEventListener('submit', submitAction);


function stores() {
  var storesRequest = new XMLHttpRequest();
  storesRequest.open("GET", "https://www.cheapshark.com/api/1.0/stores")
  storesRequest.responseType = 'json';
  storesRequest.addEventListener('load', function () {
    storesList = storesRequest.response;
  });
  storesRequest.send();
}

stores();

function submitAction(event) {
  event.preventDefault();
  searchResults.classList.remove("hidden");
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  removeAllChildNodes(searchResults);
  removeAllChildNodes(storeListings);
  removeAllChildNodes(watchlistResults);
  searchForm.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  searchForm.className = "search-move";
  var searchRequest = searchBar.value;
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
      title.className = 'title-column';
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
      var gamePrice = result.setAttribute('cheapest-price', this.response[i].cheapest);
      var imageAttribute = result.setAttribute('image', this.response[i].thumb)
      var saveButton = document.createElement('button');
      saveButton.textContent = "Save to Watchlist";
      saveButton.className = "save-button";
      result.appendChild(saveButton);
      var saveButtonClick = document.querySelectorAll('.save-button');
      for (var j = 0; j < buyButton.length; j++) {
        buyButton[j].addEventListener('click', buyNow);
        saveButtonClick[j].addEventListener('click', saveGame);
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
  var prices = new XMLHttpRequest();
  prices.open("GET", "https://www.cheapshark.com/api/1.0/games?id=" + gameIdResult)
  prices.responseType = 'json';
  prices.addEventListener('load', function () {
    for (var i = 0; i < this.response.deals.length; i++) {
      storeListings.className = "search-results";
      var priceResult = document.createElement('li');
      priceResult.className = "result-row"
      storeListings.appendChild(priceResult);
      var storeId = this.response.deals[i].storeID;
      priceResult.setAttribute("storeid", storeId);
      var storeIcon = document.createElement('img');
      var iconImage;
      for (var j = 0; j < storesList.length; j++) {
        if (storeId === storesList[j].storeID) {
          iconImage = "https://www.cheapshark.com" + storesList[j].images['banner'];
          storeActualName = storesList[j].storeName;
        }
      }
      storeIcon.setAttribute('src', iconImage);
      storeIcon.className = 'list-image picture-column';
      priceResult.appendChild(storeIcon);
      var storeName = document.createElement('h2');
      var storeActualName;
      storeName.textContent = storeActualName;
      storeName.className = 'title-column'
      priceResult.appendChild(storeName);
      var storePrice = document.createElement('h2');
      storePrice.textContent = this.response.deals[i].price;
      storePrice.className = 'price-column';
      priceResult.appendChild(storePrice);
    }

  });
  prices.send();
}

function saveGame(event) {
  var target = event.target;
  console.log(target);
  var listing = target.parentNode;
  console.log(listing);
  console.log('it saves');
  searchResults.className = "hidden";
  var gameToSave = {
    Title: listing.getAttribute("game-title"),
    Price: listing.getAttribute("cheapest-price"),
    Image: listing.getAttribute("image")
  }
  console.log(gameToSave)
  gameToSave.entryId = watchlist.nextEntryId;
  watchlist.entries.unshift(gameToSave)
  console.log(watchlist);
  watchlist.nextEntryId++
  changeToWatchlist()
}

function changeToWatchlist() {
  watchlistDiv.className = "watchlist-div"
  watchlistResults.className = "watchlist-results"
  var watchResult = document.createElement('li');
  watchlistResults.appendChild(watchResult);
  watchResult.className = "result-row"
  var watchThumbnail = document.createElement('img');
  watchThumbnail.setAttribute('src', "filler image");
  watchThumbnail.className = 'list-image picture-column';
  watchResult.appendChild(watchThumbnail);
  var watchTitle = document.createElement('h3');
  watchTitle.textContent = "filler title";
  watchTitle.className = 'title-column';
  watchResult.appendChild(watchTitle);
  var watchCheapestPrice = document.createElement('h3');
  watchCheapestPrice.textContent = "19.99"
  watchCheapestPrice.className = 'price-column'
  watchResult.appendChild(watchCheapestPrice);
  var watchBuyLink = document.createElement('h3');
  watchBuyLink.textContent = 'Buy Now';
  watchBuyLink.className = 'buy-column';
  watchResult.appendChild(watchBuyLink);
}

function loadWatchlist(event) {
  for (i = 0; i < watchlist.entries.length - 1; i++) {
    console.log(watchlist.entries[i])
    // saveGame(watchlist.entries[i]);
  }
}
