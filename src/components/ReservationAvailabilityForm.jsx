/* eslint-disable no-unused-vars */
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const ReservationAvailabilityForm = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = async (values) => {
    const data = await window.ipcRender.invoke(
      "DB:reservation:countBetweenDates",
      {
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      }
    );
    console.log("submitted!", data);
  };

  return (
    <form name="reservationAvailabilityForm" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="startDate"
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
        CHECK!
      </Button>
    </form>
  );
};

export default ReservationAvailabilityForm;
