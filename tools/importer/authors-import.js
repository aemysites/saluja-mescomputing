/* global WebImporter */

// metadata block
const createMetadataBlock = (main, document) => {
  const meta = {};
  meta.template = 'author';

  // get the title
  const authorTitle = document.querySelector('title');
  if (authorTitle) {
    meta.title = authorTitle.innerHTML.replace(/[\n\t]/gm, '');
  }

  // get the author name
  const authorName = document.querySelector('#author-page .card-body .authorhead h4');
  if (authorName) {
    meta.author = authorName.innerHTML.replace(/[\n\t]/gm, '');
  }

  // get the author image
  const img = document.querySelector('#author-page .author-profiles img');
  const imgCrn = document.querySelector('[name="authorimage"]');
  if (img) {
    const el = document.createElement('img');
    el.src = img.src;
    meta.authorImage = el;
  } else if (imgCrn) {
    const el = document.createElement('img');
    // eslint-disable-next-line prefer-destructuring
    el.src = `https://www.crn.com${imgCrn.content.replace('.', '')}`.split('?')[0];
    meta.authorImage = el;
  }

  // get the author description
  const authorDescription = document.querySelector('[name="description"]');
  if (authorDescription) {
    meta.authorDescription = authorDescription.content;
  }

  // get the author position
  const authorPosition = document.querySelector('#author-page .card-body .authorprofile1 p');
  if (authorPosition) {
    meta.authorPosition = authorPosition.innerHTML.replace(/[\n\t]/gm, '');
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
  transformDOM: ({ document }) => {
    const main = document.body;
    createMetadataBlock(main, document);

    WebImporter.DOMUtils.remove(main, [
      '.bhide-768',
      'footer',
      'nav',
      '.search-author-margin',
      '#author-page div.common-left-hand-block.col-lg-8 .mb-2:not(:nth-child(2))',
      '.pagination.pagination-holder',
      '.ranked-articles-list',
      '.kreatio-mostread',
      '.upcoming-events-ticker',
    ]);

    return main;
  },
};
