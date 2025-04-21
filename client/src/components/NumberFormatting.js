import React from 'react';

// Component for formatting ratings and helpfulness values
export const FormattedRating = ({ value }) => {
  if (value === undefined || value === null) return 'N/A';
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) return 'N/A';
  
  // Format to 2 decimal places
  return numValue.toFixed(2);
};

// Usage example for column definitions
const authorColumns = [
  {
    field: 'authorname',
    headerName: 'Author Name',
    //renderCell: (row) => <Link onClick={() => handleAuthorClick(row.authorid)}>{row.authorname}</Link>
  },
  {
    field: 'topbook',
    headerName: 'Top Book'
  },
  {
    field: 'averagerating',
    headerName: 'Rating',
    renderCell: (row) => <FormattedRating value={row.averagerating} />
  },
  {
    field: 'averagehelpfulness',
    headerName: 'Helpfulness',
    renderCell: (row) => <FormattedRating value={row.averagehelpfulness} />
  }
];

// Simple function you can use directly
export const formatDecimal = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 'N/A' : numValue.toFixed(decimalPlaces);
};