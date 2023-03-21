import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect } from "react";

const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationCount, setReservationCount] = useState(undefined);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await window.ipcRender.invoke("DB:reservation:findAll", {
        limit: rowsPerPage,
        page,
      });
      console.log("reservations", reservations);
      setReservations(data.reservations);
      setReservationCount(data.count);
    };
    getData();
  }, [rowsPerPage, page]);

  return (
    <Paper elevation={6}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active
                direction="asc"
                onClick={() => console.log("sort!")}
              >
                Cliente
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Entrata</TableCell>
            <TableCell align="right">Uscita</TableCell>
            <TableCell align="right">Nome 🐕</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.customerName}
              </TableCell>
              <TableCell align="right">{row.startDate}</TableCell>
              <TableCell align="right">{row.endDate}</TableCell>
              <TableCell align="right">{row.petName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={reservationCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ReservationTable;
