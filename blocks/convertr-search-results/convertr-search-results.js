import { render } from '../../scripts/shared.js';

function createConvertrForm(searchParam) {
  return render(`
      <form class="convertr-search-form" action="/resources-search-results" method="get">
        Not found what you are looking for? Try another search...
        <div class="form-input">
          <input name="wpSearch" type="text" value="${searchParam}">
          <button class="btn-primary" type="submit">Submit</button>
        </div>
      </form>
    `);
}
export default function decorate(block) {
  const convertrLink = block.querySelector('a');
  const linkHref = convertrLink.getAttribute('href');

  const script = document.createElement('script');
  script.setAttribute('src', `${linkHref}`);
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('id', 'cvtrSearchScript');
  block.append(script);
  convertrLink.parentElement.parentElement.remove();

  const params = new URLSearchParams(window.location.search);
  const searchParam = String(params.get('wpSearch') || '').trim();

  const title = document.createElement('h1');
  title.classList = 'title';
  title.textContent = 'Resources search results';

  const div = document.createElement('div');

  div.setAttribute('id', 'cvtrSearchContent');
  div.append(title);
  block.append(div);
  block.append(createConvertrForm(searchParam));

  setTimeout(() => {
    const cvtrSearch = document.querySelector('#cvtrSearchContent');
    const links = cvtrSearch.querySelectorAll('a');

    links.forEach((link) => {
      link.href = link.href.replace('/static', '');
    });
  }, 5000);
}
