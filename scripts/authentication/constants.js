// Dev creds
//export const API_BASE_URL = 'https://apirest-test.wyvernhost1.co.uk/Wyvern/Post';
//export const API_KEY = '4890cc6c';
//export const API_ACCOUNT = 'WyvernDBMembershipSubs_Test_EDS';

// Prod cred
export const API_BASE_URL = 'https://apirest.wyvernhost1.co.uk/Wyvern/Post';
export const API_KEY = '87d17af3';
export const API_ACCOUNT = 'WyvernDBMembershipSubs_EDS';

// The pass phrase 'wapi' derived through PKCS5
export const PASS_PHRASE = Uint8Array.from([
  47, 109, 50, 164, 21, 70, 155, 166, 76, 62, 213, 96, 62, 44, 248, 101, 55, 202, 128, 57, 33, 147, 81, 250, 213, 182,
  174, 161, 22, 198, 133, 239,
]);
export const IV = 'i3tuje8u2940t89g';

export const COOKIE_USER_NAME = 'user_name';
export const COOKIE_USER_ID = 'user_id';
export const COOKIE_USER_SUB = 'user_sub';
export const COOKIE_LIFETIME_SECONDS = 3600 * 24 * 7; // 7 days session duration

export const ARTICLE_GATED_DAYS = 1;

export const NO_SUBSCRIPTION_COPY =
  'Your subscription has expired. Please <a href="/renew">renew</a> your subscription to continue accessing our content.';
export const LOGIN_FAILED_COPY =
  'You have entered an invalid username or password. Please check your login details or try <a href="/forgot-password">resetting your password</a> if required.';

export const LOGIN_FAILED_COPY_GERMAN =
  'Sie haben einen ungültigen Anwendernamen oder ein ungültiges Passwort eingeben. Bitte überprüfen Sie Ihre Accountdaten oder setzen Sie Ihr Passwort zurück, falls erforderlich.';
