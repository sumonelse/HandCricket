let welcomeContainerDiv = document.getElementById("welcome-container")
let howToPlayDiv = document.getElementById("howToPlay")
let selectOverDiv = document.getElementById("select-over")
let selectTossDiv = document.getElementById("select-toss")
let whoWonTossDiv = document.getElementById("whoWonToss")
let playGameAreaDiv = document.getElementById("playGameArea")
let startRunBtnsDiv = document.getElementById("runs-btn")
let chaseRunBtnsDiv = document.getElementById("chaseRuns-btn")
let chaseBtn = document.getElementById("chase-btn")
let whoNeedsSpan = document.getElementById("whoNeeds")
let hmRunSpan = document.getElementById("hmRun")
let hmBallSpan = document.getElementById("hmBall")
let fstRuns = document.getElementById("fstRuns")
let fstWick = document.getElementById("fstWick")
let moveShowDiv = document.getElementById("moveShow")
let yourMoveShowDiv = document.getElementById("yourMoveShow")
let compMoveShowDiv = document.getElementById("compMoveShow")

let score = document.getElementById("score")
let wicket = document.getElementById("wicket")
let highlight = document.getElementById("highlight")
let slide = document.getElementById("slide")

let logo = document.getElementById("logo")
let whoBat = document.getElementById("whoBat")
let overSpan = document.getElementById("over")
let ballSpan = document.getElementById("ball")
let totalOverParentSpan = document.getElementById("totalOverParent")
let totalOverSpan = document.getElementById("totalOver")

// Preload audio files with error handling
const winSound = new Audio("./audio/childrenApplause.mp3")
const whistleSound = new Audio("./audio/whistle.wav")
const awwSound = new Audio("./audio/awwSound.mp3")

// Error handling for audio files
const audioFiles = [winSound, whistleSound, awwSound]
audioFiles.forEach((audio) => {
    audio.addEventListener("error", function () {
        console.error(`Error loading audio file: ${audio.src}`)
    })
})

// Game settings
let gameDifficulty = "medium"
let soundEnabled = true
let animationsEnabled = true

// Initialize settings from localStorage
const initializeSettings = () => {
    if (localStorage.getItem("handCricketSettings")) {
        const settings = JSON.parse(localStorage.getItem("handCricketSettings"))

        // Load game settings
        gameDifficulty = settings.difficulty || "medium"
        soundEnabled = settings.sound !== undefined ? settings.sound : true
        animationsEnabled =
            settings.animations !== undefined ? settings.animations : true

        // Apply theme if saved
        if (settings.theme) {
            applyTheme(settings.theme)
        }
    }
}

// Handle loading screen
const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add("hidden")
            setTimeout(() => {
                loadingScreen.style.display = "none"
            }, 500)
        }, 1500) // Show loading screen for 1.5 seconds
    }
}

// Set up theme toggle button
const setupThemeToggle = () => {
    const themeToggleBtn = document.getElementById("theme-toggle-btn")
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme)
    }
}

// Call initialization function when page loads
document.addEventListener("DOMContentLoaded", () => {
    initializeSettings()
    hideLoadingScreen()
    setupThemeToggle()
})

// ------------------------ Show Functions STARTS ---------------------
let showPlayInfo = () => {
    howToPlayDiv.classList.remove("close")
}
let closePlayInfo = () => {
    howToPlayDiv.classList.add("close")
}

let showSettings = () => {
    document.getElementById("settingsModal").classList.remove("close")

    // Load saved settings if available
    if (localStorage.getItem("handCricketSettings")) {
        const settings = JSON.parse(localStorage.getItem("handCricketSettings"))
        document.getElementById("difficulty").value =
            settings.difficulty || "medium"
        document.getElementById("animations").value = settings.animations
            ? "on"
            : "off"
        document.getElementById("sound").value = settings.sound ? "on" : "off"

        // Load theme setting
        if (settings.theme) {
            document.getElementById("theme").value = settings.theme
        }
    }
}

let closeSettings = () => {
    document.getElementById("settingsModal").classList.add("close")
}

