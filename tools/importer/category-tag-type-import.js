/* global WebImporter */

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

// metadata block
const createMetadataBlock = (main, document) => {
  const meta = {};

  const url = document.querySelector('[property="og:url"]').content;

  // get the title
  // const title = document.querySelector('title');
  let title = document.querySelector(
    '.wrapper-container.ajax_search .container-fluid .common-left-hand-block .searchmargin h1'
  );

  if (title) {
    meta.title = title.textContent;
  } else {
    const { pathname } = new URL(url);
    const pathComponents = pathname.split('/');
    title = {
      textContent: capitalizeFirstLetter(pathComponents[pathComponents.length - 1]),
    };
    meta.title = title.textContent;
  }

  // get category, tag or type
  // set template
  if (url.includes('category')) {
    meta.template = 'category';
    meta.category = title.textContent;
  } else if (url.includes('tag')) {
    meta.template = 'tag';
    meta.tag = title.textContent;
  } else if (url.includes('type')) {
    meta.template = 'type';
    meta.type = title.textContent;
  }

  // get the description
  const description = document.querySelector('[name="description"]');
  if (description) {
    meta.description = description.content;
  }

  // get the author position
  const keywords = document.querySelector('[name="keywords"]');
  if (keywords) {
    meta.keywords = keywords.content;
  }

  // get the social media
  const socialLinks = document.querySelectorAll('#author-page .authorpublish ul li a');

  if (socialLinks) {
    socialLinks.forEach((link) => {
      link.innerText = link.href;
    });
  }

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);
  return meta;
};

// clean up
export default {
  transformDOM({ document }) {
    const main = document.body;
    createMetadataBlock(main, document);
    WebImporter.DOMUtils.remove(main, ['#wrapper', '.kreatio-mostread', '.upcoming-events-ticker']);
    return main;
  },
};
