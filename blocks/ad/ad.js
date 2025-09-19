import { buildAdBlock } from '../../scripts/shared.js';

export default function decorate(block) {
  // Extract the unit-id from the block
  const unitIdElement = block.querySelector('div:nth-child(1) > div:nth-child(2)');
  if (!unitIdElement) {
    // eslint-disable-next-line no-console
    console.error('Unit ID not found in the block');
    return;
  }
  const unitId = unitIdElement.textContent;

  // Remove the divs containing the 'id', 'unit-id', 'type', and the type value
  const divContainers = block.querySelectorAll('div > div');
  divContainers.forEach((div) => div.remove());

  const adBlock = buildAdBlock(unitId);
  if (adBlock) {
    block.append(adBlock);
  }
}
