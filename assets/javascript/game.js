const composerNames = ["beethoven", "mozart", "bach", "wagner", "haydn", "brahms", "schubert", "schumann", "debussy", "handel", "vivaldi", "chopin", "dvorak", "mendelssohn", "stravinsky", "verdi", "strauss"];
const maxCharacters = 11;
const gameStartScore = 500;
var characterCount = 0;
var gameScore = gameStartScore;
var hints = 5;
var gameOn = true;
var restartYes = false;
var gameComposer = "unknown";


// called from user input each time oninput each time user touches key   tieStr.indexOf(caseCompare)
searchName = () => {
    userInput = document.getElementById("composerName").value.toLowerCase();
    console.log("userInput: ", userInput, " gameComposer: ", gameComposer);
    if (!gameOn) { restart(); return; } //restartYes = confirm("do you want to restart? "); 
    if (userInput === gameComposer) handleSuccess();
    else handleInterim();
}

// called from searchName when match to composerName is found
handleSuccess = () => {
    document.getElementById("composerHelp").innerHTML = "success";
    document.getElementById("hangmanPhoto").src = "./assets/img/hangmanSuccess.png";
    clearInterval(timerID);
    playVideo();
    //document.getElementById("gameScore").focus();
    gameOn = false;

}

playVideo = () => {

    document.getElementById("composerClues").innerHTML = gameComposerVideo;

}

// called from searchName when oninput with each keystroke but composerName not found yet
handleInterim = () => {
    document.getElementById("composerHelp").innerHTML = "nice try, not yet";
    ++characterCount;
    updateHangman(characterCount);

    switch (characterCount) {
        case 1: document.getElementById("composerHelp").innerHTML = "Composer name has " + gameComposer.length + " letters."; break;
        case 2: document.getElementById("composerHelp").innerHTML = "Composer name ends with: " + gameComposer.slice(-1); break;
        case 3: document.getElementById("composerHelp").innerHTML = "Composer name starts with: " + gameComposer.slice(0, 1); break;
        case 4: document.getElementById("composerHelp").innerHTML = "Composer name last two letters: " + gameComposer.slice(-2); break;
        case 5: document.getElementById("composerHelp").innerHTML = "Composer name first two letters: " + gameComposer.slice(0, 2); break;
        default: break;
    }
    if (characterCount >= 11) handleFailure();
}

//clean up if failed to either guess in 11 characters or finish in time before score/timer gets to zero
handleFailure = () => {
    gameScore = 0;
    clearInterval(timerID);
    gameOn = false;
    document.getElementById("composerHelp").innerHTML = "Sorry, you blew it, that's gotta hurt";
    document.getElementById("hangmanPhoto").src = "./assets/img/hangmanOuch.png"
}

// called from 3 places: navbar start, start game button, or from composerName field oninput after success
restart = () => {
    gameOn = true;
    characterCount = 0;
    updateHangman(characterCount);
    chooseComposer();
    document.getElementById("composerName").value = "";
    document.getElementById("composerHelp").innerHTML = "Take your best shot";
    document.getElementById("composerName").focus();
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
    document.getElementById("gameScore").value = gameScore;
    if (gameScore <= 0) handleFailure();
}

// called from restart() to update the image of the hangman
updateHangman = (count) => {
    if (count >= maxCharacters) handleFailure();
    else {
        imageURL = "./assets/img/hangman" + count.toString() + ".png";
        //console.log(imageURL);
        // $("#hangmanPhoto").animate({
        //     src: imageURL
        // });
        document.getElementById("hangmanPhoto").src = imageURL;
    }
}

// called from restart to choose a new composer from the array of 15 composers
chooseComposer = () => {
    composerIndex = parseInt(Math.random() * 17);
    console.log("random choice of Composer:  ", composerArray[composerIndex].lastName);
    gameComposer = composerArray[composerIndex].lastName;
    gameComposerVideo = composerArray[composerIndex].video;
    //console.log("random choice of Composer video:  ", composerArray[composerIndex].video);
    document.getElementById("composerPhoto").src = "./assets/img/" + gameComposer + ".jpeg";
}

