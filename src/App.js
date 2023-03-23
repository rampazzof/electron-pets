import React from "react";
import ReservationTable from "./components/ReservationTable";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReservationAvailabilityForm from "./components/ReservationAvailabilityForm";

const App = () => (
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <ReservationAvailabilityForm />
    <ReservationTable />
  </LocalizationProvider>
);
export default App;
