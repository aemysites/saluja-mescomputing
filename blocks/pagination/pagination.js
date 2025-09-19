export default function decorate(block) {
  const article = document.querySelector('article');
  const pageCount = article.dataset.articleCount;
  const usp = new URLSearchParams(window.location.search);
  const pageIndex = Number(usp.get('page') || 1);
  const page = window.location.href.split('?')[0];
  const startIndex = pageIndex < 3 ? 1 : pageIndex - 2;
  const endIndex = pageIndex + 2 >= pageCount ? pageCount : pageIndex + 2;

  if (pageCount > 1) {
    const nav = document.createElement('nav');
    nav.classList.add('article-pagination');
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    if (pageIndex > 1) {
      const back = document.createElement('li');
      back.classList.add('page-item');
      back.innerHTML = `<a class="page-link previous" href="${page}?page=${pageIndex - 1}"></a>`;
      ul.append(back);
    }

    if (startIndex > 1) {
      const dashedOne = document.createElement('li');
      dashedOne.classList.add('page-item');
      const firstPageLink = document.createElement('a');
      firstPageLink.classList.add('page-link');
      firstPageLink.href = `${page}?page=1`;
      firstPageLink.textContent = 1;
      dashedOne.append(firstPageLink);

      if (startIndex > 2) {
        const dots = document.createElement('span');
        dots.classList.add('dots-start');
        dots.textContent = ' ... ';
        dashedOne.append(dots);
      }

      ul.append(dashedOne);
    }

    for (let i = startIndex; i <= endIndex; i += 1) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (i === pageIndex && i === 1) {
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.classList.add('active-first');
        li.setAttribute('aria-current', 'page');
      } else if (i === pageIndex && i === endIndex) {
        li.innerHTML = `<a class="page-link next" href="#">${i}</a>`;
        li.classList.add('active-last');
        li.setAttribute('aria-current', 'page');
      } else if (i === pageIndex) {
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.classList.add('active');
        li.setAttribute('aria-current', 'page');
      } else {
        li.innerHTML = `<a class="page-link" href="${page}?page=${i}">${i}</a>`;
      }
      ul.append(li);
    }

    if (endIndex < pageCount) {
      const dashedLastLi = document.createElement('li');
      dashedLastLi.classList.add('page-item');
      const dots = document.createElement('span');
      dots.classList.add('dots-end');
      dots.textContent = ' ... ';

      const lastPageLink = document.createElement('a');
      lastPageLink.classList.add('page-link');
      lastPageLink.href = `${page}?page=${pageCount}`;
      lastPageLink.textContent = pageCount;

      if (endIndex !== pageCount - 1) {
        dashedLastLi.append(dots);
      }

      dashedLastLi.append(lastPageLink);

      ul.append(dashedLastLi);
    }

    if (pageIndex < pageCount) {
      const next = document.createElement('li');
      next.classList.add('page-item');
      next.innerHTML = `<a class="page-link next" href="${page}?page=${pageIndex + 1}"></a>`;
      ul.append(next);
    }
    nav.append(ul);
    block.append(nav);
  }
}
