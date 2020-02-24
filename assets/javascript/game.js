// @ts-check
//unanswered questions 10feb2020:
//  1. how to playAudio on load, stack overflow suggestions below don't work ... yet, autoplay works on GitHub sort of, not locally
//  2. how to pauseAudio onclick of youtube iframe embed
//  3. local youtube embed does not work, only on GitHub

//document.getElementById("composerClues").addEventListener("click", pauseAudio());

//document.getElementsByTagName("body").addEventListener("load", startup());

// document.getElementById("gameStatus").addEventListener("load", startup());

// const startup = () => {
//     timerIDmusic = setInterval(
//         () => playAudio(),
//         1000);
// }

// const shutdown = () => {
//     clearInterval(timerIDmusic);
// }

/**
 * Called from oninput input event, each time user touches key
 * @function searchName
 */
const searchName = () => {
    /**
     * User input assigned in lower case
     * @type {string}
     */
    var userInput = composerName.value.toLowerCase();
    if (!gameOn) { restart(); return; } //after success, any next keystroke restarts game. 
    if (userInput.length < previousUserInputLength) { --previousUserInputLength; return; }// if deleting chars don't update hangman
    else previousUserInputLength = userInput.length;
    console.log("userInput: ", userInput, " gameComposer: ", gameComposer);
    console.log("call to handleInterim userInput: ", userInput.slice(-1));
    if (userInput === gameComposer) handleSuccess();
    else handleInterim(userInput);
}



/**
 * Called from searchName when match to composerName is found
 * @function handleSuccess
 */
const handleSuccess = () => {
    composerHelp.innerHTML = "SUCCESS ... GREAT WORK!";
    hangmanPhoto.src = "./assets/img/hangmanSuccess.png";
    animateCSS('#hangmanPhoto', 'tada');
    clearInterval(timerID);
    //pauseAudio();
    playVideo();
    //document.getElementById("ytp-button").addEventListener("click", pauseAudio());
    //document.getElementById("composerClues").addEventListener("click", pauseAudio());
    //document.getElementById("gameScore").focus();
    gameOn = false;

}


/**
 * Called from searchName oninput with each keystroke but composerName not matched yet, 
 *      add good guesses to good guess string,
 *      add bad guesses to bad guess string,
 *      display both good and bad guesses in composerHelp field.
 *  @function handleInterim
    @param {string} userInput ... from searchName, user's latest composerName guess
 */
const handleInterim = (userInput) => {
    console.log("handleInterim userInput: ", userInput.slice(-1), "index = -1?: ", gameComposer.indexOf(userInput.slice(-1)));
    if (gameComposer.indexOf(userInput.slice(-1)) >= 0) {
        composerNameGuess = handleGoodCharacter(composerNameGuess, gameComposer.indexOf(userInput.slice(-1)), userInput.slice(-1));
        console.log("composerNameGuess: ", composerNameGuess);
    } else {// if char not in composerName
        notInComposerName = notInComposerName + userInput.slice(-1);
        ++characterCount;
        updateHangman(characterCount);
    }

    switch (characterCount) {
        case 0: composerHelp.innerHTML = "Hint: " + composerNameGuess; break;
        case 1: composerHelp.innerHTML = "Hint: " + composerNameGuess; break;
        case 2: composerHelp.innerHTML = "Hint: " + composerNameGuess.substr(0, gameComposer.length - 1) + gameComposer.slice(-1); break;
        case 3: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 1) + composerNameGuess.substr(1, composerNameGuess.length - 2) + gameComposer.slice(-1); break;
        case 4: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 1) + composerNameGuess.substr(1, composerNameGuess.length - 3) + gameComposer.slice(-2); break;
        case 5: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2); break;
        case 6: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2) + " 5 guesses left"; break;
        case 7: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2) + " 4 guesses left"; break;
        case 8: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2) + " 3 guesses left"; break;
        case 8: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2) + " 2 guesses left"; break;
        case 10: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2) + " 1 guesses left"; break;
        case 11: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + composerNameGuess.substr(2, composerNameGuess.length - 4) + gameComposer.slice(-2); break;
        default: break;
    }
    if (notInComposerName !== "" && (composerHelp.innerHTML.indexOf("Composer")) == -1) composerHelp.innerHTML = composerHelp.innerHTML + "  Not in Composer name: " + notInComposerName;
    else composerHelp.innerHTML = composerHelp.innerHTML + notInComposerName.slice(-1);
    if (characterCount >= 11) handleFailure();
}


/**
 * Called from handleInterim case to fill out the un-guessed section of composerGuess with underscores
 * @function middleString
 * @param {number} stringLength  Build a string of underscores to fill the spaces in composerGuess field
 * @returns {string} of underscores of stringLength
 */
const middleString = (stringLength) => {
    /**
     * @type {string}
     */
    var underscoreString = "";
    for (var i = 0; i < stringLength; ++i) underscoreString = underscoreString + "_";
    return (underscoreString);
}

