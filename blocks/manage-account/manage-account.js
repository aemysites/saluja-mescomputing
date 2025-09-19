// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { getTheTheme, render } from '../../scripts/shared.js';
import { getUserId } from '../../scripts/authentication/helpers.js';
import { getUser, getUserSubscriptions, getUserFormAutoPopulate } from '../../scripts/authentication/apiClient.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

function diffmonths(today, expireDate) {
  return Math.max(0, (expireDate.getFullYear() - today.getFullYear()) * 12 - today.getMonth() + expireDate.getMonth());
}

function subscriptionHtml(subscriptionInfo) {
  const parseDMY = (s) => {
    const [d, m, y] = s.split(/\D/);
    return new Date(y, m - 1, d);
  };

  const today = new Date();
  const expireDate = parseDMY(subscriptionInfo.DisplayExpiryDate);
  const difDate = diffmonths(today, expireDate);
  let diffDays;
  const convertExpireDate = String(
    `${expireDate.getDate()} ${expireDate.toLocaleString('en-US', { month: 'long' })} ${expireDate.getFullYear()}`
  );

  if (difDate === 0) {
    const diffTime = Math.abs(expireDate - today);
    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  return render(`
           ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Läuft in' : 'Expires in'}
            <span>${difDate === 0 ? `${diffDays} days` : `${difDate} months`}</span>
            ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'am' : 'on'} <span>${convertExpireDate}</span>
            ${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'um' : 'at'} <span>00:00</span>`);
}

async function autoPop() {
  const userInfo = await getUser(getUserId());  
  const userEmail = userInfo.Email;
  let siteSubscriptionId;
  try {
    const response = await fetch('/subscriptions.json');
    const { data } = await response.json();
    [siteSubscriptionId] = data.map(subscription => parseInt(subscription.id, 10));
  } catch (errorMessage) {
      console.log('err', errorMessage);
  }
  const apiget = await getUserFormAutoPopulate(userEmail, siteSubscriptionId);
  return apiget;
}

async function createLink(sub) {
  let text;
  let link; 
  switch (sub.SubscriptionID) {
    case 'mescomputing-com':
      text = 'Renew';
      link = 'https://membership.mescomputing.com/virtual/joinctg?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      break;
    case 9:
      text = 'Renew';
      link = 'https://membership.computing.co.uk/virtual/joinctg?WYVtc=subscriptionoverview&WYVtcTypeID=16';
      break;
    case 10:
      text = 'Renew';
      link = 'https://membership.channelweb.co.uk/virtual/joincrn?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 48:
        text = 'Renew';
        link = 'https://membership.crn.de/virtual/joinCRNDE?WYVtc=homebuttonjoin&amp;WYVtcTypeID=16';
        break;
    case 49:
      text = 'Renew';
      link = 'https://membership.computingdeutschland.de/virtual/joinCTGDE?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 52:
      text = 'Renew';
      link = 'https://membership.crnasia.com/virtual/joincrna?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 55:
      text = 'Renew';
      link = 'https://membership.crn.com.au/virtual/joinCRNANZ?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    default:
      text = 'Renew';
  }
  const pop = await autoPop();
  return render(`
  <a href="${link}&${pop}" title="${text}" target="_blank">${text}</a>`);
}

function createSubscriptionTitle(subscriptionTitle) {
  return render(`<strong>${subscriptionTitle}</strong>`);
}

export default async function decorate(block) {
  block.classList = `${block.getAttribute('class')} tabs`;

  const userInfo = await getUser(getUserId());

  const subscriptionInfo = await getUserSubscriptions(getUserId());
  const table = document.createElement('table');
  const body = document.createElement('tbody');
  table.append(body);

  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Hallo ${userInfo.FullName}` : `Hello ${userInfo.FullName}`;

  const loggedIn = document.createElement('h4');
  loggedIn.className = 'logged-in';
  loggedIn.textContent =
    getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de'
      ? `Sie sind mit Ihrer E-Mail-Adresse eingeloggt ${userInfo.Email} angemeldet`
      : `You are logged in with email address ${userInfo.Email}`;

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    if (!hasWrapper(tabpanel.lastElementChild)) {
      tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
    }

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  const panel = block.querySelector('.tabs-panel');
  panel.append(table);
  subscriptionInfo.forEach((sub) => {

    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    tr.append(td1);
    td1.append(createSubscriptionTitle(sub.Title));
    tr.append(td2);
    body.append(tr);
    td2.append(subscriptionHtml(sub));
    const td3 = document.createElement('td');
    createLink(sub).then(linkFragment => {
      const linkElement = linkFragment.querySelector('a');
      td3.append(linkElement);
    });
    tr.append(td3);
  });

  block.prepend(tablist);
  block.prepend(loggedIn);
  block.prepend(title);
}
