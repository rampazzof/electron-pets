import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const ReservationFilter = ({ period, onChange }) => (
  <Box sx={{ display: "flex" }}>
    <FormControl>
      <InputLabel id="period">Periodo</InputLabel>
      <Select
        labelId="period"
        id="period"
        value={period}
        label="period"
        onChange={onChange}
      >
        <MenuItem value="past">Passate</MenuItem>
        <MenuItem value="now">In corso</MenuItem>
        <MenuItem value="next">Future</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

ReservationFilter.propTypes = {
  period: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ReservationFilter;
