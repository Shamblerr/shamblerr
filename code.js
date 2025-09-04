wordText = ""
wordColour = ""
wordElement = document.getElementById("WORD")
colours = [
    "RED", "YELLOW", "BLUE", "GREEN", "PINK", "WHITE", "ORANGE"
]
activeButtons = [
    "B1", "B2", "B3"
]
answerButton = 0
strikes = 0
score = 0
checkpoint = 0
canClick = 0
time = 0
progressPercentage = 0
highscore = 0

function setup() {
    wordElement = document.getElementById("WORD")
    if (localStorage.getItem('highscore') != null) {
        highscore = localStorage.getItem('highscore')
    } else {
        localStorage.setItem('highscore', 0)
    }
    document.getElementById("highscore1").innerHTML = highscore
    document.getElementById("highscore2").innerHTML = highscore
}

function startStroop() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('game').style.display = 'block'
    newWord()
}

function chosen(id) {
    if (canClick == 1) {
        answer = document.getElementById(id).innerHTML
        if (answer != "") { // ensure the button pressed isnt an empty one
            canClick = 0
            if (id == activeButtons[answerButton]) {
                score++
                wordElement.style.color = "LIME"
                wordElement.innerHTML = "CORRECT"
                document.getElementById("score").innerHTML = score
            } else {
                strikes++
                wordElement.style.color = "RED"
                wordElement.innerHTML = "INCORRECT"
                document.getElementById("strike" + strikes).innerHTML = "[X]"
                document.getElementById("strike" + strikes).style.color = "RED"
            }
            if (strikes != 3) {
                if (score == 3 && checkpoint == 0) {
                    activeButtons.push("A2")
                    activeButtons.push("C2")
                    checkpoint++
                }
                if (score == 5 && checkpoint == 1) {
                    activeButtons.push("A1")
                    checkpoint++
                }
                if (score == 7 && checkpoint == 2) {
                    activeButtons.push("A3")
                    checkpoint++
                }
                if (score == 9 && checkpoint == 3) {
                    activeButtons.push("C1")
                    checkpoint++
                }
                if (score == 11 && checkpoint == 4) {
                    activeButtons.push("C3")
                    checkpoint++
                }
                setTimeout(function(){
                    newWord()
                }, 2000)
            } else {
                setTimeout(function(){
                    gameOver()
                }, 2000)
            }
        }
    }
}

function newWord() {
    wordElement.style.color = "WHITE"
    wordElement.innerHTML = "..."
    document.getElementById("timerBar").style.width = "0%"

    for (let i = 0; i < activeButtons.length; i++) {
        currentButton = document.getElementById(activeButtons[i])
        currentButton.innerHTML = ""
      }

    wordText = colours[Math.floor(Math.random() * colours.length)]
    wordColour = colours[Math.floor(Math.random() * colours.length)]
    answerButton = Math.floor(Math.random() * activeButtons.length)

    setTimeout(function(){
        wordElement.innerHTML = wordText
        wordElement.style.color = wordColour
        if (wordColour == "GREEN") {
            wordElement.style.color = "LIME"
        }
        if (wordColour == "PINK") {
            wordElement.style.color = "MAGENTA"
        }

        for (let i = 0; i < activeButtons.length; i++) {
            currentButton = document.getElementById(activeButtons[i])
            buttonText = colours[Math.floor(Math.random() * colours.length)]
            buttonColour = colours[Math.floor(Math.random() * colours.length)]
            if (i == answerButton) {
                currentButton.innerHTML = wordColour
                if (buttonColour == "GREEN") {
                    currentButton.style.color = "LIME"
                }
                if (buttonColour == "PINK") {
                    currentButton.style.color = "MAGENTA"
                }
            } else {
                while (buttonText == wordColour) {
                    buttonText = colours[Math.floor(Math.random() * colours.length)]
                }
                currentButton.innerHTML = buttonText
                currentButton.style.color = buttonColour
                if (buttonColour == "GREEN") {
                    currentButton.style.color = "LIME"
                }
                if (buttonColour == "PINK") {
                    currentButton.style.color = "MAGENTA"
                }
            }
        }
        canClick = 1
        startTimer()
    }, 2000);
}

function startTimer() {
    timerBar = document.getElementById("timerBar")
    time = 500 - (score * 10) // this is in TEN MILLESECONDS
    if (time < 150) { // minimum time is 1.5 seconds (after scoring 35 times)
        time = 150
    }
    timeLeft = time

    ticker = setInterval(tick, 10)

    function tick() {
        timeLeft--
        timerPercentage = (timeLeft / time) * 100;
        timerBar.style.width = `${timerPercentage}%`;
        if (timeLeft <= 0) {
            clearInterval(ticker)
            canClick = 0
            strikes++
            wordElement.style.color = "RED"
            wordElement.innerHTML = "TIME RAN OUT"
            document.getElementById("strike" + strikes).innerHTML = "[X]"
            document.getElementById("strike" + strikes).style.color = "RED"
            if (strikes == 3) {
                setTimeout(function(){
                    gameOver()
                }, 2000)
            } else {
                setTimeout(function(){
                    newWord()
                }, 2000)
            }
        }
        if (canClick == 0) {
            clearInterval(ticker)
        }
    }
    
}

function gameOver() {
    for (let i = 0; i < activeButtons.length; i++) {
        currentButton = document.getElementById(activeButtons[i])
        currentButton.innerHTML = ""
      }
    wordElement.style.color = "RED"
    wordElement.innerHTML = "GAME OVER"
    setTimeout(function(){
        wordElement.style.color = "WHITE"
        wordElement.innerHTML = "SCORE: " + score
        document.getElementById("restartButton").style.display = "block"
    }, 3000)
    if (score > highscore) {
        localStorage.setItem('highscore', score)
        highscore = score
        document.getElementById("highscore1").innerHTML = highscore
        document.getElementById("highscore2").innerHTML = highscore
    }
}

function resetHS() {
    localStorage.setItem('highscore', 0)
    document.getElementById("highscore1").innerHTML = 0
    document.getElementById("highscore2").innerHTML = 0
}

function resetGame() {
    document.getElementById("restartButton").style.display = "none"
    activeButtons = [
        "B1", "B2", "B3"
    ]
    strikes = 0
    score = 0
    checkpoint = 0
    document.getElementById("score").innerHTML = 0
    document.getElementById("strike1").innerHTML = "[ ]"
    document.getElementById("strike1").style.color = "white"
    document.getElementById("strike2").innerHTML = "[ ]"
    document.getElementById("strike2").style.color = "white"
    document.getElementById("strike3").innerHTML = "[ ]"
    document.getElementById("strike3").style.color = "white"
    startStroop()
}