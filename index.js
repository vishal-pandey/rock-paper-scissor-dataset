window.onload = async ()=> {

    var gameStarted = false;

    var user = 0;
    var computer = 1;
    var tie = 2

    var rock = 0;
    var paper = 1;
    var scissors = 2;



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

    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
                    // or 'base/node_modules/@mediapipe/hands' in npm.
    };
    let detector = await handPoseDetection.createDetector(model, detectorConfig);

    let classes = ["ROCK", "PAPER", "SCISSORS"]
    let classesAnim = ["assets/rock.gif", "assets/paper.gif", "assets/scissors.gif"]
    let classesWin = ["You Won", "Computer Won", "Tie"]

    navigator.getUserMedia({video: {}}, (stream)=>{
        document.querySelector("video").srcObject = stream

        var handCount = 0;
        var handCountPrevious = 0;

        setInterval(async ()=>{

            let videoWidth = document.querySelector("video").clientWidth;
            let computerHandWidth = document.querySelector(".computer-hand").clientWidth;
            
            document.querySelector(".user-value").style.width = videoWidth+10+"px";
            document.querySelector(".computer-value").style.width = computerHandWidth+20+"px";

            const estimationConfig = {flipHorizontal: false};
            let video = document.querySelector("video");
            const hands = await detector.estimateHands(video, estimationConfig);
            
            // console.log(hands[0]?.keypoints3D)
            let data = []
            hands[0]?.keypoints3D.forEach((el => {
                data.push(el.x)
                data.push(el.y)
                data.push(el.z)
            }))
            
            handCount = hands.length;

            if(handCount == 1 && handCountPrevious == 0 && !gameStarted){
                runGame()
            }

            handCountPrevious = handCount;



            // console.log(data)
            
            if(data.length > 0){
                let x = rpcmodel.predict(tf.tensor2d([data]))
                let prediction = x.arraySync()[0]
                if(gameStarted){
                    userSelection = oneHotDecode(prediction)
                    document.querySelector(".user-value").innerHTML = classes[userSelection]
                }
                // console.log(classes[oneHotDecode(prediction)])
                // console.log(tf.tensor2d([data]))
            }
            
            
            
        },200)
    }, err=> console.log(err))

    


    function oneHotDecode(array) {
        let index = 0
        let maxVal = 0 

        array.forEach((element, i) => {
            if(element > maxVal) {
                index = i
                maxVal = element
            }
        });

        return index;
    }

    function runGame() {

        document.querySelector(".computer-value").innerHTML = "";
        document.querySelector(".winner h1").innerHTML = "";
        gameStarted = true
        document.querySelector(".computer-hand").setAttribute("src", "assets/rps.gif")

        setTimeout(()=>{
            gameStarted = false;
            let computerSelection = randomIndex(0, 2)
            let computerVal = classes[computerSelection]
            let computerAnim = classesAnim[computerSelection]

            
            document.querySelector(".computer-value").innerHTML = computerVal
            document.querySelector(".computer-hand").setAttribute("src", computerAnim)
            decideWinner(userSelection, computerSelection)
            document.querySelector(".instruction h2").innerHTML = "To <b>restart</b> move out hands from frame and bring one back."
        }, 1000)

    }

    function decideWinner(user, computer){
        let winner = "";
        winningLogic.forEach((el)=>{
            if(el.u == user && el.c == computer){
                winner = classesWin[el.win]
            }
        })
        document.querySelector(".winner h1").innerHTML = winner;
    }


    function randomIndex(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
      


}

import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
// import '@tensorflow/tfjs-core';
// Register WebGL backend.
// import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';
const rpcmodel = await tf.loadLayersModel('./model/rock-paper-scissor-model/model.json');