let saveSettings = () => {
    gameDifficulty = document.getElementById("difficulty").value
    animationsEnabled = document.getElementById("animations").value === "on"
    soundEnabled = document.getElementById("sound").value === "on"
    const selectedTheme = document.getElementById("theme").value

    // Apply theme
    applyTheme(selectedTheme)

    // Save settings to localStorage
    const settings = {
        difficulty: gameDifficulty,
        animations: animationsEnabled,
        sound: soundEnabled,
        theme: selectedTheme,
    }
    localStorage.setItem("handCricketSettings", JSON.stringify(settings))

    // Apply settings
    showAnimation = animationsEnabled

    // Close settings modal
    closeSettings()
}

// Function to apply theme
const applyTheme = (theme) => {
    // Remove all theme classes first
    document.body.classList.remove("dark-theme")

    // Apply the selected theme
    if (theme === "dark") {
        document.body.classList.add("dark-theme")
    }
    // Light theme is default (no class needed)

    // Update theme in settings dropdown if it exists
    const themeSelect = document.getElementById("theme")
    if (themeSelect) {
        themeSelect.value = theme
    }

    // Save the theme to localStorage
    const settings = JSON.parse(
        localStorage.getItem("handCricketSettings") || "{}"
    )
    settings.theme = theme
    localStorage.setItem("handCricketSettings", JSON.stringify(settings))
}

// Function to toggle theme
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.contains("dark-theme")
    const nextTheme = isDarkTheme ? "light" : "dark"
    applyTheme(nextTheme)
}

let showSelectOver = () => {
    welcomeContainerDiv.style.display = "none"
    selectOverDiv.style.display = "flex"
}

let selectedOver = 0
let overBtn = document.querySelectorAll(".Over-btn")
let returnSelectedOverTry = () => {
    overBtn.forEach((e) => {
        e.addEventListener("click", () => {
            selectedOver = e.value
            showSelectToss(selectedOver)
            totalOverParentSpan.style.display = "block"
            totalOverSpan.innerText = selectedOver
        })
    })
}
returnSelectedOverTry()

let showSelectToss = (selectedOver) => {
    selectOverDiv.style.display = "none"
    selectTossDiv.style.display = "flex"
    getToss(selectedOver)
}

let showWhoWonToss = (selectedOver) => {
    selectTossDiv.style.display = "none"
    whoWonTossDiv.style.display = "flex"
}
let showPlayGameArea = () => {
    playGameAreaDiv.style.display = "block"
    startRunBtnsDiv.style.display = "block"
    whoWonTossDiv.style.display = "none"
}

// ------------------------ Show Functions ENDS ---------------------

// ------------------------ Logic Functions STARTS ---------------------
let getGodValue = () => {
    let godToss = ["Heads", "Tails"]
    let randomGodToss = Math.floor(Math.random() * 2)
    let godValue = godToss[randomGodToss]
    return godValue
}

let getToss = (selectedOver) => {
    let tossBtn = document.querySelectorAll(".toss-btn")
    tossBtn.forEach((e) => {
        let tossValue = e.value
        e.addEventListener("click", () => {
            tossLogic(tossValue, getGodValue(), selectedOver)
        })
    })
}

let tossLogic = (playerTossValue, godTossValue, selectedOver) => {
    let tossResult = document.getElementById("tossResult")
    if (playerTossValue == godTossValue) {
        showWhoWonToss(selectedOver)
        tossResult.innerText = "You"
        showPlayerWonRes(selectedOver)
    } else {
        showWhoWonToss(selectedOver)
        tossResult.innerText = "Comp"
        tossResult.style.color = "red"
        showCompWonRes(selectedOver)
    }
}

let playerWonTossDiv = document.getElementById("player-won")
let compWonTossDiv = document.getElementById("comp-won")
let showPlayerWonRes = (selectedOver) => {
    playerWonTossDiv.style.display = "flex"
    compWonTossDiv.style.display = "none"
    startGame(selectedOver)
}
let showCompWonRes = (selectedOver) => {
    let comptOptDiv = document.getElementById("compOpt")
    let opt = ["Bat", "Ball"]
    let randOpted = Math.floor(Math.random() * 2)
    let compOpted = opt[randOpted]
    if (compOpted == "Bat") {
        logo.innerText = "💻"
        whoBat.innerText = "Comp"
    } else {
        logo.innerText = "👦"
        whoBat.innerText = "You"
    }
    compWonTossDiv.style.display = "block"
    playerWonTossDiv.style.display = "none"
    comptOptDiv.innerText = compOpted
    getPlayerRun("comp", compOpted, selectedOver)
}

