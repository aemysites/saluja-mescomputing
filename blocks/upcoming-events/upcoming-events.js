/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { formatDateByDMbyName, getTheEventsUrl, getTheTheme, sortEventsByDate } from '../../scripts/shared.js';

/**
 * Creates a date element for the event with a corresponding link
 * @param {string} date The date of the event
 * @returns {HTMLElement} The date element with a link
 */
function createEventDate(events) {
  const eventDate = document.createElement('div');
  eventDate.className = 'upcoming-events-date';
  eventDate.textContent = formatDateByDMbyName(events.event_start_date).replace('.', ' ');
  return eventDate;
}

/**
 * Creates a location element for the event with a corresponding link
 * @param {string} location The location of the event
 * @returns {HTMLElement} The location element with a link
 */
function createEventLocation(events) {
  const eventLocation = document.createElement('div');
  eventLocation.className = 'upcoming-events-location';
  eventLocation.textContent = events.country;
  return eventLocation;
}

/**
 * Creates a type element for the event with a corresponding link
 * @param {string} type The type of the event
 * @returns {HTMLElement} The type element with a link
 */
function createEventType(events) {
  const eventType = document.createElement('div');
  eventType.className = 'upcoming-events-type';
  eventType.textContent = events.event_type;
  return eventType;
}

/**
 * Creates a info element for the event with a corresponding link
 * @param {string} title The info of the event
 * @returns {HTMLElement} The info element with a link
 */
function createEventTitle(events) {
  const eventsTitle = document.createElement('div');
  eventsTitle.className = 'upcoming-events-title';
  // create an anchor tag for the info
  const eventsLink = document.createElement('a');
  eventsLink.href = events.event_url;
  eventsLink.setAttribute('aria-label', `Attend: ${events.name}`);
  eventsLink.textContent = events.name;
  eventsTitle.appendChild(eventsLink);
  return eventsTitle;
}

/**
 * Creates a info element for the event with a corresponding link
 * @param {string} info The info of the event
 * @returns {HTMLElement} The info element with a link
 */
function createEventInfo(events) {
  const eventsSidebar = document.querySelector('.upcoming-events.sidebar.block');
  let titleName;
  if (eventsSidebar && (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de')) {
    titleName = 'Jetzt registrieren';
  } else if (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
    titleName = 'Mehr Informationen';
  } else {
    titleName = 'More information';
  }
  const eventInfo = document.createElement('div');
  eventInfo.className = 'upcoming-events-info';
  // create an anchor tag for the info
  const eventLink = document.createElement('a');
  eventLink.href = events.event_url;
  // Todo: update after Go Live/CDN switch
  eventLink.textContent = titleName;
  eventLink.setAttribute('aria-label', `More Information on: ${events.name}`);
  eventLink.target = '_blank';
  eventInfo.appendChild(eventLink);
  function handleClick() {
    window.open(events.event_url, '_blank');
  }
  eventInfo.addEventListener('click', handleClick);
  return eventInfo;
}

/**
 * Generates an event card with the event's date, location, event type, title and more info link
 * @param {Object} events The event object
 */

function generateCard(events, wrapper) {
  const eventCard = document.createElement('div');
  eventCard.className = 'upcoming-events';

  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'upcoming-events-context-wrapper';

  const insideWrap = document.createElement('div');
  insideWrap.className = 'inside-wrap';

  insideWrap.appendChild(createEventDate(events));
  insideWrap.appendChild(createEventLocation(events));
  insideWrap.appendChild(createEventType(events));
  insideWrap.appendChild(createEventTitle(events));
  insideWrap.appendChild(createEventInfo(events));

  contextWrapper.appendChild(insideWrap);
  wrapper.appendChild(contextWrapper);
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

    // Iterate through events
    displayEvents.forEach((item, index) => {
      if (index < 3) {
        generateCard(item, wrapper);
      }
    });
  } catch (error) {
    console.error('Error fetching events', error);
  }
}

export default function decorate(block) {
  // fetch and display events
  const upcomingEventsTextDiv = document.createElement('div');
  upcomingEventsTextDiv.className = 'upcoming-events-text';
  upcomingEventsTextDiv.textContent = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Bevorstehende Veranstaltungen' : 'Upcoming events';

  // Get the reference to the "first-wrap" div
  block.appendChild(upcomingEventsTextDiv);
  const upcomingEventsContent = document.createElement('div');
  upcomingEventsContent.className = 'content';
  block.appendChild(upcomingEventsContent);

  fetchEvents(getTheEventsUrl(), upcomingEventsContent);
}
