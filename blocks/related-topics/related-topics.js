import { getMetadata } from '../../scripts/aem.js';
import { getTheTheme, updateHostname } from '../../scripts/shared.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

export default function decorate(block) {
  const tagURL = '/tag/';
  const categoryURL = '/category/';
  const categoryMetadata = getMetadata('category') || '';
  const tagMetadata = getMetadata('tag') || '';

  const categories = categoryMetadata
    .split(', ')
    .map((category) => `<li><a class="category" href="${categoryURL}${createCategorySlug(category)}">${category}</a></li>`)
    .join('');

  const tags = tagMetadata
    .split(', ')
    .map((tag) => `<li><a class="tag" href="${tagURL}${createCategorySlug(tag)}">${tag}</a></li>`)
    .join('');

  block.innerHTML = `
        <div class="topics">
            <p> ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Verwandte Themen' : 'Related Topics'}</p>
            <ul>
                ${categories}
                ${tags}
            </ul>
        </div>
    `;

  updateHostname(block);
}