/**
 * Called from handleInterim when a valid guess entered is added to the string of good guesses,
 *          add the correctly guessed letter chr into the string str at position index.
 * @function handleGoodCharacter
 * @param {string} str String to have chr inserted at index
 * @param {number} index Location to insert chr
 * @param {string} chr Character to be inserted, last in string userInput from searchName
 * @returns {string} with chr inserted in str at index
 */
const handleGoodCharacter = (str, index, chr) => {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

/** 
 * Called from handleInterim when characterCount > 11 i.e. max guesses exceeded,
 *      when max guesses exceeded shut everything down, zero everything out, display failure hangman
 * @function handleFailure
 * */
const handleFailure = () => {
    gameScore = 0;
    // gameScoreId.attributes.ariaValuenow = Math.round(gameScore / 5).toString();
    // gameScoreId.style.width = Math.round(gameScore / 5).toString() + "%";
    gameScoreId.innerHTML = gameScore;
    clearInterval(timerID);
    gameOn = false;
    composerHelp.innerHTML = "Sorry, you blew it, it was: " + gameComposer.charAt(0).toUpperCase() + gameComposer.slice(1);  //str.charAt(0).toUpperCase() + str.slice(1);
    hangmanPhoto.src = "./assets/img/hangmanOuch.png"
    animateCSS('#hangmanPhoto', 'shake');
}

/** 
 * Called from 3 places: navbar start, start game button, or from composerName field oninput after success
 * @function restart
*/
const restart = () => {
    gameOn = true;
    characterCount = 0;
    previousUserInputLength = 0;
    updateHangman(characterCount);
    chooseComposer();
    notInComposerName = "";
    composerNameGuess = middleString(gameComposer.length);
    composerName.value = "";
    composerHelp.innerHTML = "Take your best shot";
    composerClues.innerHTML = gameInstructions;
    animateCSS('#composerClues', 'zoomInRight');
    composerName.focus();
    gameScore = gameStartScore;
    timerID = setInterval(
        () => updateScore(),
        1000);
    console.log("restart");
}

/** Called from the one second timerID within restart()
 * @function updateScore
 */
const updateScore = () => {
    if (characterCount == 0) gameScore = gameScore - hints;
    gameScore = gameScore - (hints * characterCount); // score drops faster if user uses more characters
    gameScoreId.innerHTML = gameScore;
    gameScoreId.attributes.ariaValuenow = Math.round(gameScore / 5).toString();
    gameScoreId.style.width = Math.round(gameScore / 5).toString() + "%";
    if (gameScore <= 0) handleFailure();
}

/** 
 * Called from restart() and handleInterim to update the image of the hangman to latest guess count
 * @function updateHangman
 * @param {number} count  Used to index to image files for corresponding guess
*/
const updateHangman = (count) => {
    if (count >= maxCharacters) handleFailure();
    else {
        var imageURL = "./assets/img/hangman" + count.toString() + ".png";
        // if restart then zoom out old zoom in new
        if (count == 0) animateCSS('#hangmanPhoto', 'zoomOutLeft', function () {
            hangmanPhoto.src = imageURL;
            animateCSS('#hangmanPhoto', 'zoomInLeft');
        });
        // else regular game processing, change from hangmanPhoto n-1 to hangmanPhoto n
        else {
            hangmanPhoto.src = imageURL;
            animateCSS('#hangmanPhoto', 'headShake');
        }
    }
}

/** Called from restart to choose a new composer from the array of 15 composers
 * @function chooseComposer
*/
const chooseComposer = () => {
    composerIndex = parseInt(Math.random() * 17);
    console.log("random choice of Composer:  ", composerArray[composerIndex].lastName);
    gameComposer = composerArray[composerIndex].lastName;
    gameComposerVideo = composerArray[composerIndex].video;
    //console.log("random choice of Composer video:  ", composerArray[composerIndex].video);
    animateCSS('#composerPhoto', 'zoomOutRight', function () {
        composerPhoto.src = "./assets/img/" + gameComposer + ".jpeg";
        animateCSS('#composerPhoto', 'zoomInRight')
    });
    //composerAudio.src = "./assets/audio/" + "debussy" + ".mp3";
    composerAudio.src = "./assets/audio/" + gameComposer + ".mp3";
    playAudio();
}

/** 
 * Called from restart() or from play music button on home screen
 * @function playAudio
 */
const playAudio = () => {
    composerAudio.play();
}

/** 
 * Called from pause music button on home screen
 * @function pauseAudio
 */
const pauseAudio = () => {
    composerAudio.pause();
}

/**
 * Called from handleSuccess when composerName found offers youtube video in composerClues div on home screen
 */
const playVideo = () => {
    composerClues.innerHTML = gameComposerVideo;
    animateCSS('#composerClues', 'zoomInRight');
}

/**
 * Called from various points to animate unload load of content in divs,
 *      from GitHub animate.css library
 * @async
 * @function animateCSS
 * @param {*} element div id/class/tag to be modified
 * @param {*} animationName from list of animateCSS classes
 * @param {*} [callback] required if unloading before loading div with content, async
 */
const animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}
