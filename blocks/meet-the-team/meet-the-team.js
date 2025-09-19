export default async function decorate(block) {
  const elementsGroup = block.querySelectorAll(':scope > div > div');
  elementsGroup.forEach((element) => {
    if (element.childElementCount === 4 || element.childElementCount === 5) {
      const paragraph = element.querySelector('p:first-child');
      const img = paragraph.querySelector('img');
      if (img) {
        img.alt = 'Author image';
        paragraph.remove();
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('meet-the-team-image');
        imageContainer.append(img);
        element.insertAdjacentElement('afterbegin', imageContainer);
      }
    }
  });
}
