// eslint-disable-next-line import/named
import {
  sortArticlesByPublishDate,
  getPageParam,
  extractElementsFromString,
  formatingDate,
  estimateTime,
  getTheTheme,
} from '../../scripts/shared.js';
import { getArticlesByPage, createPagination, pagination } from '../../scripts/pagination.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

const range = document.createRange();

function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Retrieves the search term as provided by a user.
 * @returns {string} Search term value.
 */
function getSearchTerm() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('query') || '').trim();
}

function getDateParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('date') || '').trim();
}

function getSortParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('sort') || '').trim();
}

// this function is commented until we will know from the client which is the type of articles
function getTypeParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('type') || '').trim();
}

function getFullCategoryParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('full_category') || '').trim();
}

function setSortParam(sort) {
  const params = new URLSearchParams(window.location.search);
  const sortParam = String(params.get('sort') || '').trim();
  if (sortParam === 'relevance1' && sort !== 'relevance1') {
    params.set('sort', 'recent');
  } else if (sortParam === 'recent' && sort !== 'recent') {
    params.set('sort', 'relevance1');
  }
  window.location.search = params;
}

function createTitile(searchTerm, searchWrapper) {
  const h4 = document.createElement('h4');
  h4.innerText = `Displaying 1-4 of 4 results for "${searchTerm}" `;
  h4.className = 'display-result';
  const noFoundh4 = document.createElement('h4');
  noFoundh4.innerText =
    getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de'
      ? `Es gibt keine Ergebnisse für "${searchTerm}"`
      : `There are no results for "${searchTerm}" `;
  noFoundh4.className = 'not-found';
  searchWrapper.append(h4);
  searchWrapper.append(noFoundh4);
}

