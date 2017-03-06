var guessed = [];
var guessedRight = [];
var available = [];
var hostWord = "";
var wordList = [];
var vowels = ['a','e','i','o','u'];
var guess = "";
var correctGuess = false;

var guesser = false;
var host = false;
var prog = "";
var badGuessCount = 0;
//Initializes tabs
//Hides game
$(function () {
    $('#tabs').tabs();

    start();
    wordCache();
    
});
function start(){
    $('.boxes').hide();
    $('.hangman').hide();
    $('.userInputGuess').hide();
    $('.userInputHostResponse').hide();
    $('.userInputHostWord').hide();
    $('.wordProgress').hide();
    $('.botGuess').hide();
    $('#winLose').hide();
    initAvailable();

    initRoleButtons();
    
}

//Initializes Available Characters Array
function initAvailable() {
    var index = 65;
    for (var i = 0; i < 26; i++) {
        available.push(String.fromCharCode(index));
        index++;
    }
}
//Initialized Role buttons
function initRoleButtons() {
    guesser = false;
    host = false;
    $('#guesser').show();
    $('#host').show();
    $('#guesser').click(function () {
        guesser = true;
        host = false;
        selectRole();
    });
    $('#host').click(function () {
        host = true;
        guesser = false;
        selectRole();
    });
}
//User selects if they want to guess or host
//Deletes the buttons and line of text after selection is made
function selectRole() {
    if (host) {
        $('.userInputHostWord').show();
        $(function () {
            $('#submitWord').attr('disabled',true);
            $('#word').keyup(function(){
                $('#submitWord').removeAttr('disabled');
            });
            $('#submitWord').click(function () {
                hostWord = $('#word').val().toUpperCase();
                if (hostWord === "" || hostWord === "") {
                    return;
                }
                $('#submitWord').attr('disabled',true);
                initHostButtons();
                initHostWord();
                wordProgress();
                $('.boxes').show();
                $('.userInputHostWord').hide();
                $('.userInputHostResponse').show();
                $('.wordProgress').show();
                $('#rememberWord').html(hostWord);
                $('.botGuess').show();
                wordProgress();
                setTimeout(botGuess, 3000);
            });
            
            
        });
        
    } else if (guesser) {
        $('.userInputGuess').show();
        $('.wordProgress').show();
        $('.boxes').show();
        var index = (Math.random() * wordList.length + 1).toFixed();
        hostWord = wordList[index].toUpperCase();

        initHostWord();

        console.log(hostWord);
        wordProgress();
        $(function () {
            $('#submitGuess').attr('disabled',true);
            $('#guess').keyup(function(){
                if($(this).val() !== '') {
                   $('#submitGuess').removeAttr('disabled');
                }
            });
                $('#submitGuess').click(function () {
                  guess = $('#guess').val().toUpperCase();
                  $('#guess').val("");
                  if (guess === "" || hasNumber(guess) || guessed.includes(guess))
                      return;
                  update();
                  wordProgress();
                  $('#submitGuess').attr('disabled',true);
                });  
            
            
        });
    }

    $('#guesser').hide();
    $('#host').hide();
    $('#chooseText').hide();
    initGame();
}
//Initialized the Hangman Scene, as well as fills in available text box
function initGame() {

    $('.hangman').fadeIn(750);
    $('#availChars').html(available);

}

