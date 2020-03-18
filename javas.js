// the used links
var links = [
    "bbc.com",
    "google.com",
    "youtube.com",
    "facebook.com"];

openStuff = function () {
    // get a random number between 0 and the number of links
    var randIdx = Math.random() * links.length;
    // round it, so it can be used as array index
    randIdx = parseInt(randIdx, 10);
    // construct the link to be opened
    var link = 'http://' + links[randIdx];
    // open it in a new window / tab (depends on browser setting)
    window.open(link);
};