function createOptionsForDropdowns(dropdowns) {
  const typesOne = ['Analysis', 'Blog', 'Feature', 'Interview', 'News', 'Opinion', 'Research'];
  const typesTwo = [
    'Advertisement',
    'Advice',
    'Analysis',
    'Blog',
    'Blog Post',
    'Campaign',
    'Column',
    'Content Hub',
    'Digital edition',
    'Discussion',
    'Download review',
    'Event',
    'Feature',
    'Glossary',
    'Interview',
    'News',
    'News Analysis',
    'Opinion',
    'Podcasts',
    'Products',
    'Profile',
    'Research',
    'Review',
    'Special',
    'Speech',
    'Sponsored',
    'Technical paper',
    'Web Seminar',
    'Wiki',
  ];
  const typesThree = [
    'Advertisement',
    'Advice',
    'Analysis',
    'Blog',
    'Blog Post',
    'Content Hub',
    'Digital edition',
    'Discussion',
    'Event',
    'Feature',
    'Interview',
    'Markets',
    'News',
    'News Analysis',
    'Opinion',
    'Products',
    'Profile',
    'Q&A',
    'Report',
    'Research',
    'Review',
    'Special',
    'Speech',
    'Sponsored',
    'Web Seminar',
    'Wiki',
  ];
  const typesFour = [
    'Analyse',
    'Analysis',
    'Beratung',
    'Bericht',
    'Besonderheit',
    'Bewertung',
    'Blog',
    'Blog Post',
    'Blog-Beitrag',
    'Content-Hub',
    'Digitale Ausgabe',
    'Discussion',
    'Diskussion',
    'Fall',
    'Feature',
    'Forschung',
    'Fragen und Antworten',
    'Gesponsert',
    'Interview',
    'Meinung',
    'Märkte',
    'Nachrichtenanalyse',
    'Nachschlagewerk',
    'News',
    'News Analysis',
    'Opinion',
    'Produkte',
    'Profil',
    'Profile',
    'Research',
    'Rezension',
    'Special',
    'Speziell',
    'Sponsored',
    'Vortrag',
    'Web-Seminar',
    'Werbung',
    'Whitepaper',
  ];
  const typesFive = ['Analysis', 'Blog', 'Feature', 'Interview', 'News', 'Opinion', 'Research'];
  const typesSix = ['Analysis', 'Blog', 'Feature', 'Interview', 'News', 'Opinion', 'Research'];
  const categoriesOne = [
    'Artificial Intelligence',
    'Big Data and Analytics',
    'Certifications',
    'Cloud Computing',
    'Column',
    'Data Center',
    'Hardware',
    '>> Chips and Components',
    'Marketing',
    'MES Research',
    'Search',
    'Security',
    '>> Hacking',
    '>> Threats and Risks',
    'Software',
    'Transformation',
  ];
  const categoriesTwo = [
    'Artificial Intelligence',
    'Big Data and Analytics',
    'Cloud and Infrastructure',
    'Cloud Computing',
    'Communications',
    '>> Internet',
    '>> Mobile',
    '>> Networks',
    '>> Telecoms',
    '>> Voice and Video',
    '>> Wireless',
    'DevOps',
    'Financial Solutions',
    'Hardware',
    '>> Appliances',
    '>> Chips and Components',
    '>> Client',
    '>> Components',
    '>> Datacentre',
    '>> Desktops',
    '>> Displays',
    '>> Gadgets',
    '>> Laptops',
    '>> Mobile Phones',
    '>> Peripherals',
    '>> Portable',
    '>> Printers',
    '>> Processors',
    '>> Server',
    '>> Storage',
    '>> Tablets',
    'Internet of Things',
    'Leadership',
    'Marketing',
    'Search',
    'Security',
    '>> Hacking',
    '>> Privacy',
    '>> Security Technology',
    '>> Threats and Risks',
    'Servers',
    'Software',
    '>> Applications',
    '>> Business Software',
    '>> Databases',
    '>> Developer',
    '>> Licensing',
    '>> Mobile Software',
    '>> Multimedia',
    '>> Office Software',
    '>> Open Source',
    '>> Operating Systems',
    '>> Social Networking',
    '>> Systems Management',
    '>> Systems Tools',
    '>> Utilities',
    '>> Virtualisation',
    '>> Web',
    'Strategy',
    '>> Ecommerce',
    '>> Finance',
    '>> Finance and Reporting',
    '>> Government',
    '>> Green',
    '>> Law',
    '>> Legislation and Regulation',
    '>> Management',
    '>>> Budgets and Investment',
    '>>> Careers and Skills',
    '>>> Compliance',
    '>>> Corporate',
    '>>> Product',
    '>>> Supplier',
    '>> Mergers',
    '>> Mergers and Acquisitions',
    '>> Outsourcing',
    '>> Public Sector',
    '>>> Education',
    '>>> Health',
    '>>> Police',
    '>> Services',
    '>> Services and Outsourcing',
    '>> Skills',
    '>> Small Business',
    'uncategorised',
  ];
  const categoriesThree = [
    'Audiovisual',
    'Business Software',
    'Careers and Skills',
    'Chips and Components',
    'Computer Games',
    'Consolidation',
    'Credit and Finance',
    'Desktops',
    'Developer',
    'Displays',
    'Distributor',
    'eCommerce',
    'Enterprise',
    'Finance and M&A',
    'Financial and Reporting',
    'Gadgets',
    'Hardware',
    'Infrastructure',
    'Laptops',
    'Legal',
    'Management',
    'Marketing',
    'Mobile Phones',
    'Mobile Software',
    'Mobility',
    'Multimedia',
    'Networks',
    'Open Source',
    'Operating Systems',
    'Partnership',
    'People',
    'Peripherals',
    'Printers',
    'Private Sector',
    'Public Sector',
    'Research',
    'Reseller',
    'Review',
    'Security',
    'Server',
    'Services and Outsourcing',
    'SME',
    'Software',
    'Software Licensing and Piracy',
    'Special Reports',
    'Sponsored',
    'Storage',
    'Tablets',
    'Technology and Trends',
    'Telecoms',
    'Training',
    'uncategorised',
    'Utilities',
    'Vendor',
    'Voice and Data',
    'Web',
    'Wireless Networking',
  ];
  const categoriesFour = [
    'Audiovisual',
    'Audiovisuell',
    'Ausbildung',
    'Berufe und Fähigkeiten',
    'Betriebssysteme',
    'Bewertung',
    'Business Software',
    'Careers and Skills',
    'Chips and Components',
    'Chips und Komponenten',
    'Computerspiele',
    'Consolidation',
    'Credit and Finance',
    'Desktops',
    'Dienstleistungen und Outsourcing',
    'Displays',
    'Distribution',
    'Drahtlose Vernetzung',
    'Drucker',
    'eCommerce',
    'E-Commerce',
    'Enterprise',
    'Entwickler',
    'Finance and M&A',
    'Financial and Reporting',
    'Forschung',
    'Frauen im Channel',
    'Gadgets',
    'Geschäftsberichte',
    'Gesetzlich',
    'Gesponsert',
    'Hardware',
    'Hersteller',
    'Hilfsmittel',
    'Infrastructure',
    'Infrastruktur',
    'KMU',
    'Konsolidierung',
    'Kredit und Finanzen',
    'Laptops',
    'Legal',
    'M&A',
    'Management',
    'Marketing',
    'Menschen',
    'Mobile Phones',
    'Mobile Software',
    'Mobilität',
    'Mobility',
    'Mobiltelefone',
    'Multimedia',
    'Networks',
    'Netz',
    'Netzwerke',
    'nicht kategorisiert',
    'Öffentlicher Sektor',
    'Open Source',
    'Partnerschaft',
    'Partnership',
    'Peripherals',
    'Peripheriegeräte',
    'Personalien',
    'Printers',
    'Privater Sektor',
    'Public Sector',
    'Research',
    'Reseller',
    'Security',
    'Server',
    'Services and Outsourcing',
    'Sicherheit',
    'SME',
    'Software',
    'Softwarelizenzierung und Piraterie',
    'Sonderberichte',
    'Speicher',
    'Sprache und Daten',
    'Storage',
    'Tablets',
    'Technologien & Trends',
    'Technology and Trends',
    'Telecoms',
    'Telekommunikation',
    'Training',
    'Unternehmen',
    'Verteiler',
    'Voice and Data',
    'Web',
    'Wiederverkäufer',
    'Wireless Networking',
  ];
  const categoriesFive = [
    'Artificial Intelligence',
    'Big Data and Analytics',
    'Certifications',
    'Cloud Computing',
    'Column',
    'Data Center',
    'Hardware',
    '>> Chips and Components',
    'Marketing',
    'MES Research',
    'Search',
    'Security',
    '>> Hacking',
    '>> Threats and Risks',
    'Software',
    'Transformation',
  ];
  const categoriesSix = ['Artificial Intelligence', 'Big Data and Analytics'];
  let types;
  let categories;
  switch (getTheTheme()) {
    case 'mescomputing-com':
      types = typesOne;
      categories = categoriesOne;
      break;
    case 'computing-co-uk':
      types = typesTwo;
      categories = categoriesTwo;
      break;
    case 'channelweb-co-uk':
      types = typesThree;
      categories = categoriesThree;
      break;
    case 'crn-de':
      types = typesFour;
      categories = categoriesFour;
      break;
    case 'crn-asia':
      types = typesFive;
      categories = categoriesFive;
      break;
    case 'crn-australia':
      types = typesSix;
      categories = categoriesSix;
      break;
    default:
      types = [];
      categories = [];
  }
  let finalOptions = ``;
  const items = dropdowns === 'type' ? types : categories;
  items.forEach((item) => {
    finalOptions = `${finalOptions}<option value="${item.replace(/ /g, '-').replace(/>>-/g, '').toLowerCase()}">${item}</option>\n`;
  });
  return finalOptions;
}

