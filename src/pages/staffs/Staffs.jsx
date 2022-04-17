import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Staffs.css";

import ModalUnstyled from "@mui/core/ModalUnstyled";
import TableContainer from '@mui/material/TableContainer';
import AddStaff from "./addstaff/AddStaff";
import UpdateStaff from "./updatestaff/UpdateStaff";
import Dialog from "../../components/dialog/Dialog";
import { styled, Box } from "@mui/system";

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
  
  const searchTextHandler = e => {
    setSearchText(e.target.value);
  };
  const searchPositionHandler = (e) => {
    setSearchPosition(e.target.value);
  };
  const handleCloseDialog = () => {
    setShowDialogDelete(false);
  };
  const handleDeleteStaff = () => {
    axios
      .post(`http://localhost:8080/api/users/delete/${selectedStaff.id}`)
      .then((res) => {
        handleCloseDialog();
        alert("Xoá nhân thành công");
        setSelectedStaff(null);
      })
      .catch(() => {
        alert("Lỗi xin bạn hãy thử lại sau");
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
    <div className="staff">
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
            <label className="search_position-label">Chức vụ</label>
            <select
              onChange={searchPositionHandler}
              className="search_position-select"
              value={searchPosition}
            >
              <option value="All">Tất cả</option>
              <option value="Nhân viên kho">Nhân viên kho</option>
              <option value="Nhân viên thu ngân">Nhân viên thu ngân</option>
            </select>
          </div>
          <div className="action-staff-btn">
            <button onClick={() => setShowFormAddStaff(true)}>
              <i class="bx bx-plus"></i>
              Thêm nhân viên{" "}
            </button>
          </div>
        </div>
        <div className="list_right">
          <table id="staffs">
            <tr>
              <th>Mã nhân viên</th>
              <th>Tên nhân viên</th>
              <th>Chức vụ</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th></th>
              <th></th>
            </tr>
            {staffs.map((staff, index) => {
              return (
                <tr key={index}>
                  <td>{staff.id.substr(staff.id.length - 7)}</td>
                  <td className="fullname">{staff.fullname}</td>
                  <td>{staff.position}</td>
                  <td>{staff.phone}</td>
                  <td className="gender">{staff.gender}</td>
                  <td
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowFormUpdateStaff(true);
                    }}
                    padding="checkbox"
                  >
                    <i
                      style={{ fontSize: 18, color: "#0DB3E2" }}
                      class="bx bxs-edit"
                    ></i>
                  </td>
                  <td
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowDialogDelete(true);
                    }}
                    padding="checkbox"
                  >
                    <i
                      style={{ fontSize: 18, color: "#F26339" }}
                      class="bx bx-trash"
                    ></i>
                  </td>
                </tr>)
              })
            }
          </table>
          
        </div>
      </div>
    </div>
  );
};

export default Staffs;
