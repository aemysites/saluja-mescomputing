/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { allAuthors } from '../../scripts/shared.js';

/**
 * Creates an image element for the author with a corresponding link
 * @param {object} author The author object containing the image URL
 * @returns {HTMLElement} The image element with a link
 */
function createAuthorImage(author) {
  // Create a div element for the author image
  if (!author.path || !author.authorimage) return null;
  const authorImage = document.createElement('div');
  authorImage.className = 'meet-authors-image';
  const imageLink = document.createElement('a');
  imageLink.href = author.path;
  imageLink.target = '_blank';
  const imageElement = document.createElement('img');
  imageElement.src = author.authorimage;
  imageElement.alt = 'Author Image';
  imageLink.appendChild(imageElement);
  authorImage.appendChild(imageLink);
  return authorImage;
}

/**
 * Creates a name element for the author with a corresponding link
 * @param {string} author The name of the author
 * @returns {HTMLElement} The name element
 */
function createAuthorName(author) {
  if (!author.author) return null;
  const authorName = document.createElement('div');
  authorName.className = 'meet-authors-name';
  authorName.textContent = author.author;
  return authorName;
}

/**
 * Creates a description element for the author with a corresponding link
 * @param {string} author The description of the author
 * @returns {HTMLElement} The description element
 */
function createAuthorDescription(author) {
  const authorDescription = document.createElement('div');
  authorDescription.className = 'meet-authors-description';

  const descriptionText = document.createElement('span');
  descriptionText.textContent = author.description;

  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${author.mail}`;
  emailLink.textContent = ` ${author.mail}`;

  authorDescription.appendChild(descriptionText);
  authorDescription.appendChild(emailLink);

  return authorDescription;
}

/**
 * Generates an author card with the author's date, location, author type, title and more info link
 * @param {Object} author The author object
 */

function generateCard(author, wrapper) {
  const authorCard = document.createElement('div');
  authorCard.className = 'meet-authors';

  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'meet-authors-context-wrapper';

  const titleDiv = document.querySelector('.meet-authors div:first-child');
  titleDiv.className = 'title-div';
  titleDiv.textContent = 'Meet the Authors';

  const authorImage = createAuthorImage(author);
  if (authorImage) contextWrapper.appendChild(authorImage);
  const nameDescriptionDiv = document.createElement('div');
  nameDescriptionDiv.className = 'name-description';

  const authorName = createAuthorName(author);
  if (authorName) nameDescriptionDiv.appendChild(authorName);
  const authorDescription = createAuthorDescription(author);
  if (authorDescription) nameDescriptionDiv.appendChild(authorDescription);
  contextWrapper.appendChild(nameDescriptionDiv);

  wrapper.appendChild(contextWrapper);
}

async function fetchAuthors(url, wrapper) {
  try {
    const authorsGenerator = ffetch(url);

    const authors = await allAuthors(authorsGenerator);
    // Iterate through authors
    authors.forEach((item) => {
      generateCard(item, wrapper);
    });
  } catch (error) {
    console.error('Error fetching authors', error);
  }
}

export default function decorate(block) {
  const meetAuthorsContent = document.createElement('div');
  meetAuthorsContent.className = 'meet-authors-content';
  block.appendChild(meetAuthorsContent);

  fetchAuthors('/meet-authors.json', meetAuthorsContent);
}
