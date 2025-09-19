function addCssClasses(container) {
  const divs = container.children;
  divs[0].classList.add('awards-title');
  divs[1].classList.add('awards-image');
  divs[2].classList.add('awards-link');
  divs[3].classList.add('awards-content');
  divs[4].classList.add('awards-previous');

  divs[2].querySelector('div').removeAttribute('class');
  divs[2].querySelector('a').removeAttribute('class');
}

export default function decorate(block) {
  const content = document.querySelector('.awards-and-lists');
  content.classList.add('awards');
  addCssClasses(content);

  block.appendChild(content);
}
