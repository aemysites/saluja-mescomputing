export default function decorate(block) {
  const paragraphs = block.querySelectorAll('p');

  paragraphs.forEach((p) => {
    p.removeAttribute('class');
    const a = p.querySelector('a');
    if (a.getAttribute('href') === `mailto:${a.textContent}`) {
      a.removeAttribute('class');
      p.className = 'membership-email';
    }
  });

  block.querySelector('.button-container > a').removeAttribute('class');

  return block;
}
