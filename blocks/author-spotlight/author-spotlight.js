/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
// eslint-disable-next-line import/named
import { all, allAuthors, getGermanBtnText, getTheTheme, sortArticlesByPublishDate } from '../../scripts/shared.js';

function createAuthorName(authorData) {
  const authorName = document.createElement('a');
  authorName.href = `${authorData.path}`;
  authorName.textContent = `${authorData.author}`;

  const authorNameWrapper = document.createElement('h4');
  authorNameWrapper.appendChild(authorName);

  return authorNameWrapper;
}

function createAuthorImage(authorData) {
  const authorImage = document.createElement('img');
  authorImage.setAttribute('alt', `${authorData.author}`);
  authorImage.src = `${authorData.authorimage}`;

  return authorImage;
}

// Creates a button to navigate to author profile page
function createAuthorProfileBtn(authorData) {
  const authorProfile = document.createElement('a');
  authorProfile.href = `${authorData.path}`;
  authorProfile.textContent = getGermanBtnText();
  authorProfile.setAttribute('role', 'button');
  authorProfile.setAttribute('aria-pressed', 'true');

  const authorProfileWrapper = document.createElement('div');
  authorProfileWrapper.classList.add('author-profile-btn');

  authorProfileWrapper.appendChild(authorProfile);

  return authorProfileWrapper;
}

