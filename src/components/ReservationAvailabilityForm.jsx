/* eslint-disable no-unused-vars */
import { Alert, Box, Button, Modal, Snackbar, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReservationForm from "./ReservationForm";
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

    if (data && data.count < 40) {
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
    <>
      <form
        name="reservationAvailabilityForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="startDate"
          defaultValue={undefined}
          render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
            <DatePicker
              {...field}
              inputRef={ref}
              label="Ingresso"
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
        <Controller
          control={control}
          name="endDate"
          render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
            <DatePicker
              {...field}
              inputRef={ref}
              label="Uscita"
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
        <Button type="submit" variant="contained">
          Aggiungi
        </Button>
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
            <ReservationForm
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
    </>
  );
};

ReservationAvailabilityForm.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default ReservationAvailabilityForm;
