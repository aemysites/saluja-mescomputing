import ffetch from '../../scripts/ffetch.js';
// eslint-disable-next-line import/named
import { allAuthors, getGermanBtnText } from '../../scripts/shared.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

function generateElement(tag, className) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function createPagination() {
  const cards = Array.from(document.querySelectorAll('.article-list-card'));
  const numberOfCards = cards.length;
  const cardsPerPage = 20;
  const numberOfPages = Math.ceil(numberOfCards / cardsPerPage);
  let currentActiveButtonIndex = 0;

  // Get the page number from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get('page'), 10) || 1;

  // Display cards for the given page
  function showPage(pageIndex) {
    const start = pageIndex * cardsPerPage;
    const end = Math.min(start + cardsPerPage, numberOfCards);

    cards.forEach((card) => {
      card.classList.add('hidden');
    });

    // Show only the cards for the current page
    for (let i = start; i < end; i += 1) {
      cards[i].classList.remove('hidden');
    }

    // Update active page button on the TOP pagination wrapper
    currentActiveButtonIndex = pageIndex;
    const buttons = document.querySelectorAll('.pagination');
    buttons.forEach((button, index) => {
      if (index === currentActiveButtonIndex) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }

      button.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    });

    // Update active page button on the bottom pagination wrapper
    const buttonsBottom = document.querySelectorAll('.pagination-wrapper')[1].querySelectorAll('.pagination');
    buttonsBottom.forEach((button, index) => {
      if (index === currentActiveButtonIndex) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }

      button.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageIndex + 1);
    window.history.pushState({}, '', url.href);
  }

  // Create pagination buttons
  for (let i = 0; i < numberOfPages; i += 1) {
    const startItem = i * cardsPerPage + 1;
    const endItem = Math.min((i + 1) * cardsPerPage, numberOfCards);

    const createButton = () => {
      const button = document.createElement('button');
      button.classList.add('pagination');
      button.textContent = `${startItem} - ${endItem}`;

      button.addEventListener('click', () => {
        showPage(i);
      });

      return button;
    };

    document.getElementsByClassName('pagination-wrapper')[0].appendChild(createButton());
    document.getElementsByClassName('pagination-wrapper')[1].appendChild(createButton());
  }

  showPage(page - 1);
}

function createCard(data) {
  const card = render(
    `
        <div class="article-list-card">
            <div class="article-list-content">
            ${
              data.authorimage !== ''
                ? `<img alt="${data.author}"
                    src="${data.authorimage}">`
                : ''
            }
                <div class="author-landing-details">
                    <h4>
                        <a href="${data.profile}">${data.author}</a>
                    </h4>
                    <p>${data.authorposition}</p>
                    <h6>${data.organization}</h6>
                </div>
                <button>
                    <a class="btn btn-primary" role="button" aria-pressed="true"
                        href="${data.profile}">${getGermanBtnText()}</a>
                </button>
            </div>
        </div>
    `
  );

  return card;
}

async function fetchList(url, wrapper) {
  try {
    const listGenerator = ffetch(url);
    const list = await allAuthors(listGenerator);

    list.forEach((author) => {
      const card = createCard(author);
      wrapper.appendChild(card);
    });

    createPagination(wrapper, list);
  } catch (error) {
    console.error('Error fetching events', error);
  }
}

export default function decorate(block) {
  const link = block.querySelector('div:first-child');
  const fetchUrl = `${link.innerText}&offset=0&limit=255`;
  link.remove();

  const listGroup = generateElement('div', 'article-listing-group');
  const cardsList = generateElement('div', 'cards-list');
  listGroup.appendChild(generateElement('div', 'pagination-wrapper'));
  listGroup.appendChild(cardsList);
  listGroup.appendChild(generateElement('div', 'pagination-wrapper'));
  block.appendChild(listGroup);
  fetchList(fetchUrl, cardsList);
}
