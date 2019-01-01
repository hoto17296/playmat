const video = document.getElementsByTagName('video')[0];
const canvasContainer = document.getElementById('canvas-container');
var canvas = null;
var nubs = null;
var dragging = null;

function init() {
  const media = navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  media.then((stream) => {
    console.log('Successfully connect to camera!', stream);
    video.srcObject = stream;
    setTimeout(function() {
      resetCanvas();
      updateCanvas();
      resetNubs();
    }, 100);
  });
  canvasContainer.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', () => dragging = null);
}

function resetCanvas() {
  canvasContainer.innerHTML = '';
  canvas = document.createElement('canvas');
  canvasContainer.appendChild(canvas);
  nubs = document.createElement('div');
  nubs.className = 'nubs';
  canvasContainer.appendChild(nubs);
}

function updateCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  setTimeout(updateCanvas, 1000);
}

function resetNubs() {
  for (let i of [-1, 1]) {
    for (let j of [-1, 1]) {
      const nub = document.createElement('div');
      nub.className = 'nub';
      nub.style.top = (i + 2) / 4 * canvas.scrollHeight + 'px';
      nub.style.left = (j + 2) / 4 * canvas.scrollWidth + 'px';
      nub.addEventListener('mousedown', function() { dragging = this });
      nubs.appendChild(nub);
    }
  }
}

function onDrag(e) {
  if (!dragging) return;
  const x = e.clientX - canvasContainer.offsetLeft;
  const y = e.clientY - canvasContainer.offsetTop;
  dragging.style.top = y + 'px';
  dragging.style.left = x + 'px';
}

init();