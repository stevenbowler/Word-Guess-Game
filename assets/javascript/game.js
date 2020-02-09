
// called from user input each time oninput each time user touches key   tieStr.indexOf(caseCompare)
searchName = () => {
    userInput = composerName.value.toLowerCase();
    if (!gameOn) { restart(); return; } //after success, any next keystroke restarts game. 
    if (userInput.length < previousUserInputLength) return; // if deleting chars don't update hangman
    else previousUserInputLength = userInput.length;
    console.log("userInput: ", userInput, " gameComposer: ", gameComposer);
    if (userInput === gameComposer) handleSuccess();
    else handleInterim();
}

// called from searchName when match to composerName is found
handleSuccess = () => {
    composerHelp.innerHTML = "success";
    hangmanPhoto.src = "./assets/img/hangmanSuccess.png";
    clearInterval(timerID);
    playVideo();
    //document.getElementById("gameScore").focus();
    gameOn = false;

}

playVideo = () => {

    composerClues.innerHTML = gameComposerVideo;

}

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

// animateCSS('.my-element', 'bounce')

// // or
// animateCSS('.my-element', 'bounce', function() {
//   // Do something after animation
// })

// called from searchName when oninput with each keystroke but composerName not found yet
handleInterim = () => {
    composerHelp.innerHTML = "nice try, not yet";
    ++characterCount;
    updateHangman(characterCount);

    switch (characterCount) {
        case 1: composerHelp.innerHTML = "Hint: " + gameComposer.length + " letters."; break;
        case 2: composerHelp.innerHTML = "Hint: " + middleString(gameComposer.length - 1) + gameComposer.slice(-1); break;
        case 3: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 1) + middleString(gameComposer.length - 2) + gameComposer.slice(-1); break;
        case 4: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 1) + middleString(gameComposer.length - 3) + gameComposer.slice(-2); break;
        case 5: composerHelp.innerHTML = "Hint: " + gameComposer.slice(0, 2) + middleString(gameComposer.length - 4) + gameComposer.slice(-2); break;
        default: break;
    }
    if (characterCount >= 11) handleFailure();
}

middleString = (stringLength) => {
    underscoreString = "";
    for (i = 0; i < stringLength; ++i) underscoreString = underscoreString + " _";
    return (underscoreString);
}


//clean up if failed to either guess in 11 characters or finish in time before score/timer gets to zero
handleFailure = () => {
    gameScore = 0;
    clearInterval(timerID);
    gameOn = false;
    composerHelp.innerHTML = "Sorry, you blew it, that's gotta hurt";
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
    composerName.value = "";
    composerHelp.innerHTML = "Take your best shot";
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
        hangmanPhoto.src = imageURL;
        animateCSS('#hangmanPhoto', 'bounce');
    }
}

// called from restart to choose a new composer from the array of 15 composers
chooseComposer = () => {
    composerIndex = parseInt(Math.random() * 17);
    console.log("random choice of Composer:  ", composerArray[composerIndex].lastName);
    gameComposer = composerArray[composerIndex].lastName;
    gameComposerVideo = composerArray[composerIndex].video;
    //console.log("random choice of Composer video:  ", composerArray[composerIndex].video);
    composerPhoto.src = "./assets/img/" + gameComposer + ".jpeg";
    animateCSS('#composerPhoto', 'zoomInLeft');
}

