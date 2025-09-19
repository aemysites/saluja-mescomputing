/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { estimateTime, extractElementsFromString, formatingDate, getTheTheme } from '../../scripts/shared.js';
import { getMetadata } from '../../scripts/aem.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 */
function generateCard(article) {
  const isLock = shouldBeGated(article.publisheddate);
  const firstCategory = extractElementsFromString(article.category)[0];

  return render(`
  <div class="also-like-card">
    ${
      article.image !== '0' && article.image !== ''
        ? `<div class="also-like-card-image-wrapper">

      <a href="${article.path}">
        <img class='also-like-card-image' src="${article.image}" alt="Article Image"/>
      </a>
    </div>`
        : ``
    }
      <div class="also-like-card-context">
        <h4 class="also-like-card-category">
            <a href="/category/${createCategorySlug(firstCategory)}">
                ${firstCategory}
            </a>
        </h4>
        <div class="also-like-card-title ${isLock ? 'lock' : ''}">
            <h4><a title="${article.title}" class="" href="${article.path}">${article.title}</a></h4>
        </div>
        <div class="also-like-card-description">
         <p>${article.description.trim() !== '0' ? article.description : ''}</p>
        </div>
        <div class="also-like-card-date">
          <img alt="clock" src="/icons/clock.svg">
          ${formatingDate(article.publisheddate)}${estimateTime(article.wordcount)}
        </div>
    </div>
  </div>
  `);
}

export async function all(generator, tag) {
  const result = [];
  for await (const item of generator) {
    if (!getMetadata('og:url').includes(item.path)) {
      if (result.length < 3 && item.image !== '0' && item.publisheddate && item.tag.includes(tag)) {
        result.push(item);
      }
    }
  }
  return result;
}

async function fetchArticles(url, wrapper, tag, block) {
  try {
    // attempt to fetch from the specified sheet
    const response = await fetch(url);
    const json = await response.json();

    const articles = await all(json.data, tag);
    articles.forEach((item) => {
      const article = generateCard(item);
      wrapper.append(article);
    });
    if (!articles.length) {
      block.remove();
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'also-like-wrapper';
  const title = document.createElement('div');
  title.className = 'title';
  title.innerText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Könnte Sie auch interessieren' : 'You may also like';

  const firstDiv = block.querySelector('div');
  firstDiv.style.display = 'none';

  const filterByTags = getMetadata('tag');

  const tagString = filterByTags.replaceAll(', ', ',');
  const tag = tagString.split(',')[0];

  block.append(title);
  block.append(wrapper);

  // use drafts for testing until we have good date in main json
  fetchArticles('/article-query-index.json?offset=0&&limit=20000', wrapper, tag, block);
}
