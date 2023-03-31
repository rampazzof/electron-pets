import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import moment from "moment";

const ReservationTable = ({
  reservations,
  reservationCount,
  page,
  rowsPerPage,
  orderBy,
  order,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteModalOpen,
  handleEditModalOpen,
}) => (
  <Paper elevation={3}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Cliente</TableCell>
          <TableCell align="right">
            <TableSortLabel
              active={orderBy === "start_date"}
              direction={order}
              onClick={() => handleSort("start_date")}
            >
              Entrata
            </TableSortLabel>
          </TableCell>
          <TableCell align="right">
            <TableSortLabel
              active={orderBy == "end_date"}
              direction={order}
              onClick={() => handleSort("end_date")}
            >
              Uscita
            </TableSortLabel>
          </TableCell>
          <TableCell align="right">Nome 🐕</TableCell>
          <TableCell align="right">Telefono</TableCell>
          <TableCell align="right">Info</TableCell>
          <TableCell align="right">Azioni</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reservations.map((row, idx) => (
          <TableRow
            key={idx}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.customerName}
            </TableCell>
            <TableCell align="right">
              {moment(row.startDate).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell align="right">
              {moment(row.endDate).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell align="right">{row.petName}</TableCell>
            <TableCell align="right">{row.phone}</TableCell>
            <TableCell align="right">{row.info}</TableCell>
            <TableCell align="right">
              <Grid container spacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditModalOpen(row)}
                  >
                    Modifica
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteModalOpen(row)}
                  >
                    Elimina
                  </Button>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[10, 15, 25]}
      component="div"
      count={reservationCount || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
);

ReservationTable.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.object).isRequired,
  reservationCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  orderBy: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleDeleteModalOpen: PropTypes.func.isRequired,
  handleEditModalOpen: PropTypes.func.isRequired,
};

export default ReservationTable;
