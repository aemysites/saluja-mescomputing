import { API_ACCOUNT } from './constants.js';
import { buildApiUrl } from './helpers.js';

let token = localStorage.getItem('apiToken');

export async function performApiLoginRequest(urlSearchParams) {
  const apiUrl = await buildApiUrl(urlSearchParams);

  try {
    const request = await fetch(apiUrl);
    const response = await request.json();

    if (response.hasOwnProperty('ErrorMessage') && response.ErrorMessage !== '') {
      return Promise.reject(response.ErrorMessage);
    }

    if (response.hasOwnProperty('JsonData') && response.JsonData !== '') {
      return Promise.resolve(JSON.parse(response?.JsonData));
    }

    return Promise.resolve(response.Message);
  } catch (e) {
    return Promise.reject(e.message);
  }
}

export async function performApiRequest(urlSearchParams) {
  const apiUrl = await buildApiUrl(urlSearchParams);
  
  // Log the decoded request data
  const decodedData = decodeURIComponent(apiUrl.split('Data=')[1]);

  try {
    const request = await fetch(apiUrl);
    const response = await request.json();

    // Check for actual error conditions
    if (response.Status !== 1 || (response.hasOwnProperty('ErrorMessage') && response.ErrorMessage !== '')) {
      return Promise.reject(response.ErrorMessage || response.Message || 'Unknown error');
    }

    let result;
    if (response.hasOwnProperty('JsonData') && response.JsonData !== '') {
      result = JSON.parse(response.JsonData);      
    } else {
      result = response.Message;
    }

    // Capture the 'token' parameter if it exists
    if (response.Token) {
      token = response.Token;
      localStorage.setItem('apiToken', token);
    }
    return Promise.resolve({ result, token });

  } catch (e) {
    return Promise.reject(e.message);
  }
}

export async function login(username, password) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('WyvernApiAction', 'UserLogin');
  urlSearchParams.append('WyvernApiGetAction', 'False');
  urlSearchParams.append('User_LoginName', username);
  urlSearchParams.append('User_Password', password);

  return performApiLoginRequest(urlSearchParams);
}

export async function register(username, password) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('WyvernApiAction', 'ContactCreateDemo');
  urlSearchParams.append('WyvernApiGetAction', 'False');
  urlSearchParams.append('ContactAPI_Email', username);
  urlSearchParams.append('User_Password', password);
  urlSearchParams.append('ContactAPI_Forename', 'Foo');
  urlSearchParams.append('ContactAPI_Surname', 'Bar');
  urlSearchParams.append('UserAPIValidate_ValidationSet', 'False');
  urlSearchParams.append('ContactAPIValidate_ValidationSet', 'False');

  return performApiLoginRequest(urlSearchParams);
}

export async function getUser(userId) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'ContactGet');
  urlSearchParams.append('ContactAPI_ContactID', userId);
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('ContactTypeID', '0');
  return performApiLoginRequest(urlSearchParams);
}

export async function getUserSubscriptions(userId) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'ContactSubscriptionGet');
  urlSearchParams.append('Subscription_ContactID', userId);
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('ContactTypeID', '0');
  return performApiLoginRequest(urlSearchParams);
}

export async function getUserFormAutoPopulate(userId, siteSubscriptionId) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'SubscriptionFormAutoPopDataGet');
  urlSearchParams.append('ContactAPI_ContactEmail', userId);
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('ContactTypeID', '0');
  urlSearchParams.append('billing_productid', `${siteSubscriptionId}`);
  return performApiLoginRequest(urlSearchParams);
}

export async function getUserWebsiteActivityStartData(userId, site, page, title, tags) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('contactapi_contactid', userId);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'WebsiteActivityStartData');
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('siteactivity_site', site);
  urlSearchParams.append('siteactivity_page', page);
  urlSearchParams.append('siteactivity_title', title);
  urlSearchParams.append('siteactivity_tags', tags);

  // Always include the session ID if we have one
  if (token) {
    urlSearchParams.append('ContactAPI_SessionID', token);
  }

  try {
    const response = await performApiRequest(urlSearchParams);
    return response.result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUserWebsiteActivityEndData(userId, site, page, title, tags) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('contactapi_contactid', userId);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'WebsiteActivityEndData');
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('siteactivity_site', site);
  urlSearchParams.append('siteactivity_page', page);
  urlSearchParams.append('siteactivity_title', title);
  urlSearchParams.append('siteactivity_tags', tags);

  // Append the token to the URLSearchParams if it exists
  if (token) {
    urlSearchParams.append('ContactAPI_SessionID', token);
  }

  // Make the API request with the updated URLSearchParams
  try {
    return performApiRequest(urlSearchParams);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function logout(userId) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'UserLogout');
  urlSearchParams.append('User_ContactID', userId);
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('ContactTypeID', '0');

  // Clear the token on logout
  token = null;
  localStorage.removeItem('apiToken');

  return performApiLoginRequest(urlSearchParams);
}

export async function passwordResetEmailSend(email, siteSubscriptionId) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('WyvernAPIAccount', `${API_ACCOUNT}`);
  urlSearchParams.append('ReturnDataType', '1');
  urlSearchParams.append('WyvernApiAction', 'PasswordResetEmailSend');
  urlSearchParams.append('ContactAPI_ContactEmail', email);
  urlSearchParams.append('WyvernApiActionType', 'Membership');
  urlSearchParams.append('ContactTypeID', '0');
  urlSearchParams.append('billing_productid', `${siteSubscriptionId}`);

  return performApiLoginRequest(urlSearchParams);
}