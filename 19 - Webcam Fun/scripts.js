const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
      console.log(localMediaStream);
    })
    .catch(error => {
      console.error('Ohh No!!', error);
    });
};

const paintToCanvas = () => {
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0 , 0, width, height);

    // Apply the effects
    let pixels = ctx.getImageData(0, 0, width, height); // get the image pixels

    /* red effect */
    // pixels = redEffect(pixels);

    /* rgb split */
    // pixels = rgbSplit(pixels);
    // ctx.globalAplha = 0.2; // ghosting the images

    /* green screen effect */
    pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0); // use the new pixel

  }, 20);
}

const redEffect = pixels => {
  for (let index = 0; index < pixels.data.length; index += 4) {
    // The constant values are random. You can use any number
    pixels.data[index + 0] = pixels.data[index + 0] + 100; // Red
    pixels.data[index + 1] = pixels.data[index + 1] - 50; // Green
    pixels.data[index + 2] = pixels.data[index + 2] * 0.5; // Blue
  }
  return pixels;
};

const rgbSplit = (pixels) => {
  for (let index = 0; index < pixels.data.length; index += 4) {
    // The constant values are random. You can use any number
    pixels.data[index - 150] = pixels.data[index + 0]; // Red
    pixels.data[index + 500] = pixels.data[index + 1]; // Green
    pixels.data[index - 450] = pixels.data[index + 2]; // Blue
  }
  return pixels;
};

const greenScreen  = (pixels) => {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.nodeValue;
  });

  for (let index = 0; index < pixels.data.length; index += 4) {
    // The constant values are random. You can use any number
    const red = pixels.data[index + 0];
    const green = pixels.data[index + 1];
    const blue = pixels.data[index + 2];
    const alpha = pixels.data[index + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out by setting the transparency to 0!
      pixels.data[index + 3] = 0;
    }
  }
  return pixels;
};

const takePhoto = () => {
  // play the audio sound
  snap.currentTime = 0;
  snap.play();

  // take the data from the canvas
  const data = canvas.toDataURL('image/jpeg');

  // append the photo to the DOM
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'Myself');
  // link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Myself photo" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
