export default function decorate(block) {
  const whitepapersLink = block.querySelectorAll('.whitepapers > div:not(:first-child) > div a');

  whitepapersLink.forEach((link) => {
    link.setAttribute('target', '_blank');
  });
}
