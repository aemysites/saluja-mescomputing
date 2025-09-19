import ffetch from '../../scripts/ffetch.js';
import { dataMapLookup, isURL } from '../../scripts/shared.js';
import { readBlockConfig, buildBlock, getMetadata, decorateBlock, loadBlock } from '../../scripts/aem.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';

function buildBecomeAMember() {
  const becomeAmember = buildBlock('become-a-member', { elems: [] });
  const article = document.querySelector('.details');
  if (article) {
    article.parentElement.insertBefore(becomeAmember, article);
    decorateBlock(becomeAmember);
    loadBlock(becomeAmember);
  }
}

function buildGatedArticles() {
  const gatedArticles = buildBlock('gated-articles', { elems: [] });
  const article = document.querySelector('.heading-row');
  if (article) {
    article.parentElement.insertBefore(gatedArticles, article.nextSibling);
    decorateBlock(gatedArticles);
    loadBlock(gatedArticles);
  }
}

async function getFilterDetails(block) {
  const config = readBlockConfig(block);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const key = urlSearchParams.get('c');
  const dataSource = config['data-source'];
  const { year } = config;
  const dataMapSheet = `/data-source/${dataSource}/data-mapping.json`;
  const dataMap = await ffetch(dataMapSheet).sheet(year).all();
  const spreadsheet = `/data-source/${dataSource}/${dataSource}-data.json`;
  const data = await ffetch(spreadsheet)
    .sheet(year)
    .map((item) => item)
    .filter((item) => item.Pkey === key);
  const { value } = await data.next();
  return {
    data: value,
    dataMap,
  };
}

function createImageDiv(imageUrl) {
  const imgDiv = document.createElement('div');
  imgDiv.classList.add('image');
  const img = document.createElement('img');
  img.src = imageUrl;
  imgDiv.append(img);
  return imgDiv;
}

export default async function decorate(block) {
  const { data, dataMap } = await getFilterDetails(block);
  const { heading, details, 'heading-image': headingImage } = readBlockConfig(block);
  block.innerHTML = '';

  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('details');

  if (headingImage) {
    const imgDiv = createImageDiv(data[headingImage]);
    imgDiv.classList.add('heading-img');
    detailsDiv.append(imgDiv);
  }

  const headingList = Array.isArray(heading) ? heading : [heading];
  headingList.forEach((header) => {
    const values = header.split(',');
    const row = document.createElement('div');
    row.classList.add('heading-row');
    values.forEach((value) => {
      const h = document.createElement('h2');
      const foundHeader = dataMap.find((item) => item.key === data[value.trim()]);
      h.innerText = foundHeader ? foundHeader.value : data[value.trim()];
      row.append(h);
    });
    detailsDiv.append(row);
  });
  block.append(detailsDiv);

  const qa = document.createElement('div');
  qa.classList.add('q-a');
  const detailsList = Array.isArray(details) ? details : [details];
  detailsList.forEach((detailItem) => {
    let parsedDetailItem;
    if (detailItem.includes(':')) {
      const [detailHeading, ...rest] = detailItem.split(':');
      const detailHeadingDiv = document.createElement('div');
      detailHeadingDiv.classList.add('details-heading');
      detailHeadingDiv.innerText = dataMapLookup(dataMap, detailHeading);
      detailsDiv.append(detailHeadingDiv);
      parsedDetailItem = rest.join(':');
    } else {
      parsedDetailItem = detailItem;
    }
    parsedDetailItem
      .split(',')
      .map((item) => item.trim())
      .forEach((rawDetail) => {
        const br = document.createElement('br');
        br.setAttribute('clear', 'all');

        let detail = rawDetail;
        let hasImage = false;
        if (rawDetail.includes('(') && rawDetail.includes(')')) {
          detail = rawDetail.slice(0, rawDetail.indexOf('('));
          hasImage = true;
          const imageUrl = data[rawDetail.slice(rawDetail.indexOf('(') + 1, rawDetail.indexOf(')' - 1))];
          if (imageUrl && imageUrl !== '') {
            const imgDiv = createImageDiv(imageUrl);
            detailsDiv.append(imgDiv);
          }
        }
        const foundPrompt = dataMap.find((item) => item.key === detail);
        const prompt = foundPrompt ? foundPrompt.value : detail;
        const answer = data[detail];
        if (answer !== '') {
          const promptDiv = document.createElement('div');
          const answerDiv = document.createElement('div');
          promptDiv.classList.add('prompt');
          answerDiv.classList.add('answer');
          promptDiv.innerHTML = prompt;
          answerDiv.innerHTML = isURL(answer) ? `<a href="${answer}">${answer}</a>` : answer;
          detailsDiv.append(promptDiv);
          detailsDiv.append(answerDiv);
          if (hasImage) detailsDiv.append(br);
        }
      });
  });
  qa.append(detailsDiv);
  block.append(qa);

  const articleDate = getMetadata('publisheddate');
  const articleType = getMetadata('type');
  const articleSection = document.querySelectorAll('.details');

  function addGatedArticles(article) {
    buildGatedArticles();
    buildBecomeAMember();
    const isPicture =
      articleSection[0].children.length > 1
        ? 'false'
        : articleSection[0]?.children[0]?.children[0]?.nodeName === 'PICTURE';

    let articleContent;
    let showItems;
    let sectionAfterRemove;
    if (articleSection[0].children.length > 1 && !isPicture) {
      [articleContent] = articleSection;
      showItems = 1;
    } else if (articleSection[0].children.length > 1) {
      [articleContent] = articleSection;
      showItems = 2;
    } else {
      [, articleContent] = articleSection;
      showItems = 2;
    }

    const articleChildren = articleContent.children;

    for (let i = articleChildren.length - 1; i > showItems; i -= 1) {
      articleChildren[i].remove();
    }

    const articleSectionAfterRemove = article.querySelectorAll('.qa .details');
    if (articleSectionAfterRemove.length > 1) {
      [, sectionAfterRemove] = article.querySelectorAll('.qa .details');
    } else {
      [sectionAfterRemove] = article.querySelectorAll('.qa .details');
    }
    if (sectionAfterRemove) {
      console.log(sectionAfterRemove);
    }
  }

  function init() {
    if (shouldBeGated(articleDate, articleType)) {
      addGatedArticles(document.querySelector('.details'));
    }
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      init();
    });
  }
}
