import { loadCSS, readBlockConfig } from '../../scripts/aem.js';
import '../../libs/forms2/forms2.min.js';

// Load forms2 CSS
loadCSS(`${window.hlx.codeBasePath}/libs/forms2/forms2.css`);
loadCSS(`${window.hlx.codeBasePath}/libs/forms2/forms2-theme-plain.css`);

/**
 * @param {HTMLElement} block
 * @return {Promise<void>}
 */
export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);
  // Setup captcha callback
  window.captchaCallback = (value) => {
    document.querySelectorAll('.grecaptcha-badge').forEach((badge) => {
      badge.style.visibility = 'hidden';
    });

    if (value) {
      const form = window.MktoForms2.getForm(blockConfig.formid);
      if (form) {
        form.setCaptchaValue(value);
      }
    }
  };

  // Load form
  window.MktoForms2.loadForm(blockConfig.rooturl, blockConfig.munchkinid, blockConfig.formid, (formObj) => {
    const formValues = {};
    // Mapping of human-readable names with form names
    const formNameMapping = {
      interest: 'Area_of_Interests__c',
      product: 'Product__c',
    };

    // Prepare and set pre-configured values
    Object.keys(blockConfig).forEach((key) => {
      const name = formNameMapping[key];
      if (name) {
        formValues[name] = blockConfig[key].trim();
      }
    });

    formObj.setValues(formValues);

    const formEl = formObj.getFormElem()[0];

    // Fix select labels
    formEl.querySelectorAll('select:has(> option)').forEach((select) => {
      // First option is used as placeholder
      const option = select.querySelector('option');
      select.setAttribute('aria-label', option.textContent);
      select.removeAttribute('aria-labelledby');
    });

    block.append(formEl);
  });
}
