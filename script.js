// Author: Jordan Muturi

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let sliderDiv;
let slider;
let sadSpan;
let happySpan;
let buttonDiv;
let addExampleButton;
let trainButton;

// Global ML Variables
let featureExtractor;
let predictor;
let video;
let isModelReady;
let isTrainingComplete;
let addedExamples;

function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model is loading, please wait...");
  textP.parent(textDiv);
  //Build the input
  buildInput();
  // initiallize addedExamples 
  addedExamples = 0;
  isModelReady = false;
  isTrainingComplete = false;
  video = createCapture(VIDEO, videoReady);
}

function draw() {
  //Shows video
  if(isModelReady) {
    image(video, 0, 0);
  }
  //Model starts predicting 
  if(isTrainingComplete) {
    predictor.predict(canvas, gotResults);
  }
  
}

function buildInput() {
  sliderDiv = createDiv();
  sadSpan = createSpan("Sad");
  sadSpan.parent(sliderDiv);
  // (0%, 1 = 100%, slider starts here, increment)
  slider = createSlider(0, 1, 0.5, 0.01)
  slider.parent(sliderDiv);
  happySpan = createSpan("Happy");
  happySpan.parent(sliderDiv);
  buttonDiv = createDiv();
  addExampleButton = createButton("Add Example");
  addExampleButton.parent(buttonDiv);
  addExampleButton.mousePressed(function () {
    addedExamples++;
    textP.html("Added Examples: " + addedExamples);
    predictor.addImage(canvas, slider.value());
  });
  trainButton = createButton("Train Model");
  trainButton.parent(buttonDiv);
  trainButton.mousePressed(function() {
    buttonDiv.style("display", "none");
    sliderDiv.style("display", "none");
    predictor.train(whileTraining);
  });
  buttonDiv.style("display", "none");
  sliderDiv.style("display", "none");
}

function videoReady() {
  video.style("display", "none");
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

function featureExtractorLoaded() {
  predictor = featureExtractor.regression(canvas, modelReady);
}

function modelReady() {
  isModelReady = true;
  textP.html("Add examples to train the AI");
  buttonDiv.style("display", "block");
  sliderDiv.style("display", "block");

}

function whileTraining(loss) {
  if(loss) {
    console.log(loss);
  } else {
    isTrainingComplete = true;
  }
}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    //console.log(results);
    let value = floor(results.value * 100);
    textP.html("Happiness: " + value + "%");
  }
}
