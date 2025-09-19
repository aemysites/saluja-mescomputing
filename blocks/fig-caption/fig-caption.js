export default function decorate(block) {
  if (block.classList.contains('heading')) {
    const directChildDiv = block.querySelector(':scope > div');
    if (directChildDiv) {
      directChildDiv.classList.add('heading-caption');
    }
  } else {
    const firstInnerDiv = block.querySelector(':scope > div:first-child');
    const secondDiv = block.querySelector(':scope > div:nth-child(2)');
    if (firstInnerDiv) {
      firstInnerDiv.classList.add('image-container');
    }
    if (secondDiv) {
      secondDiv.classList.add('caption-container');
    }
  }
}
