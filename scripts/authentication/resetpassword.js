import { h, Component, Fragment, render } from '../preact.js';
import htm from '../htm.js';
import { decrypt } from './helpers.js';
import { passwordResetEmailSend } from './apiClient.js';
import { getTheTheme } from '../shared.js';

const html = htm.bind(h);
export class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
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

  handleSetErrorMessage(errorMessage) {
    this.setState({ errorMessage });
  }

  handleMessage(message) {
    this.setState({ message });
  }

  async handlePasswordResetEmailSend(event) {
    event.preventDefault();
    const { email } = this.state;

    if (!email) {
      if (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
        this.handleSetErrorMessage('Das E-Mail-Feld darf nicht leer sein');
      } else {
        this.handleSetErrorMessage('Email field should not be blank');
      }
      return;
    }

    this.handleMessage(false);
    this.handleSetErrorMessage(null);
    this.setIsLoading(true);

    try {
      const siteSubscriptionId = (await (await fetch('/subscriptions.json')).json()).data.map((subscription) =>
        parseInt(subscription.id)
      )[0];
      const response = await passwordResetEmailSend(email, siteSubscriptionId);
      this.handleMessage(true);
      console.log('PASSWORD RESET EMAIL SEND');
      console.log('=======================');
      console.log(response);
      try {
        const textDecoder = new TextDecoder('utf-8');
        const decryptedResponse = await decrypt(response);

        console.log('res', textDecoder.decode(decryptedResponse));
      } catch (errorMessage) {
        console.log('err', errorMessage);
      }
      console.log('=======================');
    } catch (errorMessage) {
      if (errorMessage === 'Unable to send password reset: Object reference not set to an instance of an object.') {
        if (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
          this.handleSetErrorMessage('Kein Abonnent mit dieser E-Mail-ID vorhanden');
        } else {
          this.handleSetErrorMessage('No Subscriber present with this email id');
        }
      }
    } finally {
      this.setIsLoading(false);
    }
  }

  renderResetPasswordForm() {
    const { email, password, isLoading, errorMessage, message } = this.state;

    const theme = getTheTheme();
    let resetText;
    switch (theme) {
      case 'crn-de':
        resetText = `Bitte checken Sie Ihre E-Mail. Wir haben den Link an ${email} geschickt. Wenn Sie die Mail nicht innerhalb einer Stunde in Ihrer Inbox haben, sehen Sie bitte im Spam-Ordner nach.`;
        break;
      case 'computing-de':
        resetText = `Bitte checken Sie Ihre E-Mail. Wir haben den Link an ${email} geschickt. Wenn Sie die Mail nicht innerhalb einer Stunde in Ihrer Inbox haben, sehen Sie bitte im Spam-Ordner nach.`;
        break;
      default:
        resetText = `Please check your email. The link to change your password has been sent to ${email}. If the mail has not arrived in your inbox within 15-20 minutes, please check your junk mail folder.`;
    }

    return html` ${errorMessage && html` <span class="error-message">${errorMessage}</span> `}
    ${message && html`<span class="send-email-message">${resetText}</span>`}
    ${!message &&
    html` <form class="password-reset-form" onSubmit=${(event) => this.handlePasswordResetEmailSend(event)}>
      <label class="group-form">
        <input
          type="email"
          onChange=${(event) => this.handleSetEmail(event)}
          value=${email}
          placeholder=${theme === 'crn-de' || theme === 'computing-de' ? 'E-Mail-Addresse' : 'Email address'}
          aria-label="Email address"
          autocomplete="email"
        />
      </label>
      <button class="reset-password-btn ${isLoading && 'loading'}" type="submit" disabled=${isLoading}>
        ${theme === 'crn-de' || theme === 'computing-de' ? 'Passwort zurücksetzen' : 'Reset password'}
      </button>
    </form>`}`;
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <${Fragment}>
        ${this.renderResetPasswordForm()}
      </${Fragment}>
    `;
  }
}

export async function renderResetForm(selector) {
  const resetForm = html`<${ResetPassword} />`;
  render(resetForm, document.querySelector(selector));
}
