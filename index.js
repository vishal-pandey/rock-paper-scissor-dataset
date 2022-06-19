
window.onload = async ()=> {

let classes = ["rock"]

let datasetInfo = {
    "rock": 725,
    "paper": 711,
    "scissors": 749
}

let keyPointsMapping = {
    'wrist': 0,
    'thumb_cmc': 1,
    'thumb_mcp': 2,
    'thumb_ip': 3,
    'thumb_tip': 4,
    'index_finger_mcp': 5,
    'index_finger_pip': 6,
    'index_finger_dip': 7,
    'index_finger_tip': 8,
    'middle_finger_mcp': 9,
    'middle_finger_pip': 10,
    'middle_finger_dip': 11,
    'middle_finger_tip': 12,
    'ring_finger_mcp': 13,
    'ring_finger_pip': 14,
    'ring_finger_dip': 15,
    'ring_finger_tip': 16,
    'pinky_finger_mcp': 17,
    'pinky_finger_pip': 18,
    'pinky_finger_dip': 19,
    'pinky_finger_tip': 20
}

const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
                // or 'base/node_modules/@mediapipe/hands' in npm.
};
let detector = await handPoseDetection.createDetector(model, detectorConfig);


let element = "rock"
let rockModel = new Array(datasetInfo['rock']).fill(0);

// for (let index = 0; index < datasetInfo[element]; index++) {
//     await generage(element, index)
// }


let image = document.createElement("img")
image.setAttribute('src', "samples"+"/"+"paper"+'.jpg')

image.onload = async ()=>{
    setTimeout(async()=> {
        console.log(image)
        const estimationConfig = {flipHorizontal: false};
        const hands = await detector.estimateHands(image, estimationConfig);
        let data = []
        hands[0].keypoints3D.forEach(element => {
            let x = []
            x.push(element.x, element.y, element.z, keyPointsMapping[element.name])
            data.push(x)
        })
        // console.log(hands[0].keypoints3D);
        console.log(data)
    }, 100)
    
}



var data = []

async function generate(el, i = 0) {

    if(i > datasetInfo[el]){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();

        console.log(data)
        return
    }
    rockModel[i] = document.createElement("img")
    rockModel[i].setAttribute('src', el+'/'+i+'.png')
    console.log(rockModel[i])
    setTimeout(async ()=>{
        const estimationConfig = {flipHorizontal: false};
        const hands = await detector.estimateHands(rockModel[i], estimationConfig);
        
        console.log(hands)
        let x = []
        hands[0]?.keypoints3D?.forEach(element => {
            let xx = []
            xx.push(element.x, element.y, element.z, keyPointsMapping[element.name])
            x.push(xx)
        })
        data.push(x)
        await generate(el, i+1);
    }, 40)

}

await generate("scissors");

}

import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';
