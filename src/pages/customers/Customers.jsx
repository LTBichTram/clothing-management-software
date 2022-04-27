import React, { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import axios from "axios";
import { useReactToPrint } from "react-to-print";

import "./Customers.css";

const columns = [
  { id: "id", label: "Mã Khách hàng" },
  { id: "name", label: "Tên khách hàng" },
  {
    id: "phone",
    label: "Số điện thoại",
  },
  {
    id: "totalPrice",
    label: "Tổng tiền",

    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "point",
    label: "Điểm tích luỹ",

    format: (value) => value.toLocaleString("en-US"),
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pointFrom, setPointFrom] = React.useState();
  const [pointTo, setPointTo] = React.useState();
  const [totalPriceFrom, setTotalPriceFrom] = React.useState();
  const [totalPriceTo, setTotalPriceTo] = React.useState();
  const [searchText, setSearchText] = useState("");
  const [defaultCustomer, setDefaultCustomer] = React.useState([]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => (document.title = "Print page title"),
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/customers`)
      .then((res) => {
        setDefaultCustomer(res.data);
        setCustomers(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  // Search by strings
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    //Call api and get data
    axios
      .get(`http://localhost:8080/api/customers/filter?key=${searchText}`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [searchText]);

  useEffect(() => {
    if (!pointFrom && !pointTo) {
      setCustomers(defaultCustomer);
    } else if (!pointFrom) {
      const dataPoints = defaultCustomer.filter(
        (customer) => customer.point <= pointTo
      );
      setCustomers(dataPoints);
    } else if (!pointTo) {
      const dataPoints = defaultCustomer.filter(
        (customer) => customer.point >= pointFrom
      );
      setCustomers(dataPoints);
    } else {
      axios
        .get(
          `http://localhost:8080/api/customers/filterPoint?minPoint=${pointFrom}&maxPoint=${pointTo}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            setCustomers(defaultCustomer);
          } else {
            setCustomers(response.data);
          }
        })
        .catch((error) => {});
    }
  }, [pointFrom, pointTo]);

  useEffect(() => {
    if (!totalPriceTo && !totalPriceFrom) {
      setCustomers(defaultCustomer);
    } else if (!totalPriceTo) {
      const dataPoints = defaultCustomer.filter(
        (customer) => customer.totalPrice >= totalPriceFrom
      );
      setCustomers(dataPoints);
    } else if (!totalPriceFrom) {
      const dataPoints = defaultCustomer.filter(
        (customer) => customer.totalPrice <= totalPriceTo
      );
      setCustomers(dataPoints);
    } else {
      axios
        .get(
          `http://localhost:8080/api/customers/filterTotalPrice?minTotal=${totalPriceFrom}&maxTotal=${totalPriceTo}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            setCustomers(defaultCustomer);
          } else {
            setCustomers(response.data);
          }
        })
        .catch((error) => {});
    }
  }, [totalPriceFrom, totalPriceTo]);

  return (
    <div className="main customers">
      <div className="search_name">
        <div className="search_name-wrapper">
          <input
            className="search_name-input"
            id="search_name-input"
            value={searchText}
            onChange={handleSearch}
            placeholder="Nhập tên hoặc SĐT khách hàng"
          />
          <label
            htmlFor="search_name-input"
            className="search_name-icon bx bx-search"
          ></label>
        </div>
      </div>
      <div className="main_list">
        <div className="list_left">
          <div className="card_value">
            <label className="card_value-label">Điểm tích lũy:</label>
            <div className="card_value-body">
              <div className="card_value-item">
                <span>Từ</span>
                <input
                  className="card_value-input"
                  placeholder="Giá trị"
                  type="number"
                  value={pointFrom}
                  onChange={(e) => {
                    setPointFrom(e.target.value);
                  }}
                  onBlur={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div className="card_value-item">
                <span>Đến</span>
                <input
                  className="card_value-input"
                  placeholder="Giá trị"
                  type="number"
                  value={pointTo}
                  onChange={(e) => {
                    setPointTo(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="card_value">
            <label className="card_value-label">Tổng tiền:</label>
            <div className="card_value-body">
              <div className="card_value-item">
                <span>Từ</span>
                <input
                  className="card_value-input"
                  placeholder="Giá trị"
                  type="number"
                  value={totalPriceFrom}
                  onChange={(e) => {
                    setTotalPriceFrom(e.target.value);
                  }}
                />
              </div>
              <div className="card_value-item">
                <span>Đến</span>
                <input
                  className="card_value-input"
                  placeholder="Giá trị"
                  type="number"
                  value={totalPriceTo}
                  onChange={(e) => {
                    setTotalPriceTo(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="print_file-btn">
            <button className="btn" onClick={() => handlePrint()}>
              <i class="bx bx-export action-btn-icon"></i>
              Xuất file
            </button>
          </div>
        </div>
        <div className="list_right">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table ref={componentRef} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundImage:
                            "-webkit-linear-gradient(90deg, #fd501b, #ff861a)",
                          color: "#fff",
                          fontSize: "17px",
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          key={row.code}
                          style={
                            index % 2 === 1
                              ? { backgroundColor: "#ff861a24" }
                              : {}
                          }
                        >
                          {columns.map((column) => {
                            let value = row[column.id];
                            if (column.id === "id") {
                              value = value
                                .substr(value.length - 7)
                                .toUpperCase();
                            }
                            if (column.id === "point") {
                              if (!row.point) value = 0;
                            }
                            return (
                              <TableCell
                                key={column.id}
                                style={{ fontSize: "16px" }}
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage="Số hàng hiển thị"
              rowsPerPageOptions={[6]}
              component="div"
              count={customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Customers;