// Creates section with more articles from the author
function createMoreFromAuthor(authorData, articles) {
  const spotlightContent = document.createElement('div');
  spotlightContent.classList.add('spotlight-content');
  spotlightContent.classList.add('medium-emphasis');

  if (articles.length <= 1) {
    return spotlightContent;
  }
  const moreFromAuthor = document.createElement('h6');
  moreFromAuthor.textContent =
    getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Mehr von ${authorData.author}` : `More from ${authorData.author}`;

  const moreFirstLink = document.createElement('a');
  moreFirstLink.href = `${articles[1].path}`;
  moreFirstLink.textContent = `${articles[1].title}`;

  const moreFirstWrapper = document.createElement('p');
  moreFirstWrapper.appendChild(moreFirstLink);

  const authorMore = document.createElement('div');
  authorMore.classList.add('author-more');
  authorMore.appendChild(moreFromAuthor);
  authorMore.appendChild(moreFirstWrapper);

  spotlightContent.appendChild(authorMore);

  if (articles.length <= 2) {
    return spotlightContent;
  }
  const moreSecondLink = document.createElement('a');
  moreSecondLink.href = `${articles[2].path}`;
  moreSecondLink.textContent = `${articles[2].title}`;

  const moreSecondWrapper = document.createElement('p');
  moreSecondWrapper.appendChild(moreSecondLink);

  const authorMoreNext = document.createElement('div');
  authorMoreNext.classList.add('author-more-next');
  authorMoreNext.appendChild(moreSecondWrapper);

  spotlightContent.appendChild(authorMoreNext);

  return spotlightContent;
}

// Creates the author spotlight card
function createAuthorSpotlightCard(authorData, articles, wrapper) {
  const authorNameWrapper = createAuthorName(authorData);
  const authorSpotlight = document.createElement('h5');
  authorSpotlight.textContent = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Autor im Rampenlicht' : 'Author spotlight';

  const authorDetailsContent = document.createElement('div');
  authorDetailsContent.classList.add('author-details-content');
  authorDetailsContent.appendChild(authorSpotlight);
  authorDetailsContent.appendChild(authorNameWrapper);

  const authorImage = createAuthorImage(authorData);
  const authorDetails = document.createElement('div');
  authorDetails.classList.add('author-details');
  if (authorImage.src && authorImage.src !== `${window.location.href}`) {
    authorDetails.appendChild(authorImage);
  }

  authorDetails.appendChild(authorDetailsContent);

  const authorPositions = document.createElement('p');
  authorPositions.textContent = `${authorData.authorposition}`;

  const authorProfileWrapper = createAuthorProfileBtn(authorData);
  const authorHighEmphasis = document.createElement('div');
  authorHighEmphasis.classList.add('author-spotlight');
  authorHighEmphasis.classList.add('high-emphasis');

  authorHighEmphasis.appendChild(authorDetails);
  authorHighEmphasis.appendChild(authorPositions);
  authorHighEmphasis.appendChild(authorProfileWrapper);

  const spotlightContent = createMoreFromAuthor(authorData, articles);
  wrapper.appendChild(authorHighEmphasis);
  wrapper.appendChild(spotlightContent);
}

function authorAlias(wrapper) {
  const authorAliasMeta = document.querySelector('meta[name="authoralias"]');
  const aliasUrlMeta = document.querySelector('meta[name="aliasurl"]');

  if (!authorAliasMeta || !aliasUrlMeta) {
    console.error('Meta tags for authoralias or aliasurl not found');
    return;
  }

  const alias = authorAliasMeta.content;
  const aliasUrl = aliasUrlMeta.content;

  const authorNameLink = document.createElement('a');
  authorNameLink.href = aliasUrl;
  authorNameLink.textContent = alias;

  const authorNameWrapper = document.createElement('h4');
  authorNameWrapper.appendChild(authorNameLink);

  const authorSpotlight = document.createElement('h5');
  authorSpotlight.textContent = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Autor im Rampenlicht' : 'Author spotlight';

  const authorDetailsContent = document.createElement('div');
  authorDetailsContent.classList.add('author-details-content');
  authorDetailsContent.appendChild(authorSpotlight);
  authorDetailsContent.appendChild(authorNameWrapper);

  const authorDetails = document.createElement('div');
  authorDetails.classList.add('author-details');
  authorDetails.appendChild(authorDetailsContent);

  const authorProfileLink = document.createElement('a');
  authorProfileLink.href = aliasUrl;
  authorProfileLink.textContent = getGermanBtnText();
  authorProfileLink.setAttribute('role', 'button');
  authorProfileLink.setAttribute('aria-pressed', 'true');

  const authorProfileWrapper = document.createElement('div');
  authorProfileWrapper.classList.add('author-profile-btn');
  authorProfileWrapper.appendChild(authorProfileLink);

  const authorHighEmphasis = document.createElement('div');
  authorHighEmphasis.classList.add('author-spotlight');
  authorHighEmphasis.classList.add('high-emphasis');
  authorHighEmphasis.appendChild(authorDetails);
  authorHighEmphasis.appendChild(authorProfileWrapper);

  const spotlightContent = document.createElement('div');
  spotlightContent.classList.add('spotlight-content');
  spotlightContent.classList.add('medium-emphasis');

  wrapper.appendChild(authorHighEmphasis);
  wrapper.appendChild(spotlightContent);
}

// Used to fetch author articles data
async function fetchArticles(url, author) {
  try {
    // attempt to fetch from the specified sheet
    const articlesGenerator = ffetch(url);
    const articles = await all(articlesGenerator);

    const authorArticles = articles.filter((article) => article.author === author);
    const sortedArticles = sortArticlesByPublishDate(authorArticles);

    return sortedArticles;
  } catch (error) {
    console.error('Error fetching articles', error);
  }
  return null;
}

// Used to fetch authors
async function fetchAuthors(url, author, wrapper) {
  try {
    const authorsGenerator = ffetch(url);
    const authors = await allAuthors(authorsGenerator);
    const authorAliasMeta = document.querySelector('meta[name="authoralias"]');
    const alias = authorAliasMeta ? authorAliasMeta.content : '';
    const authorData = authors.filter((list) => list.author === author);

    if (authorData.length === 0) {
      console.error('No matching author data found in the JSON');

      if (author === alias) {
        console.error('No matching author data found for author alias name');
        authorAlias(wrapper);
        return;
      }
      authorAlias(wrapper);
      return;
    }

    const articles = await fetchArticles('/article-query-index.json', author, wrapper);
    if (articles === null || articles.length === 0) {
      authorAlias(wrapper);
      return;
    }
    createAuthorSpotlightCard(authorData[0], articles, wrapper);
  } catch (error) {
    console.error('Error fetching authors or articles', error);
    authorAlias(wrapper);
  }
}

export default function decorate(block) {
  const articleAuthorMeta = document.querySelector('meta[name="author"]');
  const authorAliasMeta = document.querySelector('meta[name="authoralias"]');

  const articleAuthor = articleAuthorMeta ? articleAuthorMeta.content : '';

  if (!authorAliasMeta) {
    const authorSpotlightBlock = document.createElement('div');
    authorSpotlightBlock.classList.add('author-spotlight-block');
    block.appendChild(authorSpotlightBlock);

    fetchAuthors('/author-query-index.json', articleAuthor, authorSpotlightBlock);
  }
}