function initHostButtons() {
    $('#goodGuess').click(function () {
        document.getElementById("badGuess").checked = false;
        if (hostWord.includes(guess)) {
            $('#uSureBoutDat').html("");
            document.getElementById("goodGuess").checked = false;
            wordProgress();
            update();
            
        } else {
            $('#uSureBoutDat').html("Are you sure about that?");
            document.getElementById("goodGuess").checked = false;
        }

    });
    $('#badGuess').click(function () {
        document.getElementById("goodGuess").checked = false;
        if (hostWord.includes(guess)) {
            $('#uSureBoutDat').html("Are you sure about that?");
            document.getElementById("badGuess").checked = false;
        } else {
            $('#uSureBoutDat').html("");
            document.getElementById("badGuess").checked = false;
            wordProgress();
            update();
            
        }
    });

}
function initHostWord() {
    prog = " ";
    for (var i = 0; i < hostWord.length; i++){
        if(hostWord.charAt(i) === " ")
            prog +="- ";
        else
            prog = prog + "_ ";
    }
}
//Runs multiple update methods to update the game
function update() {
    updateHangman();
    wordProgress();
    if(checkGameOver() === 1){
        
        $('#winLose').show().html("YOU WIN!!");
        setTimeout(reset,1500);
    } else if(checkGameOver() === 0){
        $('#winLose').show().html("YOU LOSE!!");
        setTimeout(reset,1500);
    }

}
//Updates Hangman after each guess
function updateHangman() {
    if (hostWord.includes(guess)) {
        correctGuess = true;
    } else
        correctGuess = false;
    if (!correctGuess) {
        badGuessCount++;
        if (badGuessCount >= 7)
            checkGameOver();
        else
            $('#boardState').attr("src", "gallows/hang" + badGuessCount + ".png");
    }
    updateAvailable();//Updates available characters remaining
    updateGuessed();//Updates all guessed characters
}
//Updates the Available text box after every guess
function updateAvailable() {
    if (available.includes(guess))
        available.splice(available.indexOf(guess), 1);
    $('#availChars').html(available);
}
//Updates the Guessed text box after every guess
function updateGuessed() {
    if (!guessed.includes(guess)) {
        guessed.push(guess);
        if (correctGuess){
            for(var i = 0; i < hostWord.length; i++){
                if(hostWord.charAt(i) === guess)
                    guessedRight.push(guess);
            }
        }    
    }
    $('#guessedChars').html(guessed);
}

//Checks to see if the game is over after each guess
function checkGameOver() {
    
    if (!prog.includes("_") && guesser){
        return 1;
    }else if(badGuessCount === 7 && host){
        return 1;
    } else if (guessedRight.length === hostWord.length && guesser){
        return 1;
    }else if(guessedRight.length === hostWord.length && host){
        return 0;
    } else if (badGuessCount === 7 && guesser){
        return 0;
    }else{
        if(host)
            setTimeout(botGuess, 1000);
        return -1;
    }
}
//The bot returns a random character wit    hin the available array
function botGuess() {
    var ran = (Math.random() * available.length).toFixed();
    console.log(ran);
//    if(!allVowelsGuessed()){
//        if(Math.random() <.5){
//            g
//        }
//    }
    if(guessedRight.length === hostWord.length-1 ){
        if(Math.random() <=.5){
            for(var i = 0; i < hostWord.length; i++){
                if(!guessedRight.includes(hostWord.charAt(i)))
                    guess = hostWord.charAt(i);
            }
        }
    } else {
        guess = available[ran];
        console.log(guess);
    }
    $('#botGuess').html("The bot has guessed \"" + guess + "\"");
}
function hasNumber(guess) {
    if (guess <= 0 || guess >= 0)
        return true;
    return false;
}
function allVowelsGuessed(){
    vowels = [''];
    for (var i = 0; i < guessedRight.length; i++){
        if (guessedRight[i] === 'a' || guessedRight[i] === 'e' || guessedRight[i] === 'i' ||
                guessedRight[i] === 'o' || guessedRight[i] === 'u')
            vowels+=guessedRight[i];
    }
    if(vowels.length !== 5)
        return false;
    else return true;
}
function wordProgress() {
    prog = " ";
    for (var i = 0; i < hostWord.length; i++) {
        if (hostWord.charAt(i) === " "){
            prog += "&nbsp;&nbsp;";
        } else if (guessedRight.includes(hostWord.charAt(i))) {
            prog = prog + "" + hostWord.charAt(i) + " ";
        } else
            prog = prog + "_ ";
        
    }
    console.log(prog);
    console.log(guessedRight);
    $('#wordProgress').html(prog);
    
}

