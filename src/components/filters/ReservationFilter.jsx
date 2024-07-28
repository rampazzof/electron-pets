import { Button, Grid, MenuItem, Select } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

const ReservationFilter = ({
  periodFilter,
  fromFilter,
  toFilter,
  handlePeriodFilter,
  handleFromFilter,
  handleToFilter,
  handleResetFilters,
}) => (
  <Grid container rowSpacing={2} columnSpacing={2} justify="flex-start">
    <Grid item xs={2}>
      <Select
        value={periodFilter}
        onChange={handlePeriodFilter}
        style={{ width: "100%" }}
      >
        <MenuItem value="past">Precedenti</MenuItem>
        <MenuItem value="now">In corso</MenuItem>
        <MenuItem value="next">Prossime</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={2}>
      <DatePicker
        label="Da"
        onChange={handleFromFilter}
        value={fromFilter}
        format="DD-MM-YYYY"
      />
    </Grid>
    <Grid item xs={2}>
      <DatePicker
        label="A"
        onChange={handleToFilter}
        value={toFilter}
        format="DD-MM-YYYY"
      />
    </Grid>
    <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
      <Button
        startIcon={<CloseIcon />}
        variant="contained"
        type="submit"
        color="primary"
        sx={{ marginLeft: "0px", height: "2.25rem" }}
        onClick={handleResetFilters}
      >
        Resetta
      </Button>
    </Grid>
  </Grid>
);

ReservationFilter.propTypes = {
  periodFilter: PropTypes.string.isRequired,
  fromFilter: PropTypes.string,
  toFilter: PropTypes.string,
  handlePeriodFilter: PropTypes.func.isRequired,
  handleFromFilter: PropTypes.func.isRequired,
  handleToFilter: PropTypes.func.isRequired,
  handleResetFilters: PropTypes.func.isRequired,
};

ReservationFilter.defaultProps = {
  fromFilter: undefined,
  toFilter: undefined,
};

export default ReservationFilter;
