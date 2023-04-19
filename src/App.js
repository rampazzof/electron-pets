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
import {
  Alert,
  AppBar,
  Box,
  Button,
  Divider,
  Modal,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import ReservationEditForm from "./components/ReservationEditForm";
import ReservationFilter from "./components/ReservationFilter";

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
  const [periodFilter, setPeriodFilter] = useState("next"); // one of ['now', 'next', 'past']
  const [fromFilter, setFromFilter] = useState(null);
  const [toFilter, setToFilter] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(undefined);

  const fetchData = async () => {
    const data = await window.ipcRender.invoke("DB:reservation:findAll", {
      limit: rowsPerPage,
      page,
      orderBy,
      order,
      periodFilter,
      fromFilter: (fromFilter && fromFilter.format("YYYY-MM-DD")) || undefined,
      toFilter: (toFilter && toFilter.format("YYYY-MM-DD")) || undefined,
    });
    setReservations(data.reservations);
    setReservationCount(data.count);
  };

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, orderBy, order, periodFilter, fromFilter, toFilter]);

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
        handleSuccessAlert("Prenotazione rimossa correttamente!");
      } catch (err) {
        handleErrorAlert(
          "Qualcosa è andato storto durante la cancellazione della prenotazione!"
        );
      }
    }
    handleDeleteModalClose();
    fetchData();
  };

  const handleOnChangePeriodFilter = (e) => {
    const selectedPeriod = e.target.value;
    if (selectedPeriod === periodFilter) return;
    if (selectedPeriod === "now" || selectedPeriod === "next") {
      setOrderBy("start_date");
      setOrder("asc");
    } else if (selectedPeriod === "past") {
      setOrderBy("end_date");
      setOrder("desc");
    } else {
      return;
    }
    setPeriodFilter(e.target.value);
  };

  const handleOnChangeFromFilter = (date) => {
    setFromFilter(date);
    console.log("from filter", date);
  };

  const handleOnChangeToFilter = (date) => {
    setToFilter(date);
    console.log("from filter", date);
  };

  const handleResetFilters = () => {
    setPeriodFilter("next");
    setFromFilter(null);
    setToFilter(null);
  };

  const handleSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
  };

  const handleErrorAlert = (message) => {
    setAlertMessage(message);
    setShowErrorAlert(true);
  };

  const handleAlertOnClose = () => {
    setAlertMessage(undefined);
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            Oasi delle 4 Zampe - Prenotazioni
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
        <ReservationAvailabilityForm
          refetch={fetchData}
          handleOnSuccessAlert={handleSuccessAlert}
          handleOnErrorAlert={handleErrorAlert}
        />
        <Divider
          textAlign="center"
          sx={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Typography>Filtri</Typography>
        </Divider>
        <Box>
          <ReservationFilter
            periodFilter={periodFilter}
            fromFilter={fromFilter}
            toFilter={toFilter}
            handlePeriodFilter={handleOnChangePeriodFilter}
            handleFromFilter={handleOnChangeFromFilter}
            handleToFilter={handleOnChangeToFilter}
            handleResetFilters={handleResetFilters}
          />
        </Box>
        <Divider
          textAlign="center"
          sx={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Typography>Prenotazioni</Typography>
        </Divider>
        <Box>
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
        </Box>
      </Box>
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
            handleOnSuccessAlert={handleSuccessAlert}
            handleOnErrorAlert={handleErrorAlert}
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
          <Typography variant="h6" id="parent-modal-title">
            Cancella prenotazione
          </Typography>
          <Typography component="span" id="parent-modal-description">
            Sei sicuro di voler cancellare la prenotazione?
          </Typography>
          <Box sx={{ display: "inline-flex" }}>
            <Button variant="contained" onClick={handleConfirmDelete}>
              Si
            </Button>
            <Button variant="outlined" onClick={handleDeleteModalClose}>
              Annulla
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        onClose={handleAlertOnClose}
      >
        <Alert severity="success">{alertMessage}</Alert>
      </Snackbar>
      <Snackbar
        open={showErrorAlert}
        autoHideDuration={3000}
        onClose={handleAlertOnClose}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};
export default App;