let startGame = (selectedOver) => {
    let htBtn = document.querySelectorAll(".htBtn")
    htBtn.forEach((e) => {
        let htBtnValue = e.value
        e.addEventListener("click", () => {
            startGameLogic(htBtnValue, selectedOver)
        })
    })
}

let startGameLogic = (choosed, selectedOver) => {
    if (choosed == "Bat") {
        showPlayGameArea()
        logo.innerText = "👦"
        whoBat.innerText = "You"
    } else {
        showPlayGameArea()
        logo.innerText = "💻"
        whoBat.innerText = "Comp"
    }
    getPlayerRun("you", choosed, selectedOver)
}

let getCompRun = (who, select) => {
    // Basic runs distribution
    let runs = [1, 2, 3, 4, 4, 5, 5, 6, 6, 6]
    let emojRuns = ["☝", "🤘", "👌", "👊", "👊", "🖐", "🖐", "👍", "👍", "👍"]

    // Smart runs distribution (medium difficulty)
    let smartRuns = [1, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6]
    let emojSmartRuns = [
        "☝",
        "🤘",
        "👌",
        "👊",
        "👊",
        "🖐",
        "🖐",
        "🖐",
        "🖐",
        "👍",
        "👍",
        "👍",
        "👍",
        "👍",
    ]

    // Hard difficulty - more strategic choices
    let hardRuns = [1, 1, 2, 3, 4, 4, 5, 5, 6, 6]
    let emojHardRuns = [
        "☝",
        "☝",
        "🤘",
        "👌",
        "👊",
        "👊",
        "🖐",
        "🖐",
        "👍",
        "👍",
    ]

    // Easy difficulty - more predictable
    let easyRuns = [1, 2, 3, 3, 4, 4, 5, 5, 6, 6]
    let emojEasyRuns = [
        "☝",
        "🤘",
        "👌",
        "👌",
        "👊",
        "👊",
        "🖐",
        "🖐",
        "👍",
        "👍",
    ]

    let selectedRuns, selectedEmojis

    // Select the appropriate difficulty
    if (
        (who == "you" && select == "Bat") ||
        (who == "comp" && select == "Ball")
    ) {
        // Computer is bowling - use difficulty settings
        switch (gameDifficulty) {
            case "easy":
                selectedRuns = easyRuns
                selectedEmojis = emojEasyRuns
                break
            case "hard":
                selectedRuns = hardRuns
                selectedEmojis = emojHardRuns
                break
            case "medium":
            default:
                selectedRuns = smartRuns
                selectedEmojis = emojSmartRuns
                break
        }
    } else {
        // Computer is batting - use regular distribution
        selectedRuns = runs
        selectedEmojis = emojRuns
    }

    // Get random run based on selected difficulty
    let randIndex = Math.floor(Math.random() * selectedRuns.length)
    let compRun = selectedRuns[randIndex]
    let emojCompRun = selectedEmojis[randIndex]

    // Update display
    compMoveShowDiv.innerText = emojCompRun
    return compRun
}

let chaseBtnDiv = document.getElementById("chaseBtnDiv")

let over
let ballCount

let getPlayerRun = (who, select, selectedOver) => {
    let runBtn = document.querySelectorAll(".runBtn")
    over = 0
    ballCount = 0
    runBtn.forEach((e) => {
        let run = e.value
        e.addEventListener("click", () => {
            if (over < selectedOver) {
                ballCount++
                if (ballCount > 5) {
                    ballCount = 0
                    over++
                    overSpan.innerText = over
                }
                ballSpan.innerText = ballCount
                yourMoveShowDiv.innerText = e.innerText
                runLogic(who, select, run, getCompRun(who, select), "first", 0)
                // console.log({ballCount})
            }
            if (over >= selectedOver) {
                startRunBtnsDiv.style.display = "none"
                moveShowDiv.style.display = "none"
                chaseBtnDiv.style.display = "block"
                fstRuns.innerText = score.innerText
                fstWick.innerText = wicket.innerText
            }
        })
    })
}

let youOverPlayedSpan = document.getElementById("youOverPlayed")
let youBallPlayedSpan = document.getElementById("youBallPlayed")
let compOverPlayedSpan = document.getElementById("compOverPlayed")
let compBallPlayedSpan = document.getElementById("compBallPlayed")

