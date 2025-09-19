// Select the table-matrix div
const tableMatrix = document.querySelector('.table-matrix');

// Iterate through all child divs of table-matrix
const rows = tableMatrix.children;

// Add the .table-row class to each child div of table-matrix
Array.from(rows).forEach((row) => {
  row.classList.add('table-row');

  // Add the .table-column class to each child div of .table-row
  const columns = row.children;
  Array.from(columns).forEach((column) => {
    column.classList.add('table-column');
  });
});
