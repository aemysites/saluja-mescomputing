const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * get the page number from url page param
 */
function getThePageNumber() {
  const params = new URLSearchParams(window.location.search);
  let pageNumber = 1;
  if (params.size > 0) {
    pageNumber = String(params.get('page') || '').trim() === '' ? 1 : String(params.get('page') || '').trim();
  }

  return pageNumber;
}

/**
 * get the artilces specific for every the page
 */
// eslint-disable-next-line import/prefer-default-export
export function getArticlesByPage(articles, pageNumber, size) {
  const pageSize = size;
  const start = (pageNumber - 1) * pageSize;
  const endCount = start + pageSize;
  return articles.slice(start, endCount);
}

/**
 * create pagination html
 */
export function createPagination(totalNumberOfPages) {
  let paginationNumbers = '';
  const getPageNumber = Number(getThePageNumber());

  for (let pageNumber = 1; pageNumber <= totalNumberOfPages; pageNumber += 1) {
    if (getPageNumber === pageNumber) {
      paginationNumbers = `${paginationNumbers}<button id='page-${pageNumber}' class='current-page page-number'>${pageNumber}</button>`;
    } else {
      paginationNumbers = `${paginationNumbers}<button id='page-${pageNumber}' class='page-number' onClick="">${pageNumber}</button>`;
    }
  }

  return render(`
    <div class="listing-page-pagination">
      <div class="search-page-number">
        <button class="prev-page page-navigation"></button>
        ${paginationNumbers}
        <button rel="next-page" class="next-page page-navigation"></button>
      </div>
    </div>
  `);
}

function changePath(futurePageNumber, currentPage) {
  let path;
  if (window.location.search) {
    if (window.location.search.includes('&page=')) {
      path = `${window.location.pathname}${window.location.search.replace(`&page=${currentPage}`, `&page=${futurePageNumber}`)}`;
    } else if (window.location.search.includes('?page=')) {
      path = `${window.location.pathname}${window.location.search.replace(`?page=${currentPage}`, `?page=${futurePageNumber}`)}`;
    } else {
      path = `${window.location.pathname}${window.location.search}&page=${futurePageNumber}`;
    }
  } else {
    path = `${window.location.pathname}?page=${futurePageNumber}`;
  }
  return path;
}
/**
 * go to the prev page
 */
function prevPage() {
  const currentPage = Number(getThePageNumber());
  const futurePageNumber = currentPage - 1;
  window.location.href = changePath(futurePageNumber, currentPage);
}

/**
 * go to the next page
 */
function nextPage() {
  const currentPage = Number(getThePageNumber());
  const futurePageNumber = currentPage + 1;
  window.location.href = changePath(futurePageNumber, currentPage);
}

/**
 * add click event for next and prev button
 * add styling for page number and for prev and next button depending on the action that we make
 */
export function pagination(pageNumber, block, articles, articlesPerPage) {
  const prev = block.querySelector('.prev-page');
  const next = block.querySelector('.next-page');
  const paginationNumbers = block.querySelectorAll('.page-number');
  const totalNumberOfPages = Math.ceil(articles.length / articlesPerPage);
  const currentPage = Number(getThePageNumber());

  if (prev && next) {
    if (Number(pageNumber) === 1) {
      prev.style.display = 'none';
    } else {
      prev.style.display = 'inline-block';
    }

    if (Number(pageNumber) === totalNumberOfPages && next) {
      next.style.display = 'none';
    } else {
      next.style.display = 'inline-block';
    }

    prev.addEventListener('click', () => prevPage());
    next.addEventListener('click', () => nextPage());
    paginationNumbers.forEach((number) => {
      const pageNo = Number(number.innerText);
      number.addEventListener('click', () => {
        window.location.href = changePath(pageNo, currentPage);
      });

      if (
        (currentPage === 1 && pageNo === 2) ||
        (currentPage === 1 && pageNo === 3) ||
        currentPage === pageNo ||
        currentPage + 1 === pageNo ||
        currentPage - 1 === pageNo ||
        (currentPage === totalNumberOfPages && currentPage - 1 === pageNo) ||
        (currentPage === totalNumberOfPages && currentPage - 2 === pageNo)
      ) {
        number.style.display = 'inline-block';
      } else {
        number.style.display = 'none';
      }
    });
  }
}
