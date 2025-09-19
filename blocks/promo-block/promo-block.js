export default async function decorate(block) {
  const firstParagraph = block.querySelector('.promo-block.block > div > div > p:nth-child(1)');
  if (firstParagraph) {
    const firstLink = firstParagraph.querySelector('a');
    if (firstLink) {
      const h3 = document.createElement('h3');
      h3.innerHTML = `<a href="${firstLink.href}" title="${firstLink.innerHTML}">${firstLink.innerHTML}</a>`;
      firstParagraph.replaceWith(h3);
    }
  }

  const paragraphElement = block.querySelector('.promo-block.block > div > div > p:nth-child(2)');
  if (paragraphElement) {
    paragraphElement.classList.add('image-div');
  }

  const buttonContainers = block.querySelectorAll('.promo-block.block > div > div > p');
  buttonContainers.forEach((container, index) => {
    container.classList.remove('button-container');
    if (index === 1) {
      container.classList.add('button-one');
    } else if (index === 2) {
      container.classList.add('button-two');
    } else if (index === 3) {
      container.classList.add('button-three');
    }
  });

  const buttonOneLink = block.querySelector('p.button-one > a');
  if (buttonOneLink) {
    const hrefText = buttonOneLink.href;

    const pictureElement = block.querySelector('picture');
    if (pictureElement) {
      const newLinkElement = document.createElement('a');
      newLinkElement.href = hrefText;

      pictureElement.parentNode.insertBefore(newLinkElement, pictureElement);
      newLinkElement.appendChild(pictureElement);
    }
  }
}