function toggleRefineSearch(refineSearchOptions) {
  refineSearchOptions.classList.toggle('close');

  // Save the state of the refined search menu to persist after searching
  const isRefinedSearchOpen = !refineSearchOptions.classList.contains('close');
  localStorage.setItem('refineSearchOpen', isRefinedSearchOpen);
}

function createSearchInput() {
  const isRefinedSearchOpen = localStorage.getItem('refineSearchOpen') === 'true';
  return render(`
    <div class="dropdown-search">
      <div class="dropdown-search-container">
        <form class='dropdown-searchform' action="/search">
          <div class="input-group">
            <input class="dropdown-searchbox" name="query" type="search" placeholder="Search here...">
            <button type="submit" class="button search-button">
                ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Suche` : `Search`}
                <span class="dropdown-serach-icon">
                    <img src="/icons/search.svg" alt="Search icon"/>
                </span>
            </button>
          </div>
          <div class="filter-options">
            <div class="refine-search-toggle">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Suche einschränken` : `Refine search`}</div>
            <div class="sortbydate">
               ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Sortiere nach:` : `Sort by:`}
               <span class="sortby-option sortby-date">
                ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Datum` : `Date`}
               </span> / <span class="sortby-option sortby-relevance">${getTheTheme() === 'crn-de' ? `Relevanz` : `Relevance`}</span>
             </div>
          </div>
           <div class="refine-search-options ${isRefinedSearchOpen ? '' : 'close'}">
             <div class="form-group">
               <label for="timePeriod">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Zeitraum` : `Time period`}</label>
               <select class="form-control" id="timePeriod" name="date">
                  <option value="this_year">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Letzte 12 Monate` : `Last 12 months`}</option>
                  <option value="today">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Heute` : `Today`}</option>
                  <option value="yesterday">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Gestern` : `Yesterday`}</option>
                  <option value="this_week">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `In Diese Woche` : `This Week`}</option>
                  <option value="this_month">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Diesen Monat` : `This Month`}</option>
                  <option value="year_2023">2023</option>
                  <option value="year_2022">2022</option>
                  <option value="year_2021">2021</option>
                  <option value="year_2020">2020</option>
                  <option value="year_2019">2019</option>
                  <option value="year_2018">2018</option>
                  <option value="year_2017">2017</option>
                  <option value="year_2016">2016</option>
                  <option value="year_2015">2015</option>
                  <option value="year_2014">2014</option>
                  <option value="year_2013">2013</option>
                  <option value="year_2012">2012</option>
                  <option value="all">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Alle` : `All`}</option>
               </select>
             </div>
             <div class="form-group">
              <label for="type">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Art` : `Type`}</label>
              <select name="type" id="type" class="form-control">
                <option value="">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Alle Artikelarten` : `All article types`}</option>
                ${createOptionsForDropdowns('type')}
              </select>
            </div>
            <div class="form-group">
              <label for="full_category">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Kategorie` : `Category`}</label>
              <select name="full_category" id="full_category" class="form-control">
                <option value="">${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Alle Artikelkategorien` : `All article categories`}</option>
                ${createOptionsForDropdowns('category')}
              </select>
            </div>
           </div>
           <input name="per_page" type="hidden" value="24"">
           <input name="sort" type="hidden" value="${getSortParam()}"">
        </form>
    </div>
  `);
}

