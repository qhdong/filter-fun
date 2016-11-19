(function() {
  "use strict";
  var canvas = document.getElementById('canvas');
  var fileInput = document.getElementById('fileInput');
  var grayBtn = document.getElementById('grayBtn');
  var redBtn = document.getElementById('redBtn');
  var blurBtn = document.getElementById('blurBtn');
  var resetBtn = document.getElementById('resetBtn');
  var imageSize = document.getElementById('imgsize');

  var origImage = null;
  var grayImage = null;
  var redImage = null;
  var rainbowImage = null;

  resetBtn.addEventListener('click', function(e) {
    reset();
  });

  grayBtn.addEventListener('click', function(e) {
    if (imageIsLoaded(grayImage)) {
      filterGray();
      grayImage.drawTo(canvas);
    }
  });

  redBtn.addEventListener('click', function(e) {
    if (imageIsLoaded(redImage)) {
      filterRed();
      redImage.drawTo(canvas);
    }
  });

  blurBtn.addEventListener('click', function(e) {
    if (imageIsLoaded(origImage)) {
      var blurImage = new SimpleImage(origImage.getWidth(), origImage.getHeight());
      filterBlur(blurImage);
      blurImage.drawTo(canvas);
    }
  });

  fileInput.addEventListener('change', function(e) {
    origImage = new SimpleImage(fileInput);
    grayImage = new SimpleImage(fileInput);
    redImage = new SimpleImage(fileInput);
    origImage.drawTo(canvas);
  });

  function imageIsLoaded(image) {
    if (image == null || !image.complete()) {
      alert('Image not loaded');
      return false;
    }
    imageSize.innerHTML = `${origImage.getWidth()} x ${origImage.getHeight()}`;
    return true;
  }

  function filterGray() {
    for (let pixel of grayImage.values()) {
      let avg = (pixel.getRed() + pixel.getBlue() + pixel.getGreen()) / 3;
      pixel.setRed(avg);
      pixel.setGreen(avg);
      pixel.setBlue(avg);
    }
  }

  function filterRed() {
    for (let pixel of redImage.values()) {
      var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(2 * avg - 255);
      }
    }
  }

  function filterBlur(image) {
    for (let pixel of origImage.values()) {
      let x = pixel.getX();
      let y = pixel.getY();
      if (Math.random() > 0.5) {
        let other = getPixelNearBy(origImage, x, y, 10);
        image.setPixel(x, y, other);
      } else {
        image.setPixel(x, y, pixel);
      }
    }
  }

  function getPixelNearBy(image, x, y, diameter) {
    let dx = Math.random() * diameter - diameter / 2;
    let dy = Math.random() * diameter - diameter / 2;
    let nx = ensureInImage(x + dx, image.getWidth());
    let ny = ensureInImage(y + dy, image.getHeight());
    return image.getPixel(nx, ny);
  }

  function ensureInImage(coordinate, size) {
    if (coordinate < 0) {
      return 0;
    }
    if (coordinate >= size) {
      return size - 1;
    }
    return coordinate;
  }

  function reset() {
    if (imageIsLoaded(origImage)) {
      origImage.drawTo(canvas);
      grayImage = new SimpleImage(origImage);
      redImage = new SimpleImage(origImage);
    }
  }


})();
