import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./Staffs.css";

import ModalUnstyled from "@mui/core/ModalUnstyled";
import AddStaff from "./addstaff/AddStaff";
import UpdateStaff from "./updatestaff/UpdateStaff";
import Dialog from "../../components/dialog/Dialog";
import { styled} from "@mui/system";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [originStaffs, setOriginStaffs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchPosition, setSearchPosition] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState();
  const [showFormAddStaff, setShowFormAddStaff] = useState(false);
  const [showFormUpdateStaff, setShowFormUpdateStaff] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);
  const [showLogDelete, setShowLogDelete] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const columns = [
    { id: "id", label: "Mã nhân viên" },
    { id: "fullname", label: "Tên nhân viên" },
    {
      id: "position",
      label: "Chức vụ",
  
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "phone",
      label: "Số điện thoại",
  
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "gender",
      label: "Giới tính",
    },
  ];
  
  const searchTextHandler = e => {
    setSearchText(e.target.value);
  };
  const searchPositionHandler = (e) => {
    setSearchPosition(e.target.value);
  };
  const handleCloseDialog = () => {
    setShowDialogDelete(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDeleteStaff = () => {
    axios
      .post(`http://localhost:8080/api/users/delete/${selectedStaff.id}`)
      .then((res) => {
        handleCloseDialog();
        setShowLogDelete(true)
        setSelectedStaff(null);
      })
      .catch(() => {
        handleCloseDialog();
      });
  };
  
 //filter by phone and name staffs
 useEffect(()=>{
  //Call api and get data
  axios
    .get(`http://localhost:8080/api/users/filter?key=${searchText}`)
    .then((response)=>{
      setStaffs(response.data)
    })
    .catch((error)=>{
      console.log(error.response.data);
    })
 },[searchText]) 

  //filter by position Staffs
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/users/filterByPositon?position=${searchPosition}`
      )
      .then((response) => {
        if (response.data.length === 0) {
          setStaffs(originStaffs);
        } else {
          setStaffs(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [searchPosition]);

  //get All Staffs
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        setStaffs(res.data);
        setOriginStaffs(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [showFormAddStaff, showFormUpdateStaff, selectedStaff]);

  return (
    <div className="staffs">
      {showLogDelete &&
        (<div><ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          /><ToastContainer/></div>)
      }
      <Dialog
        title="Xoá nhân viên"
        content={`Bạn có muốn xoá nhân viên: ${selectedStaff?.fullname} `}
        open={showDialogDelete}
        handleCancel={handleCloseDialog}
        handleAction={handleDeleteStaff}
      />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormAddStaff}
        onClose={() => {
          setShowFormAddStaff(false);
        }}
        BackdropComponent={Backdrop}
      >
        <AddStaff setShowFormAddStaff={setShowFormAddStaff} />
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormUpdateStaff}
        onClose={() => {
          setShowFormUpdateStaff(false);
        }}
        BackdropComponent={Backdrop}
      >
        <UpdateStaff
          staff={selectedStaff}
          setStaff={setSelectedStaff}
          setShowFormUpdateStaff={setShowFormUpdateStaff}
        />
      </StyledModal>

      <div className="search_name">
        <div className="search_name-wrapper">
          <input
            className="search_name-input"
            id="search_name-input"
            value={searchText}
            onChange={searchTextHandler}
            placeholder="Nhập tên hoặc SĐT nhân viên"
          />
          <label
            htmlFor="search_name-input"
            className="search_name-icon bx bx-search"
          ></label>
        </div>
      </div>
      <div className="list_staff">
        <div className="list_left">
          <div className="search_position">
            <label className="search_position-label">Chức vụ:</label>
            <select
              onChange={searchPositionHandler}
              className="search_position-select"
              value={searchPosition}
            >
              <div style={{marginBottom: '10px'}}></div>
              <option value="All">Tất cả</option>
              <option value="Nhân viên kho">Nhân viên kho</option>
              <option value="Nhân viên thu ngân">Nhân viên thu ngân</option>
            </select>
          </div>
          <div className="action-staff-btn">
            <button className="btn" onClick={() => setShowFormAddStaff(true)}>
              <i class="bx bx-plus"></i>
              Thêm nhân viên{" "}
            </button>
          </div>
        </div>
        <div className="list_right">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table ref={componentRef} stickyHeader aria-label="sticky table"
                style={{boxShadow: "0 2px 15px rgb(0 0 0 / 25%) !important"}}
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundImage: "-webkit-linear-gradient(90deg, #fd501b, #ff861a)",
                          color: "#fff",
                          fontSize: '17px',
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell
                      style={{
                        backgroundImage: "-webkit-linear-gradient(90deg, #fd501b, #ff861a)",
                      }}
                    ></TableCell>
                    <TableCell
                      style={{
                        backgroundImage: "-webkit-linear-gradient(90deg, #fd501b, #ff861a)",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          key={row.code}
                          style={
                            index % 2 === 1 ? { backgroundColor: "#ff861a24"} : {}
                          }
                        >
                          {columns.map((column) => {
                            let value = row[column.id];
                            if (column.id === "id") {
                              value = value?.substr(value.length - 7);
                            }

                            return (
                              <TableCell key={column.id} style={{fontSize: '16px',}}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                          <TableCell
                            onClick={() => {
                              console.log("update");
                              setSelectedStaff(row);

                              setShowFormUpdateStaff(true);
                            }}
                          >
                            <i
                              style={{ fontSize: 18, color: "#005059", cursor: "pointer" }}
                              class="bx bxs-edit hide-on-print"
                            ></i>
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              console.log("delete");

                              setSelectedStaff(row);
                              setShowDialogDelete(true);
                            }}
                          >
                            <i
                              style={{fontSize: 18, color: "#fd501b", cursor: "pointer"}}
                              class="bx bx-trash hide-on-print"
                            ></i>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[6]}
              component="div"
              count={staffs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng hiển thị"
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Staffs;
