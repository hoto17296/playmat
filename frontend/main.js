const video = document.getElementsByTagName('video')[0];
const canvas = document.getElementsByTagName('canvas')[0];

function init() {
  const media = navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  media.then((stream) => {
    video.srcObject = stream;
    updateCanvas();
  });
}

function updateCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  setTimeout(updateCanvas, 1000);
}

init();