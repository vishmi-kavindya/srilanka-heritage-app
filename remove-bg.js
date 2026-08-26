const { Jimp } = require('jimp');
const path = require('path');

async function processImage() {
  try {
    const inputPath = path.join(__dirname, 'assets', 'images', 'logo.jpeg');
    const outputPath = path.join(__dirname, 'assets', 'images', 'logo.png');
    
    console.log('Reading image from', inputPath);
    
    // Read the image
    const image = await Jimp.read(inputPath);
    
    // Calculate distance between two colors
    const distance = (r1, g1, b1, r2, g2, b2) => {
      return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    };

    // Assuming the background is white (255, 255, 255)
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it transparent
      if (distance(red, green, blue, 255, 255, 255) < 80) { // Tolerance 80
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });

    await image.write(outputPath);
    console.log('Successfully saved to', outputPath);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
