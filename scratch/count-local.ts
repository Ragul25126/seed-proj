import { portfolio } from '../lib/data';

let total = 0;
portfolio.forEach(proj => {
  const imagesToProcess: string[] = [];
  if (proj.image) {
    imagesToProcess.push(proj.image);
  }
  if (proj.images && proj.images.length > 0) {
    proj.images.forEach(img => {
      if (!imagesToProcess.includes(img)) {
        imagesToProcess.push(img);
      }
    });
  }
  total += imagesToProcess.length;
  console.log(`Project: "${proj.title}" -> ${imagesToProcess.length} images`);
});

console.log(`\nTotal Expected Images: ${total}`);
