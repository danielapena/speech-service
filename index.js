const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
require("dotenv").config();

const helpers = require("./helpers");

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SERVICE_SUBSCRIPTION_KEY,
  process.env.SERVICE_REGION
);

const outputFilePath = process.env.OUTPUT_FILEPATH;
const inputWavFile = process.env.INPUT_WAV_FILEPATH;

speechConfig.speechRecognitionLanguage = "en-US";

let audioConfig = sdk.AudioConfig.fromWavFileInput(
  fs.readFileSync(inputWavFile)
);

let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

recognizer.recognizing = (s, e) => {
  console.log(`RECOGNIZING: Text=${e.result.text}`);
};

recognizer.recognized = (s, e) => {
  if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
    console.log(`RECOGNIZED: Text=${e.result.text}`);
    helpers.writeToFile(outputFilePath, e.result.text);
  } else if (e.result.reason == sdk.ResultReason.NoMatch) {
    console.log("NOMATCH: Speech could not be recognized.");
  }
};

recognizer.canceled = (s, e) => {
  console.log(`CANCELED: Reason=${e.reason}`);

  if (e.reason == sdk.CancellationReason.Error) {
    console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
    console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
    console.log("CANCELED: Did you update the key and location/region info?");
  }

  recognizer.stopContinuousRecognitionAsync();
};

recognizer.sessionStopped = (s, e) => {
  console.log("\n    Session stopped event.");
  recognizer.stopContinuousRecognitionAsync();
};

recognizer.startContinuousRecognitionAsync();
