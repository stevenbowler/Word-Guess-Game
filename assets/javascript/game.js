//playAudio();


//document.getElementsByTagName("body").addEventListener("load", playAudio());

// document.getElementById("gameStatus").addEventListener("load", playAudio());

// called from user input each time oninput each time user touches key   tieStr.indexOf(caseCompare)
searchName = () => {
    userInput = composerName.value.toLowerCase();
    if (!gameOn) { restart(); return; } //after success, any next keystroke restarts game. 
    if (userInput.length < previousUserInputLength) { --previousUserInputLength; return; }// if deleting chars don't update hangman
    else previousUserInputLength = userInput.length;
    console.log("userInput: ", userInput, " gameComposer: ", gameComposer);
    console.log("call to handleInterim userInput: ", userInput.slice(-1));
    if (userInput === gameComposer) handleSuccess();
    else handleInterim(userInput);
}


// called from searchName when match to composerName is found
handleSuccess = () => {
    composerHelp.innerHTML = "SUCCESS ... GREAT WORK!";
    hangmanPhoto.src = "./assets/img/hangmanSuccess.png";
    animateCSS('#hangmanPhoto', 'tada');
    clearInterval(timerID);
    pauseAudio();
    playVideo();
    //document.getElementById("gameScore").focus();
    gameOn = false;

}




// called from searchName when oninput with each keystroke but composerName not found yet
handleInterim = (userInput) => {
    console.log("handleInterim userInput: ", userInput.slice(-1), "index = -1?: ", gameComposer.indexOf(userInput.slice(-1)));
    if (gameComposer.indexOf(userInput.slice(-1)) >= 0) {
        composerNameGuess = handleGoodCharacter(composerNameGuess, gameComposer.indexOf(userInput.slice(-1)), userInput.slice(-1));
        console.log("composerNameGuess: ", composerNameGuess);
        //return;
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
    if (notInComposerName !== "") composerHelp.innerHTML = composerHelp.innerHTML + "  Not in Composer name: " + notInComposerName;
    if (characterCount >= 11) handleFailure();
}


middleString = (stringLength) => {
    underscoreString = "";
    for (i = 0; i < stringLength; ++i) underscoreString = underscoreString + "_";
    return (underscoreString);
}

handleGoodCharacter = (str, index, chr) => {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

// handleGoodCharacter = (char) => {
//     composerNameGuess[gameComposer.indexOf(char)] = char;
// }

//clean up if failed to either guess in 11 characters or finish in time before score/timer gets to zero
handleFailure = () => {
    gameScore = 0;
    clearInterval(timerID);
    gameOn = false;
    composerHelp.innerHTML = "Sorry, you blew it, it was: " + gameComposer.charAt(0).toUpperCase() + gameComposer.slice(1);  //str.charAt(0).toUpperCase() + str.slice(1);
    hangmanPhoto.src = "./assets/img/hangmanOuch.png"
    animateCSS('#hangmanPhoto', 'shake');
}


// called from 3 places: navbar start, start game button, or from composerName field oninput after success
restart = () => {
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


// called from the one second timerID within restart()
updateScore = () => {
    if (characterCount == 0) gameScore = gameScore - hints;
    gameScore = gameScore - (hints * characterCount); // score drops faster if user uses more characters
    gameScoreId.innerHTML = gameScore;
    gameScoreId.attributes.ariaValuenow = Math.round(gameScore / 5).toString();
    gameScoreId.style.width = Math.round(gameScore / 5).toString() + "%";
    if (gameScore <= 0) handleFailure();
}


// called from restart() to update the image of the hangman
updateHangman = (count) => {
    if (count >= maxCharacters) handleFailure();
    else {
        imageURL = "./assets/img/hangman" + count.toString() + ".png";
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

// called from restart to choose a new composer from the array of 15 composers
chooseComposer = () => {
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


playAudio = () => {
    composerAudio.play();
}

pauseAudio = () => {
    composerAudio.pause();
}

playVideo = () => {
    composerClues.innerHTML = gameComposerVideo;
    animateCSS('#composerClues', 'zoomInRight');
}


// from GitHub animate.css library
animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}
