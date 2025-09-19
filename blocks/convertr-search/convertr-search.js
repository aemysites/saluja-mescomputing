import { render } from '../../scripts/shared.js';

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 */
function createConvertrForm() {
  return render(`
      <form class="convertr-search-form" action="/resources-search-results" method="get">
        <h2>Search for resources, case studies, analyst reports and thought leadership</h2>
        <input name="wpSearch" type="text">
        <button class="btn-primary" type="submit">Submit</button>
      </form>
    `);
}

export default function decorate(block) {
  block.append(createConvertrForm(block));
}
