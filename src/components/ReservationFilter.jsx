import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const ReservationFilter = ({ period, onChange }) => (
  <Box sx={{ display: "flex" }}>
    <FormControl sx={{ width: "10rem" }}>
      <InputLabel id="period">Periodo</InputLabel>
      <Select
        labelId="period"
        id="period"
        value={period}
        label="period"
        onChange={onChange}
      >
        <MenuItem value="past">Precedenti</MenuItem>
        <MenuItem value="now">In corso</MenuItem>
        <MenuItem value="next">Prossime</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

ReservationFilter.propTypes = {
  period: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ReservationFilter;
