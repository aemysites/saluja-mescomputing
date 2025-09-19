export default function decorate(block) {
  const title = block.querySelector('h2');
  const details = block.querySelector('h4');
  const list = block.querySelector('ul');

  title.classList = 'var-title';
  details.classList = 'var-details';
  list.classList = 'var-list';
}
