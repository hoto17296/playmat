const video = document.getElementsByTagName('video')[0];
const canvasContainer = document.getElementById('canvas-container');
var canvas = null;
var nubs = null;
var dragging = null;
var initialNubPositions = null;

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
  canvas = fx.canvas();
  canvasContainer.appendChild(canvas);
  nubs = document.createElement('div');
  nubs.className = 'nubs';
  canvasContainer.appendChild(nubs);
}

function updateCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.draw(canvas.texture(video));
  if (initialNubPositions) {
    canvas.perspective(initialNubPositions, getNubPositions()).update();
  }
  setTimeout(updateCanvas, 1000);
}

function resetNubs() {
  nubs.innerHTML = '';
  for (let i of [-1, 1]) {
    for (let j of [-1, 1]) {
      const nub = document.createElement('div');
      nub.className = 'nub';
      nub.style.top = (i + 2) / 4 * canvas.clientHeight + 'px';
      nub.style.left = (j + 2) / 4 * canvas.clientWidth + 'px';
      nub.addEventListener('mousedown', function() { dragging = this });
      nubs.appendChild(nub);
    }
  }
  initialNubPositions = getNubPositions();
}

function onDrag(e) {
  if (!dragging) return;
  const body = document.body;
  const html = document.documentElement;
  const x = e.clientX - canvasContainer.offsetLeft + (body.scrollLeft || html.scrollLeft);
  const y = e.clientY - canvasContainer.offsetTop + (body.scrollTop || html.scrollTop);
  dragging.style.top = y + 'px';
  dragging.style.left = x + 'px';
  canvas.draw(canvas.texture(video));
  if (initialNubPositions) {
    canvas.perspective(initialNubPositions, getNubPositions()).update();
  }
}

function getNubPositions() {
  const positions = [];
  const scale = canvas.width / canvas.clientWidth;
  for (nub of canvasContainer.getElementsByClassName('nub')) {
    positions.push(parseFloat(nub.style.left) * scale);
    positions.push(parseFloat(nub.style.top) * scale);
  }
  return positions;
}

init();