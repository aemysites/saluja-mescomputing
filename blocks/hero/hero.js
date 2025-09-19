export default function decorate(block) {
  const link = block.querySelector('a');
  const picture = block.querySelector('picture');
  const img = block.querySelector('img');
  img.alt = 'Hero image';

  if (link) {
    link.innerText = '';
    link.prepend(picture);
  }
}
