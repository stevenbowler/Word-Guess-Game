const composerNames = ["beethoven", "mozart", "bach", "wagner", "haydn", "brahms", "schubert", "schumann", "debussy", "handel", "vivaldi", "chopin", "dvorak", "mendelssohn", "stravinsky", "verdi", "strauss"];
const maxCharacters = 11;
const gameStartScore = 500;
const gameInstructions =
    "Click <strong>Start Game</strong> guess composer's name.  " +
    "You have 30 seconds to live. " +
    "Or, get hung with 11 bad guesses. " +
    "Whichever comes first. " +
    "You will be provided additional clues. " +
    "But more clues and time used, means a lower final score.";

// form fields accessed
const composerName = document.getElementById("composerName");
const composerPhoto = document.getElementById("composerPhoto");
const composerHelp = document.getElementById("composerHelp");
const hangmanPhoto = document.getElementById("hangmanPhoto");
const composerClues = document.getElementById("composerClues");
const gameScoreId = document.getElementById("gameScore");
const composerAudio = document.getElementById("composerAudio");

const backSpace = 8;

var characterCount = 0;
var gameScore = gameStartScore;
var hints = 5;
var gameOn = true;
var restartYes = false;
var gameComposer = "unknown";
var previousUserInputLength = 0;

var composerArray = [
    { lastName: "bach", video: '<iframe src="https://www.youtube.com/embed/6JQm5aSjX6g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "mozart", video: '<iframe src="https://www.youtube.com/embed/Rb0UmrCXxVA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "debussy", video: '<iframe src="https://www.youtube.com/embed/OUx6ZY60uiI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "beethoven", video: '<iframe src="https://www.youtube.com/embed/QkQapdgAa7o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "strauss", video: '<iframe src="https://www.youtube.com/embed/d4AmYBhGBfM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "dvorak", video: '<iframe src="https://www.youtube.com/embed/3nSEMJW7UqE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "mendelssohn", video: '<iframe src="https://www.youtube.com/embed/sWiCHa9DFOY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "brahms", video: '<iframe src="https://www.youtube.com/embed/zKrxesI3ziE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "haydn", video: '<iframe src="https://www.youtube.com/embed/EmZF3kBZQ6E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "schubert", video: '<iframe src="https://www.youtube.com/embed/iiChxN0T2kA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "vivaldi", video: '<iframe src="https://www.youtube.com/embed/O6NRLYUThrY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "chopin", video: '<iframe src="https://www.youtube.com/embed/wygy721nzRc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "stravinsky", video: '<iframe src="https://www.youtube.com/embed/ne4PoC7V0Mk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "handel", video: '<iframe src="https://www.youtube.com/embed/joVkx20oVIg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "wagner", video: '<iframe src="https://www.youtube.com/embed/4i0TnNI6U-w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "verdi", video: '<iframe src="https://www.youtube.com/embed/P6sz5b2w9Zc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' },
    { lastName: "schumann", video: '<iframe src="https://www.youtube.com/embed/QqEWbOzL_GQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' }
];

//beethoven
// current <iframe width="956" height="538" src="https://www.youtube.com/embed/QkQapdgAa7o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
// 1st try failed    <iframe src="https://www.youtube.com/embed/W-fFHeTX70Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>