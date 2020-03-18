// the used links
var links = [
	"agolajko.typeform.com/to/JuQv2J",
    "agolajko.typeform.com/to/BIAP5m",
    "agolajko.typeform.com/to/Y05SUM",
    "agolajko.typeform.com/to/DucjRG",
    "agolajko.typeform.com/to/txCdk3"];

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