function reset(){
    guesser = false;
    host = false;
    guess="";
    guessed = [];
    guessedRight = [];
    prog = "";
    badGuessCount = 0;
    available = [];
    hostWord = "";
    correctGuess = false;
    $('#boardState').attr("src", "gallows/gallow.png");
    $('#availChars').html(available);
    $('#guessedChars').html(guessed);
    $('#botGuess').html("");
    $('#word').val("");
    $('#winLose').val("");
    start();
}
function wordCache() {
    wordList = ["account", "act", "addition", "adjustment", "advertisement", "agreement",
        "air", "amount", "amusement", "animal", "answer", "apparatus", "approval", "argument",
        "art", "attack", "attempt", "attention", "attraction", "authority", "back", "balance",
        "base", "behavior", "belief", "birth", "bit", "bite", "blood",
        "blow", "body", "brass", "bread", "breath", "brother", "building", "burn", "burst", "business",
        "butter", "canvas", "care", "cause", "chalk", "chancechange", "cloth", "coal", "color", "comfort",
        "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook",
        "copper", "copy", "cork", "cotton", "cough", "country", "cover", "crack", "credit", "crime", "crush", "cry",
        "current", "curve", "damage", "danger", "daughter", "day", "death", "debt", "decision", "degree", "design",
        "desire", "destruction", "detail", "development", "digestion", "direction", "discovery", "discussion",
        "disease", "disgust", "distance", "distribution", "division", "doubt", "drink", "driving", "dust", "earth",
        "edge", "education", "effect", "end", "error", "event", "example", "exchange", "existence", "expansion",
        "experience", "expert", "factfall", "family", "father", "fear", "feeling", "fiction", "field", "fight",
        "fire", "flame", "flight", "flower", "fold", "food", "force", "form", "friend", "front", "fruit", "glass",
        "gold", "government", "grain", "grass", "grip", "group", "growth", "guide", "harbor", "harmony", "hate",
        "hearing", "heat", "help", "history", "hole", "hope", "hour", "humor", "ice", "idea", "impulse", "increase",
        "industry", "ink", "insect", "instrument", "insurance", "interest", "invention", "iron", "jelly", "`join",
        "journey", "judge", "jump", "kick", "kiss", "knowledge", "land", "language", "laugh", "law", "lead", "learning",
        "leather", "letter", "level", "lift", "light", "limit", "linen", "liquid", "list", "look", "loss", "love", "machine",
        "man", "manager", "mark", "market", "mass", "meal", "measure", "meat", "meeting", "memory", "metal", "middle", "milk",
        "mind", "mine", "minute", "mist", "money", "month", "morning", "mother", "motion", "mountain", "move", "music", "name",
        "nation", "need", "news", "night", "noise", "note", "number", "observation", "offer", "oil", "operation", "opinion",
        "order", "organisation", "ornament", "owner", "page", "pain", "paint", "paper", "part", "paste", "payment", "peace",
        "person", "place", "plant", "play", "pleasure", "point", "poison", "polish", "porter", "position", "powder", "power",
        "price", "print", "process", "produce", "profit", "property", "prose", "protest", "pull", "punishment", "purpose",
        "push", "quality", "question", "rain", "range", "rate", "ray", "reaction", "reading", "reason", "record", "regret",
        "relation", "religion", "representative", "request", "respect", "rest", "reward", "rhythm", "rice", "river", "road",
        "roll", "room", "rub", "rule", "run", "salt", "sand", "scale", "science", "sea", "seat", "secretary", "selection", "self",
        "sense", "servant", "sex", "shade", "shake", "shame", "shock", "side", "sign", "silk", "silver", "sister", "size", "sky",
        "sleep", "slip", "slope", "smash", "smell", "smile", "smoke", "sneeze", "snow", "soap", "society", "son", "song", "sort",
        "sound", "soup", "space", "stage", "start", "statement", "steam", "steel", "step", "stitch", "stone", "stop", "story",
        "stretch", "structure", "substance", "sugar", "suggestion", "summer", "supercalifragilisticexpialidocious", "support", "surprise", "swim",
        "system", "talk", "taste", "tax", "teaching", "tendency", "test", "theory", "thing", "thought", "thunder", "time", "tin", "top", "touch",
        "trade", "transport", "trick", "trouble", "turn", "twist", "unit", "use", "value", "verse", "vessel", "view", "voice",
        "walk", "war", "wash", "waste", "water", "wave", "wax", "way", "weather", "week", "weight", "wind", "wine", "winter",
        "woman", "wood", "wool", "word", "work", "wound", "writing", "year"];
}