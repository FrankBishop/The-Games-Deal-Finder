var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('#game-search');
var logosRow = document.querySelector('.logo-images');
var homePageText = document.querySelector('.main-text');
var searchResults = document.querySelector('.search-results');
var storeListings = document.querySelector('.store-listings-results');
var watchlistDiv = document.querySelector('.watchlist-div');
var watchlistResults = document.querySelector('.watchlist-results');
var homeLink = document.querySelector('.home-link');
var watchlistLink = document.querySelector('.watch-link');
var watchlistPrices = document.querySelector('.watchlist-prices');
var deleteModal = document.querySelector('.modal');
var noButton = document.querySelector('.no-button');
var yesButton = document.querySelector('.yes-button');
var emptyWatch = document.querySelector('.empty');
var loadingSpinner = document.querySelector('.loading-spinner');
var backButton = document.querySelector('.backToListings');
var backButton2 = document.querySelector('.backToWatchlist');

var storesList = [];

window.addEventListener('DOMContentLoaded', loadWatchlist);
searchForm.addEventListener('submit', submitAction);
homeLink.addEventListener('click', goToHome);
watchlistLink.addEventListener('click', goToWatchlist);
noButton.addEventListener('click', closeModal);
yesButton.addEventListener('click', deleteGame);
window.addEventListener('DOMContentLoaded', focusSearch);
backButton.addEventListener('click', goBack);
backButton2.addEventListener('click', goToWatchlist);

function focusSearch() {
  searchBar.focus();
}

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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function submitAction(event) {
  event.preventDefault();
  searchResults.classList.remove("hidden");
  removeAllChildNodes(searchResults);
  removeAllChildNodes(storeListings);
  removeAllChildNodes(watchlistPrices);
  watchlistDiv.className = "hidden";
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  var searchRequest = searchBar.value;
  searchForm.reset();
  getResults(searchRequest);
}

function getResults(searchRequest) {
  backButton.classList.add('hidden');
  backButton2.classList.add('hidden');
  loadingSpinner.classList.remove('hidden');
  searchResults.className = "search-results";
  var search = new XMLHttpRequest();
  search.open('GET', 'https://www.cheapshark.com/api/1.0/games?title=' + searchRequest + '&limit=10');
  search.responseType = 'json';
  search.addEventListener('load', function () {
    loadingSpinner.classList.add('hidden');
    if (this.response.length === 0) {
      var noResults = document.createElement('h1');
      noResults.textContent = "There are no results for your search"
      searchResults.appendChild(noResults);
    }
    if (!this.response) {
      var serverIssues = document.createElement('h1');
      serverIssues.textContent = "The server is having connection issues, please try again";
      searchResults.appendChild(serverIssues);
    }
    for (var i = 0; i < this.response.length; i++) {
      var result = document.createElement('li');
      searchResults.appendChild(result);
      result.className = "result-row";
      var thumbnail = document.createElement('img');
      thumbnail.setAttribute('src', this.response[i].thumb);
      result.appendChild(thumbnail);
      thumbnail.className = 'list-image picture-column';
      var title = document.createElement('h3');
      title.textContent = this.response[i].external;
      title.className = 'title-column';
      result.appendChild(title);
      var cheapestPrice = document.createElement('h3');
      cheapestPrice.textContent = '$' + this.response[i].cheapest;
      cheapestPrice.className = 'price-column';
      result.appendChild(cheapestPrice);
      var buttonHolder = document.createElement('div');
      result.appendChild(buttonHolder);
      var buyLink = document.createElement('button');
      buyLink.textContent = 'Buy';
      // buyLink.className = 'buy-column';
      buttonHolder.appendChild(buyLink);
      var gameId = result.setAttribute('gameid', this.response[i].gameID);
      var gameTitle = result.setAttribute('game-title', this.response[i].external);
      var gamePrice = result.setAttribute('cheapest-price', this.response[i].cheapest);
      var imageAttribute = result.setAttribute('image', this.response[i].thumb);
      var saveButton = document.createElement('button');
      saveButton.textContent = "Save";
      // saveButton.className = "save-button save";
      buttonHolder.appendChild(saveButton);
      buyLink.addEventListener('click', buyNow);
      saveButton.addEventListener('click', saveGame);
      buttonHolder.className = "button-holder";
    }
  });
  search.send();
}

function buyNow(event) {
  backButton.classList.remove('hidden');
  backButton2.classList.add('hidden');
  storeListings.classList.add('hidden');
  searchResults.className = "hidden";
  var gameIdResult = this.parentNode.getAttribute("gameid");
  var prices = new XMLHttpRequest();
  prices.open("GET", "https://www.cheapshark.com/api/1.0/games?id=" + gameIdResult)
  prices.responseType = 'json';
  prices.addEventListener('load', function () {
    loadingSpinner.classList.add('hidden');
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
      storeName.className = 'title-column';
      priceResult.appendChild(storeName);
      var storePrice = document.createElement('h2');
      storePrice.textContent = '$' + this.response.deals[i].price;
      storePrice.className = 'price-column';
      priceResult.appendChild(storePrice);
    }

  });
  prices.send();
}