let startChase = () => {
    let firstInningsScore = 0
    let selectedOver = totalOverSpan.innerText
    if (logo.innerText == "💻" && whoBat.innerText == "Comp") {
        firstInningsScore = score.innerText
        compTotalRunSpan.innerText = firstInningsScore
        compTotalWicketSpan.innerText = wicket.innerText
        compOverPlayedSpan.innerText = overSpan.innerText
        compBallPlayedSpan.innerText = ballSpan.innerText
        logo.innerText = "👦"
        whoBat.innerText = "You"
        showChaseArea(firstInningsScore, "you", selectedOver)
    } else {
        firstInningsScore = score.innerText
        yourTotalRunSpan.innerText = firstInningsScore
        yourTotalWicketSpan.innerText = wicket.innerText
        youOverPlayedSpan.innerText = overSpan.innerText
        youBallPlayedSpan.innerText = ballSpan.innerText
        logo.innerText = "💻"
        whoBat.innerText = "Comp"
        showChaseArea(firstInningsScore, "comp", selectedOver)
    }
}

let showChaseArea = (firstInningsScore, who, selectedOver) => {
    reset()
    chaseBtnDiv.style.display = "none"
    chaseRunBtnsDiv.style.display = "block"
    moveShowDiv.style.display = "flex"
    whoNeedsSpan.innerText = who
    runRequiredInBalls(selectedOver, 0, 0, firstInningsScore, 0)
    secondInnings(firstInningsScore, who, selectedOver)
}

let secondInnings = (firstInningsScore, who, selectedOver) => {
    over = 0
    ballCount = 0
    let secondInningsScore = Number(score.innerText)
    let secRunBtn = document.querySelectorAll(".secRunBtn")
    let numSelectedOver = Number(selectedOver)
    secRunBtn.forEach((e) => {
        let run = e.value
        e.addEventListener("click", () => {
            if (over < numSelectedOver) {
                runLogic(
                    who,
                    "Bat",
                    run,
                    getCompRun(who, "Bat"),
                    "second",
                    firstInningsScore
                )
                secondInningsScore = Number(score.innerText)
                ballCount++
                if (ballCount > 5) {
                    ballCount = 0
                    over++
                    overSpan.innerText = over
                }
                yourMoveShowDiv.innerText = e.innerText
                ballSpan.innerText = ballCount
                runRequiredInBalls(
                    numSelectedOver,
                    over,
                    ballCount,
                    firstInningsScore,
                    secondInningsScore
                )
                let wicketsRemain = 10 - Number(wicket.innerText)
                if (secondInningsScore > firstInningsScore) {
                    playGameAreaDiv.style.display = "none"
                    modalShow(who, wicketsRemain, "wicket", secondInningsScore)
                    if (who == "you") {
                        winSound.play()
                        startConfetti()
                        stopConfetti()
                    }
                }
            }
            if (over >= numSelectedOver) {
                if (secondInningsScore == firstInningsScore) {
                    modalShow("Tie", 0, "wicket", secondInningsScore)
                } else if (secondInningsScore < firstInningsScore) {
                    let runsRemain = firstInningsScore - secondInningsScore
                    secondInningsLessScore(who, runsRemain, secondInningsScore)
                }
            }
        })
    })
}

let runLogic = (who, select, playerRun, compRun, inn, firstInningsScore) => {
    let numScore = Number(score.innerText)
    let playerNumRun = Number(playerRun)
    let numWicket = Number(wicket.innerText)
    if (playerNumRun == compRun || compRun == playerNumRun) {
        wicket.innerText = numWicket + 1
        if (inn == "first") {
            if (wicket.innerText == 10) {
                startRunBtnsDiv.style.display = "none"
                moveShowDiv.style.display = "none"
                chaseBtnDiv.style.display = "block"
                fstRuns.innerText = score.innerText
                fstWick.innerText = wicket.innerText
            }
        } else if (inn == "second") {
            if (wicket.innerText == 10) {
                let secondInningsScore = Number(score.innerText)
                let runsRemain = firstInningsScore - secondInningsScore
                secondInningsLessScore(who, runsRemain, secondInningsScore)
                if (secondInningsScore == firstInningsScore) {
                    modalShow("Tie", 0, "wicket", secondInningsScore)
                }
            }
        }
        playAwwSound()
        showSlideAnimation("Wicket")
    } else if (
        (who == "you" && select == "Bat") ||
        (who == "comp" && select == "Ball")
    ) {
        score.innerText = numScore + playerNumRun
        if (playerNumRun == 6) {
            playWhistleSound()
            showSlideAnimation("Six")
        } else if (playerNumRun == 4) {
            playWhistleSound()
            showSlideAnimation("Four")
        }
    } else if (
        (who == "comp" && select == "Bat") ||
        (who == "you" && select == "Ball")
    ) {
        score.innerText = numScore + compRun
        if (compRun == 6) {
            playWhistleSound()
            showSlideAnimation("Six")
        } else if (compRun == 4) {
            playWhistleSound()
            showSlideAnimation("Four")
        }
    }
}

