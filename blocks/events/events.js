import { getMetadata } from '../../scripts/aem.js';
import {
  formatDateByDMY,
  formatDateByMDY,
  getTheEventsUrl,
  getTheTheme,
  sortEventsByDate,
} from '../../scripts/shared.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

function eventLocation(city, country) {
  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  if (country) {
    return country;
  }

  return '';
}

function generateFilterForm() {
  const isCRNDE = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ;
  return render(`
<div class="events-filter-wrapper">
  <form id="event-list-form" action="/filter_events" accept-charset="UTF-8" method="post">
    <div class="filter-content ${isCRNDE ? `lang-de` : ``}">
      <div class="filter-left">
        <div class="filter-head">
          <h5>${isCRNDE ? `Ereignisse filtern` : `Filter events`}</h5>
        </div>
        <div class="filter-options">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="Conference" name="filter[]">
            <label class="form-check-label" for="inlineCheckbox1">
              ${isCRNDE ? `Konferenz` : `Conference`}
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="Training" name="filter[]">
            <label class="form-check-label" for="inlineCheckbox2">
              ${isCRNDE ? `Ausbildung` : `Training`}
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="Award" name="filter[]">
            <label class="form-check-label" for="inlineCheckbox3">
              ${isCRNDE ? `Auszeichnungen` : `Awards`}
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox4" value="Website" name="filter[]">
            <label class="form-check-label" for="inlineCheckbox4">
              Online
            </label>
          </div>
        </div>
      </div>
      <div class="filter-right">
        <div class="event-filter-buttons">
          <button type="button" class="btn btn-clear-filter" id="event-list-form-reset">
            ${isCRNDE ? `Filter löschen` : `Clear filters`}
          </button>
          <button type="submit" class="btn btn-submit" id="event-list-form-submit">
            ${isCRNDE ? `Wenden Sie Filter an` : `Apply filters`}
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
  `);
}

function addFilters(container) {
  const checkboxes = generateFilterForm();
  container.appendChild(checkboxes);
}

function generateEventCard(event) {
  const eventCard = render(`
<div class="event-card">
  <div class="event-wrapper" data-type="${event.event_type}">
    <a href="${event.event_url}" target="_blank">
      <h4>${event.name}</h4>
    </a>
    <div class="published">
      <div class="listwith-icon">
        <p>
          <img class="calendar" alt="clock" src="../../icons/calendar.png">
          ${getTheTheme() === 'mescomputing-com' ? formatDateByMDY(event.event_start_date) : formatDateByDMY(event.event_start_date)}
        </p>
        <p>
          <img class="location" alt="clock" src="../../icons/location.png">
          ${eventLocation(event.city, event.country)}
        </p>
      </div>
    </div>
    <p>${event.description}</p>
    <div class="event-bottom">
      <div class="event-image event-left">
        <img alt="event logo" src="${event.image}">
      </div>
      <div class="event-more event-right">
        <a href="${event.event_url}" class="btn btn-primary" role="button" aria-pressed="true" target="_blank">
        ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Mehr Informationen` : `More information`} </a>
      </div>
    </div>
  </div>
</div>
  `);

  const container = document.querySelector('.events-wrapper');
  container.appendChild(eventCard);
}

function filterCards(checkboxes) {
  const filters = [];
  const eventsCards = document.querySelectorAll('.event-wrapper');

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      filters.push(checkbox.value.toLowerCase());
    }
  });

  eventsCards.forEach((card) => {
    const cardTypes = card.dataset.type.toLowerCase().split(',');
    if (filters.length > 0) {
      if (cardTypes.some((type) => filters.includes(type.replace(' ', '')))) {
        card.parentElement.classList.remove('hidden');
      } else {
        card.parentElement.classList.add('hidden');
      }
    } else {
      card.parentElement.classList.remove('hidden');
    }
  });
}

async function fetchEvents(url, wrapper) {
  try {
    const request = fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const events =
      getTheTheme() === 'mescomputing-com' ? await (await request).json() : (await (await request).json())?.events;
    sortEventsByDate(events);

    const today = new Date().toISOString().split('T')[0];

    const displayEvents = [];

    events.forEach((event) => {
      if (today < event.event_start_date) {
        displayEvents.push(event);
      }
    });

    sortEventsByDate(displayEvents);

    displayEvents.forEach((item) => {
      generateEventCard(item, wrapper);
    });
  } catch (error) {
    console.error('Error fetching events', error);
  }
}

export default function decorate(block) {
  const paragraphs = block.querySelectorAll('p');
  if (paragraphs) {
    paragraphs.forEach((p) => {
      const anchor = p.querySelectorAll('a');
      anchor.forEach((a) => a.removeAttribute('class'));
      p.removeAttribute('class');
    });
  }

  const filtersPlaceholder = document.getElementById('filters-placeholder');
  const filtersWrapper = filtersPlaceholder.parentElement;
  filtersWrapper.classList.add('events-filter');
  addFilters(filtersWrapper);
  filtersPlaceholder.remove();

  block.appendChild(filtersWrapper);

  const form = document.getElementById('event-list-form');
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const resetButton = document.getElementById('event-list-form-reset');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    filterCards(checkboxes);
  });

  resetButton.addEventListener('click', () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    const eventsCards = document.querySelectorAll('.event-wrapper');
    eventsCards.forEach((card) => {
      card.parentElement.classList.remove('hidden');
    });
  });

  if (getMetadata('filters').toLowerCase() === 'off') {
    block.querySelector('.events-filter').style.display = 'none';
  }

  fetchEvents(getTheEventsUrl(), filtersWrapper);
}
