// Get DOM elements:

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


function onResults(results) {
   canvasCtx.save();
   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
   canvasCtx.drawImage(
       results.image, 0, 0, canvasElement.width, canvasElement.height);

// Loop through Mediapipe face landmarks, normalize

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});

      var face_top = landmarks[10].y * canvasElement.height; // using the canvas, maybe use the video...
      var face_bottom = landmarks[152].y * canvasElement.height;

      var face_height = face_bottom - face_top;

      var mouth_top_y = landmarks[13].y * canvasElement.height;
      var mouth_bottom_y = landmarks[14].y * canvasElement.height;


      var face_left = landmarks[93].x * canvasElement.width;
      var face_right = landmarks[323].x * canvasElement.width;

      var face_height = face_right - face_left;

      var mouth_left = landmarks[78].x * canvasElement.width;
      var mouth_right = landmarks[308].x * canvasElement.width;

      // console.log("Mouth height: ", mouth_height); // Dont' log in production
    }
  }
  canvasCtx.restore();

  var mouth_height = ((mouth_bottom_y - mouth_top_y) / face_height * 10 / 2.3);
  var mouth_width = (((mouth_right - mouth_left) / face_height * 10 / 3) -1);
  api.send( 'custom-endpoint', [mouth_height, mouth_width]) // Send data through the Electron API
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `node_modules/@mediapipe/face_mesh/${file}`;
}});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start(); // Init the camera