let showAnimation = true
let showSlideAnimation = (what) => {
    if (showAnimation) {
        highlight.classList.add("active-high")
        slide.innerText = what
        if (what == "Wicket") {
            slide.style.color = "red"
        } else {
            slide.style.color = "cornflowerblue"
        }
        removeSlideAnimation()
    }
}
let removeSlideAnimation = () => {
    setTimeout(() => {
        highlight.classList.remove("active-high")
    }, 1500)
}

let secondInningsLessScore = (who, runsRemain, secondInningsScore) => {
    if (who == "you") {
        modalShow("comp", runsRemain, "run", secondInningsScore)
    } else if (who == "comp") {
        modalShow("you", runsRemain, "run", secondInningsScore)
        winSound.play()
        startConfetti()
        stopConfetti()
    }
}

let runRequiredInBalls = (
    numSelectedOver,
    over,
    ballCount,
    firstInningsScore,
    secondInningsScore
) => {
    let totalBall = (numSelectedOver - over) * 6
    let decBall = totalBall - ballCount
    hmBallSpan.innerText = decBall
    hmRunSpan.innerText = Number(firstInningsScore) - secondInningsScore + 1
}

// ------------------------ Modal ---------------------
let modalBox = document.getElementById("modalBox")
let whoWonSpan = document.getElementById("whoWon")
let wonOrTieSpan = document.getElementById("wonOrTie")
let remainWickOrRunSpan = document.getElementById("remainWickOrRun")
let wickOrRunSpan = document.getElementById("wickOrRun")
let yourTotalRunSpan = document.getElementById("yourTotalRun")
let compTotalRunSpan = document.getElementById("compTotalRun")
let yourTotalWicketSpan = document.getElementById("yourTotalWicket")
let compTotalWicketSpan = document.getElementById("compTotalWicket")

// Game statistics
let gameStats = {
    gamesPlayed: 0,
    playerWins: 0,
    playerLosses: 0,
    gameTies: 0,
    highestScore: 0,
}

// Load stats from localStorage if available
const loadGameStats = () => {
    const savedStats = localStorage.getItem("handCricketStats")
    if (savedStats) {
        gameStats = JSON.parse(savedStats)
    }
}

// Save stats to localStorage
const saveGameStats = () => {
    localStorage.setItem("handCricketStats", JSON.stringify(gameStats))
}

// Initialize stats
loadGameStats()

let modalShow = (whoWon, remainWickOrRun, wickOrRun, secondInningsScore) => {
    document.body.classList.add("active")

    // Update game statistics
    gameStats.gamesPlayed++

    if (whoWon == "Tie") {
        whoWonSpan.innerText = "It's "
        wonOrTieSpan.innerText = "a TIE"
        remainWickOrRunSpan.style.display = "none"
        wickOrRunSpan.style.display = "none"
        gameStats.gameTies++
    } else {
        whoWonSpan.innerText = whoWon
        remainWickOrRunSpan.innerText = remainWickOrRun
        wickOrRunSpan.innerText = wickOrRun

        if (whoWon === "you") {
            gameStats.playerWins++
            if (soundEnabled) {
                winSound.play().catch((error) => {
                    console.error("Error playing sound:", error)
                })
            }
        } else if (whoWon === "comp") {
            gameStats.playerLosses++
        }
    }

    // Update highest score
    const yourScore = parseInt(yourTotalRunSpan.innerText || 0)
    if (yourScore > gameStats.highestScore) {
        gameStats.highestScore = yourScore
    }

    // Save updated stats
    saveGameStats()

    if (logo.innerText == "💻" && whoBat.innerText == "Comp") {
        compTotalRunSpan.innerText = secondInningsScore
        compTotalWicketSpan.innerText = wicket.innerText
        compOverPlayedSpan.innerText = overSpan.innerText
        compBallPlayedSpan.innerText = ballSpan.innerText
    } else {
        yourTotalRunSpan.innerText = secondInningsScore
        yourTotalWicketSpan.innerText = wicket.innerText
        youOverPlayedSpan.innerText = overSpan.innerText
        youBallPlayedSpan.innerText = ballSpan.innerText
    }
}