function createNotFoundSection() {
  return render(`
    <div class="notfoundhead">
        <h4>${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Oh nein!` : `Oh no!`}</h4>
        <p>${
          getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de'
            ? `Es sieht so aus, als hätten wir keine Ergebnisse für Ihre Anfrage gefunden.`
            : `It looks like we couldn't find any results for your query`
        }</p>
        <div class="notfoundicon"></div>
    </div>
  `);
}

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    if (!element || !element.textContent) return;
    const matches = [];
    const { textContent } = element;
    terms.forEach((term) => {
      let start = 0;
      let offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      while (offset >= 0) {
        matches.push({ offset, term: textContent.substring(offset, offset + term.length) });
        start = offset + term.length;
        offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      }
    });

    if (!matches.length) {
      return;
    }

    matches.sort((a, b) => a.offset - b.offset);
    let currentIndex = 0;
    const fragment = matches.reduce((acc, { offset, term }) => {
      if (offset < currentIndex) return acc;
      const textBefore = textContent.substring(currentIndex, offset);
      if (textBefore) {
        acc.appendChild(document.createTextNode(textBefore));
      }
      const markedTerm = document.createElement('span');
      markedTerm.className = 'highlight';
      markedTerm.textContent = term;
      acc.appendChild(markedTerm);
      currentIndex = offset + term.length;
      return acc;
    }, document.createDocumentFragment());
    const textAfter = textContent.substring(currentIndex);
    if (textAfter) {
      fragment.appendChild(document.createTextNode(textAfter));
    }
    element.innerHTML = '';
    element.appendChild(fragment);
  });
}

/**
 * Creates an image element for the article
 * @param {string} imageUrl The URL of the article image
 * @returns {HTMLElement} The image element
 */
function createListingImage(imageUrl) {
  const articleImage = document.createElement('img');
  articleImage.className = 'article-image';
  articleImage.src = imageUrl;
  articleImage.alt = 'Article image';
  if (!imageUrl) {
    articleImage.src = `./media_1049582376ac272537788544d19e43a8238104bb9.png?width=750&format=png&optimize=medium`;
  }
  // Todo: update after Go Live/CDN switch
  return articleImage;
}

/**
 * Creates a title element for the article with a corresponding link
 * @param {string} title The title of the article
 * @returns {HTMLElement} The title element with a link
 */
function createListingTitle(article, terms) {
  const listingTitle = document.createElement('div');
  const isLock = shouldBeGated(article.publisheddate);
  listingTitle.className = `listing-title ${isLock ? 'lock' : ''}`;
  // create an anchor tag for the title
  const listingLink = document.createElement('a');
  listingLink.href = article.path;
  // Todo: update after Go Live/CDN switch
  listingLink.textContent = article.title;
  listingLink.target = '_blank';
  highlightTextElements(terms, [listingLink]);
  listingTitle.appendChild(listingLink);
  return listingTitle;
}

/**
 * Creates a description element for the article
 * @param {string} description The title of the article
 * @returns {HTMLElement} The description element
 */
function createListingDescription(description, terms) {
  const listingDescription = document.createElement('div');
  listingDescription.className = 'listing-description';
  listingDescription.innerText = description;
  highlightTextElements(terms, [listingDescription]);
  return listingDescription;
}

/**
 * Creates a published date element for the article
 * @param {string} date The UNIX timestamp of the article's published date
 * @returns {HTMLElement} The published date element
 */
function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'article-date';
  publishedDate.innerHTML = `
      <img class="article-clock" src="/icons/clock.svg" alt="Clock icon"/>
    ${formatingDate(date)}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

/**
 * Creates a category element for the article
 * @param {string} category The category of the article
 * @returns {HTMLElement} The title element with a link
 */
function createListingCategory(article) {
  const articleCategory = document.createElement('div');
  articleCategory.className = 'listing-category';
  const firstCategory = extractElementsFromString(article.category)[0];
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${createCategorySlug(firstCategory)}`;
  articleCategoryLink.textContent = firstCategory;
  articleCategory.appendChild(articleCategoryLink);
  return articleCategory;
}

function generateArticle(article, wrapper, terms) {
  const listingArticle = document.createElement('div');
  listingArticle.className = 'listing-article';
  const listingLeft = document.createElement('div');
  listingLeft.className = 'listing-article-left';
  const listingRight = document.createElement('div');
  listingRight.className = 'listing-article-right';
  if (article.image !== '0' && article.image !== '') {
    listingLeft.appendChild(createListingImage(article.image));
  }
  listingRight.appendChild(createListingCategory(article));
  listingRight.appendChild(createListingTitle(article, terms));
  listingRight.appendChild(createListingDescription(article.description, terms));
  listingRight.appendChild(createPublishedDate(article.publisheddate, article.wordcount));
  listingArticle.appendChild(listingLeft);
  listingArticle.appendChild(listingRight);
  wrapper.append(listingArticle);
}

async function fetchData(source) {
  const response = await fetch(source);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading API response', response);
    return null;
  }

  const json = await response.json();
  if (!json) {
    // eslint-disable-next-line no-console
    console.error('empty API response', source);
    return null;
  }

  return json.data;
}

function compareFound(hit1, hit2) {
  return hit1.minIdx - hit2.minIdx;
}

function filterData(searchTerms, data) {
  const foundInHeader = [];
  const foundInMeta = [];

  data.forEach((result) => {
    let minIdx = -1;
    let isMoreThanOneCharacters = false;
    searchTerms.forEach((term) => {
      const idx = (result.description || result.title).toLowerCase().indexOf(term);
      if (term.length > 1) {
        isMoreThanOneCharacters = true;
      }
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (isMoreThanOneCharacters) {
      if (minIdx >= 0) {
        foundInHeader.push({ minIdx, result });
        return;
      }

      const metaContents = `${result.title} ${result.description} ${result.path.split('/').pop()}`.toLowerCase();
      searchTerms.forEach((term) => {
        const idx = metaContents.indexOf(term);
        if (idx < 0) return;
        if (minIdx < idx) minIdx = idx;
      });

      if (minIdx >= 0) {
        foundInMeta.push({ minIdx, result });
      }
    }
  });
  return [...foundInHeader.sort(compareFound), ...foundInMeta.sort(compareFound)].map((item) => item.result);
}

function addSearchPlaceholder(block, searchTerm) {
  const searchInput = block.querySelector('.dropdown-searchbox');
  searchInput.setAttribute('value', searchTerm);
}

function isDateInThisWeek(date) {
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

function categoryFormat(category) {
  return createCategorySlug(category);
}

function typeFormat(type) {
  return type.toLowerCase().replace(' ', '-');
}

function createSearchPagination(articles, pageNumber, block) {
  const totalNumberOfPages = Math.ceil(articles.length / 24);
  if (totalNumberOfPages > 1) {
    block.append(createPagination(totalNumberOfPages));
  }
  pagination(pageNumber, block, articles, 24);
}

function generateArticleAfterSort(article, listingArticlesWrapper, searchTerms) {
  generateArticle(article, listingArticlesWrapper, searchTerms);
}

function changeDisplayingTitle(block, articles, searchTerm) {
  const displayingTitle = block.querySelector('.search-results .display-result');
  const numberOfArticles = articles.length;

  const pageNumber = getPageParam() === '' ? '1' : getPageParam();

  let numberOfDisplayingArticles;
  if ((numberOfArticles >= 24 && pageNumber * 24 >= numberOfArticles) || numberOfArticles <= 24) {
    numberOfDisplayingArticles = numberOfArticles;
  } else if (numberOfArticles >= 24) {
    numberOfDisplayingArticles = pageNumber * 24;
  }

  const start = (pageNumber - 1) * 24 + 1;
  displayingTitle.textContent =
    getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de'
      ? `Anzeigen ${start}-${numberOfDisplayingArticles} of ${numberOfArticles} Ergebnisse für "${searchTerm}"`
      : `Displaying ${start}-${numberOfDisplayingArticles} of ${numberOfArticles} results for "${searchTerm}" `;
}

function filteredByThisYear(
  articles,
  typeParam,
  catagoryParam,
  thisYear,
  listingArticlesWrapper,
  searchTerms,
  pageNumber,
  block
) {
  const articlesSortByYear = [];

  articles.forEach((article) => {
    const publishDate = new Date(article.publisheddate).getTime();
    const isInThisYear = publishDate >= thisYear;
    if (
      isInThisYear &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByYear.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByYear, pageNumber, 23)
      : getArticlesByPage(articlesSortByYear, pageNumber, 24);
  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByYear, getSearchTerm());
  createSearchPagination(articlesSortByYear, pageNumber, block);
}

function filteredByToday(
  articles,
  typeParam,
  catagoryParam,
  year,
  listingArticlesWrapper,
  searchTerms,
  thisMonth,
  thisDay,
  pageNumber,
  block
) {
  const articlesSortByToday = [];

  articles.forEach((article) => {
    const publishDate = new Date(article.publisheddate);
    const isToday =
      thisMonth === publishDate.getMonth() && thisDay === publishDate.getDate() && year === publishDate.getFullYear();
    if (
      isToday &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByToday.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByToday, pageNumber, 23)
      : getArticlesByPage(articlesSortByToday, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByToday, getSearchTerm());
  createSearchPagination(articlesSortByToday, pageNumber, block);
}

function filteredByYesterday(
  articles,
  typeParam,
  catagoryParam,
  listingArticlesWrapper,
  searchTerms,
  yesterday,
  pageNumber,
  block
) {
  const articlesSortByYesterday = [];

  articles.forEach((article) => {
    const publishDate = new Date(article.publisheddate);
    const isYesterday =
      yesterday.getMonth() === publishDate.getMonth() &&
      yesterday.getDate() === publishDate.getDate() &&
      yesterday.getFullYear() === publishDate.getFullYear();
    if (
      isYesterday &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByYesterday.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByYesterday, pageNumber, 23)
      : getArticlesByPage(articlesSortByYesterday, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByYesterday, getSearchTerm());
  createSearchPagination(articlesSortByYesterday, pageNumber, block);
}

function filteredByThisMonth(
  articles,
  typeParam,
  catagoryParam,
  listingArticlesWrapper,
  searchTerms,
  year,
  thisMonth,
  pageNumber,
  block
) {
  const articlesSortByMonth = [];

  articles.forEach((article) => {
    const publishDate = new Date(article.publisheddate);
    const sameMonth = year === publishDate.getFullYear() && thisMonth === publishDate.getMonth();
    if (
      sameMonth &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByMonth.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByMonth, pageNumber, 23)
      : getArticlesByPage(articlesSortByMonth, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByMonth, getSearchTerm());
  createSearchPagination(articlesSortByMonth, pageNumber, block);
}

function filteredByThisWeek(
  articles,
  typeParam,
  catagoryParam,
  listingArticlesWrapper,
  searchTerms,
  pageNumber,
  block
) {
  const articlesSortByThisWeek = [];

  articles.forEach((article) => {
    const publishDate = new Date(article.publisheddate);
    const dateInThisWeek = isDateInThisWeek(publishDate);
    if (
      dateInThisWeek &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByThisWeek.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByThisWeek, pageNumber, 23)
      : getArticlesByPage(articlesSortByThisWeek, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByThisWeek, getSearchTerm());
  createSearchPagination(articlesSortByThisWeek, pageNumber, block);
}

function filteredByYear(
  articles,
  typeParam,
  dateParam,
  catagoryParam,
  listingArticlesWrapper,
  searchTerms,
  pageNumber,
  block
) {
  const articlesSortByYear = [];

  articles.forEach((article) => {
    const publishDateYear = new Date(article.publisheddate).getFullYear().toString();
    const yearParam = dateParam.replace('year_', '');
    const sameYear = publishDateYear === yearParam;
    if (
      sameYear &&
      (catagoryParam === categoryFormat(article.category) || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByYear.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByYear, pageNumber, 23)
      : getArticlesByPage(articlesSortByYear, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticleAfterSort(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByYear, getSearchTerm());
  createSearchPagination(articlesSortByYear, pageNumber, block);
}

function filteredByAll(articles, typeParam, catagoryParam, listingArticlesWrapper, searchTerms, pageNumber, block) {
  const articlesSortByAll = [];

  articles.forEach((article) => {
    const category = categoryFormat(article.category);
    if (
      (catagoryParam === category || catagoryParam === '') &&
      (typeParam === typeFormat(article.type) || typeParam === '')
    ) {
      articlesSortByAll.push(article);
    }
  });

  const articlesByPage =
    pageNumber === 1
      ? getArticlesByPage(articlesSortByAll, pageNumber, 23)
      : getArticlesByPage(articlesSortByAll, pageNumber, 24);

  articlesByPage.forEach((article) => {
    generateArticle(article, listingArticlesWrapper, searchTerms);
  });

  changeDisplayingTitle(block, articlesSortByAll, getSearchTerm());
  createSearchPagination(articlesSortByAll, pageNumber, block);
}

function filteredByParam(
  articles,
  typeParam,
  dateParam,
  catagoryParam,
  listingArticlesWrapper,
  searchTerms,
  pageNumber,
  block
) {
  const todayDate = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const thisDay = todayDate.getDate();
  const thisMonth = todayDate.getMonth();
  const year = todayDate.getFullYear();
  const thisYear = new Date(todayDate.setMonth(todayDate.getMonth() - 12)).getTime();

  switch (dateParam) {
    case 'this_year':
      filteredByThisYear(
        articles,
        typeParam,
        catagoryParam,
        thisYear,
        listingArticlesWrapper,
        searchTerms,
        pageNumber,
        block
      );
      break;
    case 'today':
      filteredByToday(
        articles,
        typeParam,
        catagoryParam,
        year,
        listingArticlesWrapper,
        searchTerms,
        thisMonth,
        thisDay,
        pageNumber,
        block
      );
      break;
    case 'yesterday':
      filteredByYesterday(
        articles,
        typeParam,
        catagoryParam,
        listingArticlesWrapper,
        searchTerms,
        yesterday,
        pageNumber,
        block
      );
      break;
    case 'this_week':
      filteredByThisWeek(articles, typeParam, catagoryParam, listingArticlesWrapper, searchTerms, pageNumber, block);
      break;
    case 'this_month':
      filteredByThisMonth(
        articles,
        typeParam,
        catagoryParam,
        listingArticlesWrapper,
        searchTerms,
        year,
        thisMonth,
        pageNumber,
        block
      );
      break;
    case 'all':
      filteredByAll(articles, typeParam, catagoryParam, listingArticlesWrapper, searchTerms, pageNumber, block);
      break;
    default:
      filteredByYear(
        articles,
        typeParam,
        dateParam,
        catagoryParam,
        listingArticlesWrapper,
        searchTerms,
        pageNumber,
        block
      );
  }
}

function setOptionTimePeriod(block, dateParam) {
  const timePeriodOptions = block.querySelectorAll('.dropdown-search .refine-search-options #timePeriod option');
  timePeriodOptions.forEach((option) => {
    if (option.value === dateParam) {
      option.setAttribute('selected', true);
    }
  });
}

function setOptionCategory(block, categoryParam) {
  const categoryOptions = block.querySelectorAll('.dropdown-search .refine-search-options #full_category option');
  categoryOptions.forEach((option) => {
    if (option.value === categoryParam) {
      option.setAttribute('selected', true);
    }
  });
}

function setOptionType(block, typeParam) {
  const typeOptions = block.querySelectorAll('.dropdown-search .refine-search-options #type option');
  typeOptions.forEach((option) => {
    if (option.value === typeParam) {
      option.setAttribute('selected', true);
    }
  });
}

export default async function decorate(block) {
  const searchTerm = getSearchTerm();
  const sortParam = getSortParam();
  const dateParam = getDateParam();
  const categoryParam = getFullCategoryParam();
  const typeParam = getTypeParam();

  const searchTitle = document.createElement('h1');
  const listingArticlesWrapper = document.createElement('div');
  listingArticlesWrapper.className = 'listing-article-wrapper';
  searchTitle.innerText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Suchergebnisse' : 'Search results';
  block.append(searchTitle);
  block.append(createSearchInput(block));
  addSearchPlaceholder(block, searchTerm);
  const refineSearch = block.querySelector('.refine-search-toggle');
  const refineSearchOptions = block.querySelector('.refine-search-options');
  const sortByDate = block.querySelector('.sortby-date');
  const sortByRelevance = block.querySelector('.sortby-relevance');

  const source = block.querySelector('a[href]') ? block.querySelector('a[href]').href : '/article-query-index.json';

  createTitile(searchTerm, block);

  const preposition = [
    'to',
    'in',
    'into',
    'on',
    'at',
    'the',
    'of',
    'for',
    'from',
    'until',
    'by',
    'with',
    'as',
    'than',
    'is',
  ];

  const searchTerms = searchTerm
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => !preposition.includes(term));

  let pageNumber = getPageParam();

  if (pageNumber === '') {
    pageNumber = '1';
  }

  const data = await fetchData(source);

  const filteredData = filterData(searchTerms, data);
  let articlesList = [];

  let itemToFind;
  let foundIdx;

  filteredData.forEach((item) => {
    const prelucrateTitle = item.title
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => !preposition.includes(term));

    if (item.title === searchTerm) {
      articlesList.push(item);
    } else if (
      item.title.includes(searchTerm) ||
      (searchTerms[0] === prelucrateTitle[0] && searchTerms[1] === prelucrateTitle[1])
    ) {
      itemToFind = item;
      foundIdx = filteredData.findIndex((el) => el.title === itemToFind.title);
    }
  });

  if (itemToFind && foundIdx) {
    filteredData.splice(foundIdx, 1);
    filteredData.unshift(itemToFind);
  }

  if (articlesList.length === 0) {
    articlesList = filteredData;
  }
  block.append(listingArticlesWrapper);

  if (sortParam === 'recent') {
    sortArticlesByPublishDate(articlesList);
  }

  filteredByParam(
    articlesList,
    typeParam,
    dateParam,
    categoryParam,
    listingArticlesWrapper,
    searchTerms,
    pageNumber,
    block
  );

  refineSearch.addEventListener('click', () => {
    toggleRefineSearch(refineSearchOptions);
  });

  sortByDate.addEventListener('click', () => {
    setSortParam('recent');
  });

  sortByRelevance.addEventListener('click', () => {
    setSortParam('relevance1');
  });

  // set value for option depend on date param
  setOptionTimePeriod(block, dateParam);

  // set value for option depend on date param
  setOptionCategory(block, categoryParam);

  // set value for option depend on date param
  setOptionType(block, typeParam);

  // display not found
  const notFound = block.querySelector('.search-results .not-found');
  const displayResult = block.querySelector('.search-results .display-result');
  const articles = block.querySelectorAll('.search-results  .listing-article');
  if (articles.length === 0) {
    notFound.style.display = 'block';
    displayResult.style.display = 'none';
    block.append(createNotFoundSection());
  }
}
