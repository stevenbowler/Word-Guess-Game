/**
 * master list of composerNames included in this game
 * @constant
 * @type {Array<string>}
 * @default
 */
const composerNames = ["beethoven", "mozart", "bach", "wagner", "haydn", "brahms", "schubert", "schumann", "debussy", "handel", "vivaldi", "chopin", "dvorak", "mendelssohn", "stravinsky", "verdi", "strauss"];

/**
 * Maximum number of bad letter guesses
 * @constant
 * @type {number}
 * @default
 */
const maxCharacters = 11;

/**
 * Starting score for game, goes down with more time and bad guesses
 * @constant
 * @type {number}
 * @default
 */
const gameStartScore = 500;

/**
 * User instructions before game start
 * @constant
 * @type {string}
 * @default
 */
const gameInstructions =
    "Click <strong>Start Game</strong> guess composer's name.  " +
    "You have 30 seconds to live. " +
    "Or, get hung with 11 bad guesses. " +
    "Whichever comes first. " +
    "You will be provided additional clues. " +
    "But more clues and time used, means a lower final score.";


// aliases for html form fields accessed
/**
 * Alias for id=composerName getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const composerName = document.getElementById("composerName");

/**
 * Alias for id=composerPhoto getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const composerPhoto = document.getElementById("composerPhoto");

/**
 * Alias for id=composerHelp getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const composerHelp = document.getElementById("composerHelp");

/**
 * Alias for id=hangmanPhoto getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const hangmanPhoto = document.getElementById("hangmanPhoto");

/**
 * Alias for id=composerClues getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const composerClues = document.getElementById("composerClues");

/**
 * Alias for id=gameScoreId getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const gameScoreId = document.getElementById("gameScore");

/**
 * Alias for id=composerAudio getElement
 * @constant
 * @type {HTMLElement}
 * @default
 */
const composerAudio = document.getElementById("composerAudio");

/**
 * Constant fun
 * @constant
 * @type {string}
 * @default
 */
const backSpace = 8;

/**
 * Count of bad guesses 
 * @type {number}
 */
var characterCount = 0;

/**
 * Score for current game starts = gameStartScore 
 * @type {number}
 */
var gameScore = gameStartScore;

/**
 * Count of hints allowed, not currently used 
 * @type {number}
 */
var hints = 5;

/**
 * gameOn or off to disable clock and score updates
 * @type {boolean}
 */
var gameOn = true;

/**
 * Count of hints allowed, not currently used 
 * @type {boolean}
 */
var restartYes = false;

/**
 * Current full name guess from user
 * @type {string}
 */
var composerNameGuess = "";

/**
 * Each erroneous character guess is concatenated to this string then displayed to user
 * @type {number}
 */

var notInComposerName = "";

/**
 * Initialize randomly selected gameComposer Name to unknown
 * @type {string}
 */
var gameComposer = "unknown";

/**
 * Used in seachName to determine if current userInput different from previous userInput
 * @type {number}
 */
var previousUserInputLength = 0;

/**
 * Randomly selected composer index used to reference name and video embed string,
 *      could be used to add other elements to link in to game for the same composer
 * @type {number}
 */
var composerIndex = 0;

/**
 * Once composerIndex randomly selected this is set to correct composer video string 
 * @type {string}
 */
var gameComposerVideo = "";

/**
 * Composer names and associated embed youtube videos 
 * @type {Array<{lastName:string, video: string}>}
 */
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