// Show statistics modal
const showStats = () => {
    document.getElementById("gamesPlayed").innerText = gameStats.gamesPlayed
    document.getElementById("playerWins").innerText = gameStats.playerWins
    document.getElementById("playerLosses").innerText = gameStats.playerLosses
    document.getElementById("gameTies").innerText = gameStats.gameTies

    // Calculate win rate
    const winRate =
        gameStats.gamesPlayed > 0
            ? Math.round((gameStats.playerWins / gameStats.gamesPlayed) * 100)
            : 0
    document.getElementById("winRate").innerText = winRate + "%"

    document.getElementById("highestScore").innerText = gameStats.highestScore

    // Show stats modal
    document.getElementById("statsModal").style.display = "flex"
    document.getElementById("statsModal").classList.add("active")
}

// Close statistics modal
const closeStats = () => {
    document.getElementById("statsModal").classList.remove("active")
    setTimeout(() => {
        document.getElementById("statsModal").style.display = "none"
    }, 300)
}

// Reset statistics
const resetStats = () => {
    gameStats = {
        gamesPlayed: 0,
        playerWins: 0,
        playerLosses: 0,
        gameTies: 0,
        highestScore: 0,
    }
    saveGameStats()
    showStats() // Refresh the display
}

let modalResetGame = () => {
    document.body.classList.remove("active")
    // reset();
    playGameAreaDiv.style.display = "none"
    welcomeContainerDiv.style.display = "flex"
    whoBat.innerText = "You/Comp"
    logo.innerText = ""
    window.location.reload()
}

let playAwwSound = () => {
    if (soundEnabled) {
        setTimeout(() => {
            awwSound.play().catch((error) => {
                console.error("Error playing sound:", error)
            })
        }, 400)
    }
}

let playWhistleSound = () => {
    if (soundEnabled) {
        setTimeout(() => {
            whistleSound.play().catch((error) => {
                console.error("Error playing sound:", error)
            })
        }, 500)
    }
}

let reset = () => {
    score.innerText = 0
    wicket.innerText = 0
    overSpan.innerText = 0
    ballSpan.innerText = 0
    yourMoveShowDiv.innerText = "-"
    compMoveShowDiv.innerText = "-"
}

// let startNewGame = () => {
//     score.innerText = 0
//     wicket.innerText = 0
//     overSpan.innerText = 0
//     ballSpan.innerText = 0
//     over = 0
//     ballCount = 0
//     firstInningsScore = 0
//     secondInningsScore = 0
//     yourMoveShowDiv.innerText = "-"
//     compMoveShowDiv.innerText = "-"
//     selectOverDiv.style.display = "none"
//     selectTossDiv.style.display = "none"
//     playGameAreaDiv.style.display = "none"
//     startRunBtnsDiv.style.display = "none"
//     whoWonTossDiv.style.display = "none"
//     playerWonTossDiv.style.display = "none"
//     compWonTossDiv.style.display = "none"
//     startRunBtnsDiv.style.display = "none"
//     moveShowDiv.style.display = "none"
//     chaseBtnDiv.style.display = "none"
//     chaseRunBtnsDiv.style.display = "none"
//     totalOverSpan.innerText = 0
//     selectedOver = 0
//     // whoNeedsSpan.style.display = "none"
// }

let startConfetti = () => {
    setTimeout(() => {
        confetti.start()
    }, 0)
}

let stopConfetti = () => {
    setTimeout(() => {
        confetti.stop()
    }, 2000)
}

// console.log(winSound.duration())

// ------------------------ Logic Functions ENDS ---------------------

chaseBtn.addEventListener("click", () => {
    startChase()
})
