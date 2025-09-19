import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the sidebar
 * @param {Element} block The sidebar block element
 */
export default async function decorate(block) {
  const sidebarMeta = getMetadata('sidebar');
  block.textContent = '';

  if (!sidebarMeta || sidebarMeta === 'off') {
    return;
  }

  // load sidebar fragment
  const sidebarUrl = new URL(sidebarMeta);
  const fragment = await loadFragment(sidebarUrl.pathname);

  // decorate sidebar DOM
  const sidebar = fragment.querySelector(':scope > .section');
  while (sidebar.firstElementChild) {
    block.append(sidebar.firstElementChild);
  }
}
