import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

// Modified version that works without requiring pagination from the API
export default function ModifiedLazyTable({ route, columns, defaultPageSize, rowsPerPageOptions }) {
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed for MUI
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  // Fetch all data at once
  useEffect(() => {
    console.log("Fetching data from:", route);
    fetch(route)
      .then(res => res.json())
      .then(resJson => {
        console.log("Data received:", resJson);
        setAllData(resJson);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  }, [route]);

  // Client-side pagination
  const getPageData = () => {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    setPage(0); // Reset to first page
  };

  const defaultRenderCell = (col, row) => {
    console.log("Rendering cell for field:", col.field, "value:", row[col.field]);
    return <div>{row[col.field] !== undefined ? row[col.field] : ''}</div>;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.headerName}>{col.headerName}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {getPageData().map((row, idx) =>
            <TableRow key={idx}>
              {columns.map(col => (
                <TableCell key={col.headerName}>
                  {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
        component="div"
        count={allData.length}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
      />
    </TableContainer>
  );
}