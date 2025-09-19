import { renderLoginForm } from '../../scripts/authentication/loginform.js';
import { renderResetForm } from '../../scripts/authentication/resetpassword.js';

// eslint-disable-next-line no-unused-vars,import/prefer-default-export
export async function loadLazy(main) {
  const loginForm = main.querySelector('.loginform-container');
  const subscribe = main.querySelector('.subscribe-wrapper');

  const wrapper = document.createElement('div');
  wrapper.classList = 'authentication-container';

  const login = loginForm ? main.querySelector('.loginform-container') : main.querySelector('.resetpassword-container');
  const title = main.querySelector('.default-content-wrapper:has(h1)');

  const loginWrapper = main.querySelector('.loginform-wrapper')
    ? main.querySelector('.loginform-wrapper')
    : main.querySelector('.resetpassword-wrapper');

  const container = document.createElement('div');
  container.classList = 'authenticationform';

  if (loginForm) {
    await renderLoginForm('.loginform-wrapper');
  } else {
    await renderResetForm('.resetpassword-wrapper');
  }

  // login.insertBefore(container, main.querySelector('.default-content-wrapper'));
  container.append(title);
  container.append(loginWrapper);

  wrapper.append(container);
  wrapper.append(main.querySelector('.default-content-wrapper'));

  login.insertBefore(wrapper, subscribe);
}
