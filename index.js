import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';

window.onload = async () => {

    // Game state
    var gameStarted = false;

    var user = 0; // User Wins
    var computer = 1; // Computer Wins
    var tie = 2 // Tie between User and Computer

    var rock = 0;
    var paper = 1;
    var scissors = 2;

    // All possible combination of state
    var winningLogic = [
        {
            'u': rock,
            'c': rock,
            'win': tie
        },
        {
            'u': paper,
            'c': paper,
            'win': tie
        },
        {
            'u': scissors,
            'c': scissors,
            'win': tie
        },
        {
            'u': rock,
            'c': paper,
            'win': computer
        },
        {
            'u': rock,
            'c': scissors,
            'win': user
        },
        {
            'u': paper,
            'c': rock,
            'win': user
        },
        {
            'u': paper,
            'c': scissors,
            'win': computer
        },
        {
            'u': scissors,
            'c': rock,
            'win': computer
        },
        {
            'u': scissors,
            'c': paper,
            'win': user
        }
    ]

    var userSelection = null;
    var computerSelection = null;

    let classes = ["ROCK", "PAPER", "SCISSORS"]
    let classesAnim = ["assets/rock.gif", "assets/paper.gif", "assets/scissors.gif"]
    let classesWin = ["You Won", "Computer Won", "Tie"]

    // Loading HTMLElements
    var videoElement = document.querySelector("video") // User Hand in video
    var computerHandElement = document.querySelector(".computer-hand") // Simulated Computer Hand

    var userValueElement = document.querySelector(".user-value") // User's Selection from rock paper scissors
    var computerValueElement = document.querySelector(".computer-value") // User's Selection from rock paper scissors

    var instructionElement = document.querySelector(".instruction h2") // Instruction of how to play the game
    var resultElement = document.querySelector(".winner h1") // To display the result -> who is the winner

    var loadingScreenElement = document.querySelector(".loading-screen")


    // Loading Hand Pose Detection Model
    try {
        var model = handPoseDetection.SupportedModels.MediaPipeHands;
        var detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
        };
        var rpcmodel = await tf.loadLayersModel('./model/rock-paper-scissor-model/model.json');
        var detector = await handPoseDetection.createDetector(model, detectorConfig);
        loadingScreenElement.style.display = "none";
    } catch (error) {
        console.log(error)
    }

    // Loading live webcam feed to video element
    try {
        let constraints = { audio: false, video: true }
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream
    } catch (error) {
        console.log("Something error happened")
    }


    var handCount = 0;
    var handCountPrevious = 0;

    setInterval(async () => {

        setUIWidth()

        const estimationConfig = { flipHorizontal: false };
        let video = videoElement;
        const hands = await detector.estimateHands(video, estimationConfig);


        let data = []
        hands[0]?.keypoints3D.forEach((el => {
            data.push(el.x)
            data.push(el.y)
            data.push(el.z)
        }))

        // Game start and restart Logic
        handCount = hands.length;
        if (handCount == 1 && handCountPrevious == 0 && !gameStarted) {
            runGame()
        }
        handCountPrevious = handCount;

        // Predict Rock Paper Scissor from video pose
        if (data.length > 0) {
            let x = rpcmodel.predict(tf.tensor2d([data]))
            let prediction = x.arraySync()[0]
            if (gameStarted) { 
                userSelection = oneHotDecode(prediction)
                userValueElement.innerHTML = classes[userSelection]
            }
        }

    }, 200)

    function oneHotDecode(array) {
        let index = 0
        let maxVal = 0

        array.forEach((element, i) => {
            if (element > maxVal) {
                index = i
                maxVal = element
            }
        });

        return index;
    }

    function runGame() {

        computerValueElement.innerHTML = "";
        resultElement.innerHTML = "";
        gameStarted = true
        computerHandElement.setAttribute("src", "assets/rps.gif")

        setTimeout(() => {
            gameStarted = false;
            computerSelection = randomIndex(0, 2)
            let computerVal = classes[computerSelection]
            let computerAnim = classesAnim[computerSelection]


            computerValueElement.innerHTML = computerVal
            computerHandElement.setAttribute("src", computerAnim)
            decideWinner(userSelection, computerSelection)
            instructionElement.innerHTML = "To <b>restart</b> move out hands from frame and bring one back."
        }, 1000)

    }

    // Run Winning Logic
    function decideWinner(user, computer) {
        let winner = "";
        winningLogic.forEach((el) => {
            if (el.u == user && el.c == computer) {
                winner = classesWin[el.win]
            }
        })
        resultElement.innerHTML = winner;
    }

    // Random number generater between 0 and 2 to decide computer move
    function randomIndex(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    function setUIWidth() {
        let videoWidth = videoElement.clientWidth;
        let computerHandWidth = computerHandElement.clientWidth;

        userValueElement.style.width = videoWidth + 10 + "px";
        computerValueElement.style.width = computerHandWidth + 20 + "px";
    }
}

