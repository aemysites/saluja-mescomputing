function checkForMoreMemberVariation(block) {
  return block.classList.contains('more-members-variation');
}

export default async function decorate(block) {
  const tableImages = block.querySelector('div div table').getElementsByTagName('img');
  Array.from(tableImages).forEach((image) => {
    image.setAttribute('width', 200);
    if (!checkForMoreMemberVariation(block)) {
      image.setAttribute('height', 200);
      image.setAttribute('alt', 'Customer Logo');
    }
  });
}
