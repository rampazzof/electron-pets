/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Snackbar,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReservationCreateForm from "./ReservationCreateForm";
import PropTypes from "prop-types";

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

const ReservationAvailabilityForm = ({ refetch }) => {
  const [full, setFull] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { handleSubmit, control, getValues } = useForm();

  const onSubmit = async (values) => {
    if (
      !values.startDate ||
      !values.endDate ||
      values.startDate.isAfter(values.endDate)
    ) {
      return;
    }

    const data = await window.ipcRender.invoke(
      "DB:reservation:countBetweenDates",
      {
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      }
    );

    if (data && data.count < 35) {
      setModalOpen(true);
    } else {
      setFull(true);
    }
  };

  const handleCloseFullAlert = () => {
    setFull(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box>
      <form
        name="reservationAvailabilityForm"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "inline-flex" }}
      >
        <Grid container spacing={2} rowSpacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="startDate"
              defaultValue={undefined}
              render={({
                field: { ref, onBlur, name, ...field },
                fieldState,
              }) => (
                <DatePicker
                  {...field}
                  inputRef={ref}
                  label="Ingresso"
                  format="DD-MM-YYYY"
                  disablePast
                  renderInput={(inputProps) => (
                    <TextField
                      {...inputProps}
                      onBlur={onBlur}
                      name={name}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="endDate"
              render={({
                field: { ref, onBlur, name, ...field },
                fieldState,
              }) => (
                <DatePicker
                  {...field}
                  inputRef={ref}
                  label="Uscita"
                  format="DD-MM-YYYY"
                  disablePast
                  renderInput={(inputProps) => (
                    <TextField
                      {...inputProps}
                      onBlur={onBlur}
                      name={name}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              type="submit"
              variant="contained"
              sx={{ height: "100%", width: "100%" }}
            >
              Aggiungi
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={full}
          autoHideDuration={1800}
          onClose={handleCloseFullAlert}
        >
          <Alert severity="error">
            Posti esauriti per le date selezionate!
          </Alert>
        </Snackbar>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box sx={{ ...style, width: 600 }}>
            <ReservationCreateForm
              defaultValues={{
                startDate: getValues("startDate"),
                endDate: getValues("endDate"),
              }}
              onClose={handleModalClose}
              refetch={refetch}
            />
          </Box>
        </Modal>
      </form>
    </Box>
  );
};

ReservationAvailabilityForm.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default ReservationAvailabilityForm;
