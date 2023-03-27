import {
  Box,
  Button,
  Modal,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationCount, setReservationCount] = useState(undefined);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("start_date");
  const [order, setOrder] = useState("asc");
  // eslint-disable-next-line no-unused-vars
  const [wantDelete, setWantDelete] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await window.ipcRender.invoke("DB:reservation:findAll", {
        limit: rowsPerPage,
        page,
        orderBy,
        order,
      });
      setReservations(data.reservations);
      setReservationCount(data.count);
    };
    getData();
  }, [rowsPerPage, page, orderBy, order]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
      return;
    }
    setOrderBy(field);
    setOrder("asc");
  };

  //const handleClickDelete = () => setWantDelete(true);

  const handleCloseModalDelete = () => setWantDelete(false);

  const handleConfirmDelete = async () => {
    try {
      await window.ipcRender.invoke("DB:reservation:delete", {
        id: selectedReservation.id,
      });
    } catch (err) {
      console.log("error deleting row");
    }
    setSelectedReservation(null);
  };

  return (
    <>
      <Paper elevation={6}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "start_date"}
                  direction={order}
                  onClick={() => handleSort("start_date")}
                >
                  Entrata
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy == "end_date"}
                  direction={order}
                  onClick={() => handleSort("end_date")}
                >
                  Uscita
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Nome 🐕</TableCell>
              <TableCell align="right">Modifica</TableCell>
              <TableCell align="right">Elimina</TableCell>
              <TableCell align="json">JSON</TableCell>
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
                <TableCell align="right">
                  <Button variant="contained" startIcon={<EditIcon />}>
                    Modifica
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setSelectedReservation(row)}
                  >
                    Elimina
                  </Button>
                </TableCell>
                <TableCell>{JSON.stringify(row)}</TableCell>
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
      <Modal
        open={selectedReservation}
        onClose={handleCloseModalDelete}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Cancella prenotazione</h2>
          <p id="parent-modal-description">
            Sei sicuro di voler cancellare la prenotazione?
          </p>
          <Button variant="contained" onClick={() => handleConfirmDelete()}>
            Si
          </Button>
          <Button variant="outlined" onClick={handleCloseModalDelete}>
            Annulla
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ReservationTable;
