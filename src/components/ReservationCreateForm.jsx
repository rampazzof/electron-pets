import { Box, Button, Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";

const ReservationCreateForm = ({ defaultValues, onClose, refetch }) => {
  const { handleSubmit, control, register } = useForm({
    defaultValues,
  });

  const onSubmit = async (values) => {
    try {
      await window.ipcRender.invoke("DB:reservation:insert", {
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        customerName: values.customerName,
        petName: values.petName,
        info: values.info,
      });
    } catch (err) {
      console.log("error during insert", err);
    }
    onClose();
    refetch();
  };

  return (
    <Box>
      <form
        name="reservationAvailabilityForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="startDate"
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
                  readOnly
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
          <Grid item xs={6}>
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
                  readOnly
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
          <Grid item xs={6}>
            <TextField
              id="customerName"
              label="Cliente"
              required
              {...register("customerName")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="petName" label="Cane" {...register("petName")} />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Button type="submit" variant="contained">
            Salva
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

ReservationCreateForm.defaultProps = {
  defaultValues: undefined,
};

ReservationCreateForm.propTypes = {
  defaultValues: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ReservationCreateForm;
