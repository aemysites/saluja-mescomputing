import { h, Component, Fragment, render } from '../preact.js';
import htm from '../htm.js';
import { getUser, getUserSubscriptions, login, logout, passwordResetEmailSend } from './apiClient.js';
import {
  COOKIE_USER_ID,
  COOKIE_LIFETIME_SECONDS,
  COOKIE_USER_NAME,
  COOKIE_USER_SUB,
  NO_SUBSCRIPTION_COPY,
  LOGIN_FAILED_COPY,
  LOGIN_FAILED_COPY_GERMAN,
} from './constants.js';
import { decrypt, deleteCookie, getUserId, getUserName, isLoggedIn } from './helpers.js';
import { getTheTheme } from '../shared.js';

const html = htm.bind(h);

export class LoginForm extends Component {
  constructor() {
    super();
    // this.html = htm.bind(h);
    this.state = {
      email: null,
      password: null,
      isLoading: false,
      errorMessage: null,
      message: null,
    };
  }

  setIsLoading(isLoading) {
    this.setState({ isLoading });
  }

  handleSetEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleSetPassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSetErrorMessage(message) {
    this.setState({ errorMessage: message });
  }

  async handleLogin(event) {
    const { email, password } = this.state;
    event.preventDefault();

    this.handleSetErrorMessage(null);

    this.setIsLoading(true);

    try {
      const response = await login(email, password);

      let hasSubscription = false;
      try {
        const userSubscriptions = (await getUserSubscriptions(response.LoggedInUserContactID))    
          .filter((subscription) => subscription.DaysRemaining > 0 && subscription.Status === 1)
          .map((subscription) => subscription.SubscriptionID);
        const siteSubscription = (await (await fetch('/subscriptions.json')).json()).data.map((subscription) =>
          parseInt(subscription.id)
        );
        hasSubscription = userSubscriptions.some((item) => siteSubscription.includes(item));
      } catch (err) {console.log("An error occurred:", err.message);}

      if (!hasSubscription) {
        this.handleSetErrorMessage(NO_SUBSCRIPTION_COPY);
        return;
      }

      document.cookie = `${COOKIE_USER_NAME}=${response.LoggedInUserContactName}; path=/; Max-Age=${COOKIE_LIFETIME_SECONDS}; `;
      document.cookie = `${COOKIE_USER_ID}=${response.LoggedInUserContactID}; path=/; Max-Age=${COOKIE_LIFETIME_SECONDS}; `;
      document.cookie = `${COOKIE_USER_SUB}=${hasSubscription}; path=/; Max-Age=${COOKIE_LIFETIME_SECONDS}; `;

      if (sessionStorage.prev_url) {
        location.href = sessionStorage.prev_url;
      } else {
        location.href = '/';
      }
    } catch (errorMessage) {
      const loginFaildText = getTheTheme() !== 'crn-de' || getTheTheme() === 'computing-de' ? LOGIN_FAILED_COPY : LOGIN_FAILED_COPY_GERMAN;
      this.handleSetErrorMessage(loginFaildText);
    }

    this.setIsLoading(false);
  }

  renderSignInForm() {
    const { email, password, isLoading, errorMessage } = this.state;

    const theme = getTheTheme();
    return html`
      <form class="sign-in-form" onSubmit=${(event) => this.handleLogin(event)}>
        ${errorMessage && html`<div class="error-message" dangerouslySetInnerHTML="${{ __html: errorMessage }}"></div>`}
        <label class="group-form">
          <label class="email-label">Email</label>
          <input
            type="email"
            oninput=${(event) => {
              this.handleSetEmail(event);
            }}
            value=${email}
            placeholder=${theme === 'crn-de' || theme === 'computing-de' ? 'E-Mail-Addresse' : 'Email address'}
            aria-label="Email address"
            autocomplete="email"
          />
        </label>
        <label class="group-form">
          <label class="password-label">${theme === 'crn-de' || theme === 'computing-de' ? 'Passwort' : 'Password'}</label>
          <input
            type="password"
            oninput=${(event) => this.handleSetPassword(event)}
            value=${password}
            placeholder=${theme === 'crn-de' || theme === 'computing-de' ? 'Passwort' : 'Password'}
            aria-label="Password"
            autocomplete="current-password"
          />
        </label>
        <div class="form-actions">
          <label>
            <input value="true" name="remember_me" checked="checked" type="checkbox" class="remember-me" />
            ${theme === 'crn-de' || theme === 'computing-de' ? 'Merken Sie sich mein Passwort' : 'Remember me'}
          </label>
          <button class="sign-in-btn ${isLoading && 'loading'}" tabindex="-1" type="submit" disabled=${isLoading}>
            ${theme === 'crn-de' || theme === 'computing-de' ? 'Einloggen' : 'Sign in'}
          </button>
        </div>
      </form>
      <div class="forgot-password">
        <a
          href="/forgot-password"
          rel="noopener noreferrer"
          aria-label="Forgot Password? Click to reset your password."
        >
          ${theme === 'crn-de' || theme === 'computing-de' ? 'Haben Sie Ihr Passwort vergessen?' : 'Forgot your password?'}
        </a>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <${Fragment}>
        ${this.renderSignInForm()}
      </${Fragment}>
    `;
  }
}

export async function renderLoginForm(selector) {
  const loginForm = html`<${LoginForm} />`;
  render(loginForm, document.querySelector(selector));
}
