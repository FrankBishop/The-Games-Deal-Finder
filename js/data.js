/* exported data */

var watchlist = {
  entries: [],
  nextEntryId: 0,
  gameToRemove: null,
  entryToRemove: null
};

window.addEventListener('beforeunload', localStorageSet);

var previousWatchlist = localStorage.getItem('watchlistData');
if (previousWatchlist !== null) {
  watchlist = JSON.parse(previousWatchlist);
}


function localStorageSet(event) {
  var storedWatchlist = JSON.stringify(watchlist);
  localStorage.setItem('watchlistData', storedWatchlist);
}
