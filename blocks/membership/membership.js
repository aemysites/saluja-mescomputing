export default function decorate(block) {
  const placehorlders = block.querySelectorAll('h6');
  const membershipTable = document.createElement('div');
  membershipTable.classList.add('membership-join');
  block.appendChild(membershipTable);

  placehorlders.forEach((placeholder) => {
    const cellClassName = placeholder.parentElement.textContent.trim().toLowerCase();
    const tableCell = placeholder.parentElement.nextElementSibling.parentElement;
    const isStandardType = placeholder.textContent.toLowerCase().includes('standard-description');
    tableCell.classList.add(cellClassName);

    if (isStandardType) {
      const standardMembershipType = document.createElement('div');
      standardMembershipType.classList.add(`${cellClassName}-type`);
      standardMembershipType.textContent = 'Standard';
      membershipTable.appendChild(standardMembershipType);
    }

    placeholder.parentElement.remove();
    membershipTable.appendChild(tableCell);
  });

  const buttons = document.querySelectorAll('.button-container');
  buttons.forEach((btn) => {
    btn.querySelector('a').removeAttribute('target');

    if (btn.previousElementSibling.tagName === 'H3') {
      const wrapper = document.createElement('div');
      const bottomBtn = btn.cloneNode(true);
      const bottomBtnClass = btn.previousElementSibling.parentElement.parentElement.getAttribute('class');

      wrapper.classList.add(`${bottomBtnClass}-bottom-btn`);
      wrapper.appendChild(bottomBtn);
      membershipTable.appendChild(wrapper);
    }
  });

  return block;
}
