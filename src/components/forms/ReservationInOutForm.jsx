import { Controller, useForm } from "react-hook-form";
import { Box, Button, Grid, Modal, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

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

const ReservationInOutForm = () => {
  const [ingressiUscite, setIngressiUscite] = useState({
    reservationIn: 0,
    reservationOut: 0,
    reservationOn: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { handleSubmit, control } = useForm();

  const onSubmit = async (values) => {
    if (!values.date) return;
    const data = await window.ipcRender.invoke(
      "DB:reservation:getCountInAndOut",
      {
        date: values.date.format("YYYY-MM-DD"),
      }
    );
    setIngressiUscite({
      reservationIn: data.countIn,
      reservationOut: data.countOut,
      reservationOn: data.countOn,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => setModalOpen(false);

  return (
    <Box>
      <form
        name="reservationAvailabilityForm"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "inline-flex" }}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="date"
              defaultValue={undefined}
              render={({
                field: { ref, onBlur, name, ...field },
                fieldState,
              }) => (
                <DatePicker
                  {...field}
                  inputRef={ref}
                  label="Data"
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
          <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<SyncAltIcon />}
              variant="contained"
              type="submit"
              color="primary"
              sx={{ marginLeft: "0px", height: "2.25rem" }}
            >
              Ingressi/Uscite
            </Button>
          </Grid>
        </Grid>
      </form>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={{ ...style, width: 600 }}>
          <div>
            <b>INGRESSI: {ingressiUscite?.reservationIn}</b>
          </div>
          <div>
            <b>USCITE: {ingressiUscite?.reservationOut}</b>
          </div>
          <div>
            <b>IN CORSO: {ingressiUscite?.reservationOn}</b>
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReservationInOutForm;
