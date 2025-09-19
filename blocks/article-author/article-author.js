/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { allAuthors, estimateTime, formatingDate } from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { getMetadata } from '../../scripts/aem.js';

// Gets the last item in the array which has the author's info
function getBio(data) {
  const { length } = data;
  return data[length - 1];
}

// Creates author link picture testing my upload - jd
function createAuthorLinkImage(authorData) {
  const authorInfo = getBio(authorData);
  const image = document.createElement('img');
  image.classList.add('author-pic');
  image.alt = `${authorInfo.author}`;

  if (authorInfo.authorimage) {
    image.src = authorInfo.authorimage;
  }

  const linkImage = document.createElement('a');
  linkImage.title = authorInfo.author;
  linkImage.href = authorInfo.path;
  linkImage.appendChild(image);

  return { image, linkImage };
}

// Creates article published date and read time
function createArticleInfo() {
  const articleDate = document.querySelector('meta[name="publisheddate"]').content;
  const date = formatingDate(articleDate);
  const publishedDate = document.createElement('span');
  publishedDate.setAttribute('itemprop', 'datePublished');
  publishedDate.setAttribute('content', date);
  publishedDate.textContent = date;

  const wordCount = document.querySelector('meta[name="wordcount"]')?.content;
  const readTime = document.createTextNode(estimateTime(wordCount));
  const articleInfo = document.createElement('div');
  articleInfo.classList.add('published');
  articleInfo.innerHTML = '<img class="article-clock" src="/icons/clock.svg"/>';

  articleInfo.appendChild(publishedDate);
  if (wordCount) {
    articleInfo.appendChild(readTime);
  }

  return articleInfo;
}

// Creates author name as link
function authorNameLink(authorData) {
  const authorName = document.createElement('a');
  authorName.href = `${getBio(authorData).path}`;
  authorName.textContent = `${getBio(authorData).author}`;

  const authorNameWrapper = document.createElement('div');
  authorNameWrapper.setAttribute('itemprop', 'name');
  authorNameWrapper.classList.add('author-name');

  authorNameWrapper.appendChild(authorName);

  const authorProp = document.createElement('span');
  authorProp.setAttribute('itemprop', 'author');
  authorProp.setAttribute('itemscope', '');
  authorProp.setAttribute('itemtype', 'http://schema.org/Person');

  authorProp.appendChild(authorNameWrapper);

  return authorProp;
}

function authorAlias(wrapper) {
  const authorAliasMeta = document.querySelector('meta[name="authoralias"]');
  const aliasUrlMeta = document.querySelector('meta[name="aliasurl"]');
  const alias = authorAliasMeta?.content;
  const aliasUrl = aliasUrlMeta?.content;
  const authorName = document.createElement('a');
  authorName.href = aliasUrl || '#';
  authorName.textContent = alias;

  const authorNameWrapper = document.createElement('div');
  authorNameWrapper.setAttribute('itemprop', 'name');
  authorNameWrapper.classList.add('author-name');
  authorNameWrapper.appendChild(authorName);

  const authorProp = document.createElement('span');
  authorProp.setAttribute('itemprop', 'author');
  authorProp.setAttribute('itemscope', '');
  authorProp.setAttribute('itemtype', 'http://schema.org/Person');
  authorProp.appendChild(authorNameWrapper);

  const authorRight = document.createElement('div');
  authorRight.classList.add('author-right');
  authorRight.appendChild(authorProp);

  const articleInfo = createArticleInfo();
  authorRight.appendChild(articleInfo);

  wrapper.appendChild(authorRight);
}

function createAuthorCard(authorData, wrapper) {
  const { image, linkImage } = createAuthorLinkImage(authorData);
  // only add 'author-left' div if img src is not empty and not the default base URL
  if (image.src && image.src !== `${window.location.href}`) {
    const authorLeft = document.createElement('div');
    authorLeft.classList.add('author-left');
    authorLeft.appendChild(linkImage);
    wrapper.appendChild(authorLeft);
  }

  const authorProp = authorNameLink(authorData);
  const authorRight = document.createElement('div');
  authorRight.classList.add('author-right');
  authorRight.appendChild(authorProp);

  const articleInfo = createArticleInfo(authorData);
  authorRight.appendChild(articleInfo);

  wrapper.appendChild(authorRight);
}

// Used to fetch author related data
async function fetchAuthors(url, author, wrapper) {
  try {
    // attempt to fetch from the specified sheet
    const authorsGenerator = ffetch(url);
    const authors = await allAuthors(authorsGenerator);
    const authorAliasMeta = document.querySelector('meta[name="authoralias"]');

    if (!author || authorAliasMeta) {
      if (authorAliasMeta !== null) {
        authorAlias(wrapper);
      }
      return;
    }

    const authorData = authors.filter((list) => list.author === author);
    if (authorData.length === 0 && authorAliasMeta !== null) {
      authorAlias(wrapper);
      return;
    }

    createAuthorCard(authorData, wrapper);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

export default function decorate(block) {
  const articleAuthorMeta = document.querySelector('meta[name="author"]');
  const articleAuthor = articleAuthorMeta ? articleAuthorMeta.content : '';
  const authorCard = document.createElement('div');
  const articleDate = getMetadata('publisheddate');
  const articleType = getMetadata('type');
  authorCard.classList.add('author');
  block.appendChild(authorCard);
  fetchAuthors('/author-query-index.json', articleAuthor, authorCard);
    if (!shouldBeGated(articleDate, articleType)) {
      const bwFlag = getMetadata('beyondwords');
      if (bwFlag && bwFlag === 'audio') {
        const bwContainer = document.createElement('div');
        bwContainer.classList.add('beyondwords-container');

        if (bwFlag && bwFlag === 'audio') {
          block.appendChild(bwContainer);
        }
      }

  }
}
