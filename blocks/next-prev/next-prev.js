import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const max = parseInt(config.max, 10);
  const dbDetails = config.detailslink;
  const dbHome = config.homelink;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const key = urlSearchParams.get('c');
  let c = parseInt(key, 10);

  // Clear block contents
  block.innerHTML = '';

  const detailshead = document.createElement('div');
  detailshead.id = 'detailshead';
  block.append(detailshead);

  let newHead = '';
  if (c > 1 && c < max) {
    newHead = `&laquo; <a href='${dbDetails}?c=${c - 1}'> Previous</a>
    | <a href='${dbHome}'>Home</a> | <a href='${dbDetails}?c=${c + 1}'>Next</a> &raquo;`;
  } else if (c === max) {
    newHead = `&laquo; <a href='${dbDetails}?c=${parseInt(max, 10) - 1}'> Previous</a>
    | <a href='${dbHome}'>Home</a> | <a href='${dbDetails}?c=1'>Next</a> &raquo;`;
  } else {
    c = 1;
    newHead = `&laquo; <a href='${dbDetails}?c=${max}'> Previous</a> | <a href='${dbHome}'>Home</a>
    | <a href='${dbDetails}?c=2'>Next</a> &raquo;`;
  }
  document.getElementById('detailshead').innerHTML = newHead;
}
