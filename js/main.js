var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('#game-search')
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results');
var storeListings = document.querySelector('.store-listings-results');
var watchlistDiv = document.querySelector('.watchlist-div');
var watchlistResults = document.querySelector('.watchlist-results');
var homeLink = document.querySelector('.home-link');
var watchlistLink = document.querySelector('.watch-link');
var watchlistPrices = document.querySelector('.watchlist-prices')

var storesList = [];

window.addEventListener('DOMContentLoaded', loadWatchlist);
searchForm.addEventListener('submit', submitAction);
homeLink.addEventListener('click', goToHome);
watchlistLink.addEventListener('click', goToWatchlist);


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
  removeAllChildNodes(watchlistPrices);
  watchlistDiv.className = "hidden";
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
    console.log(search.response)
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
      saveButton.className = "save-button save";
      saveButton.setAttribute('type', 'button');
      result.appendChild(saveButton);
      for (var j = 0; j < buyButton.length; j++) {
        buyButton[j].addEventListener('click', buyNow);
        saveButton.addEventListener('click', saveGame);
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
  var listing = target.parentNode;
  searchResults.className = "hidden";
  var gameToSave = {
    title: listing.getAttribute("game-title"),
    price: listing.getAttribute("cheapest-price"),
    image: listing.getAttribute("image"),
    gameID: listing.getAttribute("gameid")
  }
  console.log(gameToSave)
  gameToSave.entryId = watchlist.nextEntryId;
  watchlist.entries.unshift(gameToSave)
  console.log(watchlist);
  watchlist.nextEntryId++
  addToWatchlist(gameToSave)
  switchToWatchlist()
}

function addToWatchlist(item) {
  var watchResult = document.createElement('li');
  watchlistResults.appendChild(watchResult);
  watchResult.className = "result-row";
  var gameIDSave = watchResult.setAttribute('gameid', item.gameID);
  var watchThumbnail = document.createElement('img');
  watchThumbnail.setAttribute('src', item.image);
  watchThumbnail.className = 'list-image picture-column';
  watchResult.appendChild(watchThumbnail);
  var watchTitle = document.createElement('h3');
  watchTitle.textContent = item.title;
  watchTitle.className = 'title-column';
  watchResult.appendChild(watchTitle);
  var watchCheapestPrice = document.createElement('h3');
  watchCheapestPrice.textContent = item.price;
  watchCheapestPrice.className = 'price-column'
  watchResult.appendChild(watchCheapestPrice);
  var watchBuyLink = document.createElement('h3');
  watchBuyLink.textContent = 'Buy Now';
  watchBuyLink.className = 'save-buy';
  watchResult.appendChild(watchBuyLink);
  var buyButtons = document.querySelectorAll('.save-buy');
  for (var i = 0; i < buyButtons.length; i++) {
    buyButtons[i].addEventListener('click', buyNow2);
  }
}


function buyNow2(event) {
  console.log('the test works');
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  removeAllChildNodes(watchlistPrices);
  watchlistDiv.className = "hidden";
  searchResults.className = "hidden";
  var gameIdResult = this.parentNode.getAttribute("gameid");
  var prices = new XMLHttpRequest();
  prices.open("GET", "https://www.cheapshark.com/api/1.0/games?id=" + gameIdResult)
  prices.responseType = 'json';
  prices.addEventListener('load', function () {
    for (var i = 0; i < this.response.deals.length; i++) {
      watchlistPrices.className = "watchlist-prices";
      var priceResult = document.createElement('li');
      priceResult.className = "result-row";
      watchlistPrices.appendChild(priceResult);
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

function loadWatchlist(event) {
  for (i = 0; i < watchlist.entries.length; i++) {
    addToWatchlist(watchlist.entries[i]);
  }
}

function switchToWatchlist() {
  watchlistDiv.classList.remove("hidden");
  watchlistResults.classList.remove("hidden");
  searchForm.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  searchForm.className = "search-move";
}

function goToHome(event) {
  function removeAllChildNodes() {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  // removeAllChildNodes(watchlistPrices);
  searchForm.className = "search-form";
  logosRow.className = "logo-images";
  homePageText.className = "main-text";
  watchlistDiv.className = "hidden";
  watchlistPrices.className = "hidden"
}

function goToWatchlist(event) {
  function removeAllChildNodes() {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  removeAllChildNodes(watchlistPrices);
  watchlistPrices.className = "hidden"
  switchToWatchlist()
}