function saveGame(event) {
  watchlist.nextEntryId++;
  var target = event.target;
  var listing = target.parentNode;
  searchResults.className = "hidden";
  var gameToSave = {
    title: listing.getAttribute("game-title"),
    price: listing.getAttribute("cheapest-price"),
    image: listing.getAttribute("image"),
    gameID: listing.getAttribute("gameid"),
    entryId: watchlist.nextEntryId
  }
  gameToSave.entryId = watchlist.nextEntryId;
  watchlist.entries.unshift(gameToSave);
  addToWatchlist(gameToSave);
  switchToWatchlist();
}

function addToWatchlist(item) {
  emptyWatch.className = "hidden";
  var watchResult = document.createElement('li');
  watchlistResults.prepend(watchResult);
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
  watchCheapestPrice.textContent = '$' + item.price;
  watchCheapestPrice.className = 'price-column';
  watchResult.appendChild(watchCheapestPrice);
  var watchBuyLink = document.createElement('button');
  watchBuyLink.textContent = 'Buy Now';
  watchBuyLink.className = 'save-buy';
  watchResult.appendChild(watchBuyLink);
  var deleteLink = document.createElement('button');
  deleteLink.textContent = 'Delete';
  deleteLink.className = 'delete delete-mini';
  watchResult.appendChild(deleteLink);
  watchBuyLink.addEventListener('click', buyFromWatch);
  deleteLink.addEventListener('click', deleteItem);
  watchResult.setAttribute('entryid', item.entryId);
}


function buyFromWatch(event) {
  backButton.classList.add('hidden');
  backButton2.classList.remove('hidden');
  loadingSpinner.classList.remove('hidden');
  loadingSpinner.classList.remove('hidden');
  removeAllChildNodes(watchlistPrices);
  watchlistDiv.className = "hidden";
  searchResults.className = "hidden";
  var gameIdResult = this.parentNode.getAttribute("gameid");
  var prices = new XMLHttpRequest();
  prices.open("GET", "https://www.cheapshark.com/api/1.0/games?id=" + gameIdResult);
  prices.responseType = 'json';
  prices.addEventListener('load', function () {
    loadingSpinner.classList.add('hidden');
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
      storeName.className = 'title-column';
      priceResult.appendChild(storeName);
      var storePrice = document.createElement('h2');
      storePrice.textContent = '$' + this.response.deals[i].price;
      storePrice.className = 'price-column';
      priceResult.appendChild(storePrice);
    }
  });
  prices.send();
}

function deleteItem(event) {
  watchlist.gameToRemove = null;
  watchlist.entryToRemove = null;
  deleteModal.className = "modal";
  var deleteTarget = event.target;
  var deleteTargetParent = deleteTarget.parentNode;
  var deleteTargetEntry = deleteTargetParent.getAttribute('entryid');
  var deleteGameListing = document.querySelector('[entryid="' + deleteTargetEntry + '"]');
  watchlist.gameToRemove = deleteTargetEntry;
  watchlist.entryToRemove = deleteGameListing;
}

function deleteGame(event) {
  var gameToDelete;
  function findIndex() {
    for (var i = 0; i < watchlist.entries.length; i++) {
      if (watchlist.entries[i].entryId == watchlist.gameToRemove) {
        watchlist.entryToRemove.remove();
        gameToDelete = i;
        watchlist.entries.splice(gameToDelete, 1);
      }
    }
  }
  findIndex();
  deleteModal.className = "hidden";
  if (watchlist.entries.length === 0) {
    emptyWatch.classList.remove("hidden");
  }
}

function closeModal(event) {
  deleteModal.className = "hidden";
}

function loadWatchlist(event) {
  for (i = watchlist.entries.length - 1; i >= 0; i--) {
    addToWatchlist(watchlist.entries[i]);
    watchlist.nextEntryId++;
  }
}

function switchToWatchlist() {
  watchlistDiv.classList.remove("hidden");
  watchlistResults.classList.remove("hidden");
  logosRow.className = "hidden";
  homePageText.className = "hidden";
  storeListings.className = "hidden";
  backButton.classList.add('hidden');
  backButton2.classList.add('hidden');
}

function goToHome(event) {
  backButton.classList.add('hidden');
  backButton2.classList.add('hidden');
  removeAllChildNodes(storeListings);
  removeAllChildNodes(watchlistPrices);
  removeAllChildNodes(searchResults);
  searchForm.className = "search-form";
  logosRow.className = "logo-images";
  homePageText.className = "main-text";
  watchlistDiv.className = "hidden";
  watchlistPrices.className = "hidden";
  searchResults.className = "hidden";
}

function goToWatchlist(event) {
  backButton.classList.add('hidden');
  backButton2.classList.add('hidden');
  if (watchlist.entries.length === 0) {
    emptyWatch.classList.remove("hidden");
  }
  removeAllChildNodes(watchlistPrices);
  removeAllChildNodes(searchResults);
  removeAllChildNodes(storeListings);
  switchToWatchlist();
}

function goBack(event) {
  backButton.classList.add('hidden');
  backButton2.classList.add('hidden');
  searchResults.className = "search-results";
  removeAllChildNodes(storeListings);
}
