/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ReservationTable from "./components/ReservationTable";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReservationAvailabilityForm from "./components/ReservationAvailabilityForm";
import { Box, Button, Modal } from "@mui/material";
import ReservationEditForm from "./components/ReservationEditForm";

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

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationCount, setReservationCount] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("start_date");
  const [order, setOrder] = useState("asc");
  const [reservationSelected, setReservationSelected] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchData = async () => {
    const data = await window.ipcRender.invoke("DB:reservation:findAll", {
      limit: rowsPerPage,
      page,
      orderBy,
      order,
    });
    setReservations(data.reservations);
    setReservationCount(data.count);
  };

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, orderBy, order]);

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
      return;
    }
    setOrderBy(field);
    setOrder("asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteModalOpen = (row) => {
    setReservationSelected(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setReservationSelected();
    setDeleteModalOpen(false);
  };

  const handleEditModalOpen = (row) => {
    setReservationSelected(row);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setReservationSelected();
    setEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (reservationSelected?.id) {
      try {
        await window.ipcRender.invoke("DB:reservation:delete", {
          id: reservationSelected.id,
        });
      } catch (err) {
        console.log("error deleting row");
      }
    }
    handleDeleteModalClose();
    fetchData();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ReservationAvailabilityForm refetch={fetchData} />
      <ReservationTable
        reservations={reservations}
        reservationCount={reservationCount}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        handleSort={handleSort}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleDeleteModalOpen={handleDeleteModalOpen}
        handleEditModalOpen={handleEditModalOpen}
      />
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <ReservationEditForm
            defaultValues={reservationSelected}
            onClose={handleEditModalClose}
            refetch={fetchData}
          />
        </Box>
      </Modal>
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Cancella prenotazione</h2>
          <p id="parent-modal-description">
            Sei sicuro di voler cancellare la prenotazione?
          </p>
          <Button variant="contained" onClick={handleConfirmDelete}>
            Si
          </Button>
          <Button variant="outlined" onClick={handleDeleteModalClose}>
            Annulla
          </Button>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};
export default App;
