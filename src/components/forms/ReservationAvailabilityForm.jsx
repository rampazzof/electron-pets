/* eslint-disable no-unused-vars */
import { Box, Button, Grid, Modal, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReservationCreateForm from "./ReservationCreateForm";
import PropTypes from "prop-types";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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

const ReservationAvailabilityForm = ({
  refetch,
  handleOnSuccessAlert,
  handleOnErrorAlert,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { handleSubmit, control, getValues } = useForm();

  const onSubmit = async (values) => {
    if (
      !values.startDate ||
      !values.endDate ||
      values.startDate.isAfter(values.endDate)
    ) {
      handleOnErrorAlert(
        "La data di ingresso deve essere inferiore alla data di uscita!"
      );
      return;
    }

    const data = await window.ipcRender.invoke(
      "DB:reservation:checkAvailability",
      {
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      }
    );

    if (data && !data.isAvailable) {
      handleOnErrorAlert(
        `Limite consentito superato per le date correnti! (${data.count}/35)`
      );
      return;
    }
    setModalOpen(true);
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
        <Grid container rowSpacing={2} columnSpacing={2}>
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
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<AddCircleIcon />}
              variant="contained"
              type="submit"
              color="primary"
              sx={{ marginLeft: "0px", height: "2.25rem" }}
            >
              Aggiungi
            </Button>
          </Grid>
        </Grid>
      </form>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={{ ...style, width: 600 }}>
          <ReservationCreateForm
            defaultValues={{
              startDate: getValues("startDate"),
              endDate: getValues("endDate"),
            }}
            onClose={handleModalClose}
            refetch={refetch}
            handleOnSuccessAlert={handleOnSuccessAlert}
            handleOnErrorAlert={handleOnErrorAlert}
          />
        </Box>
      </Modal>
    </Box>
  );
};

ReservationAvailabilityForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  handleOnSuccessAlert: PropTypes.func.isRequired,
  handleOnErrorAlert: PropTypes.func.isRequired,
};

export default ReservationAvailabilityForm;
