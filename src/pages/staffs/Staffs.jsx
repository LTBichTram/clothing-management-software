import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "../../components/dialog/Dialog";
import axios from "axios";
import "./Staffs.css";

import ModalUnstyled from "@mui/core/ModalUnstyled";
import AddStaff from "./addstaff/AddStaff";
import UpdateStaff from "./updatestaff/UpdateStaff";
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
  const [originStaffs,setOriginStaffs]=useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchPosition, setSearchPosition] = useState('all');
  const [showFormAddStaff, setShowFormAddStaff] = useState(false);
  const [showFormUpdateStaff, setShowFormUpdateStaff] = useState(false);
  const searchTextHandler = e => {
    setSearchText(e.target.value);
  }
  const searchPositionHandler = e => {
    setSearchPosition(e.target.value);
  }

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
    .get(`http://localhost:8080/api/users/filterByPositon?position=${searchPosition}`)
    .then((response)=>{
      
      if(response.data.length === 0){
        setStaffs(originStaffs)

      }else{
        setStaffs(response.data)
      }
     
    })
    .catch((error)=>{
      console.log(error.response.data);
    })
 },[searchPosition])

//get All Staffs  
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        setStaffs(res.data);
        setOriginStaffs(res.data)
       
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <div className="div_staff">
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
     

      <div className="div_left col-3">
        <div className="div_search">
          <div className="header_search">Tìm kiếm</div>
          <div className="search">
            <input
             value={searchText}
             onChange={searchTextHandler}
              placeholder="Nhập tên hoặc SĐT nhân viên"
            />
            <i className="bx bx-search"></i>
          </div>
        </div>
        <div className="div_search">
          <div className="header_search">Chức vụ</div>
          <select
            onChange={searchPositionHandler}
            className="selectbox"
            value={searchPosition}
          >
            <option value="all">Tất cả</option>
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
      <div className="div_right col-9">
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
          {
            staffs.map(staff => {
              
              return (
              <tr>
                <td>{staff.id.substr(staff.id.length - 7)}</td>
                <td>{staff.fullname}</td>
                <td>{staff.position}</td>
                <td>{staff.phone}</td>
                <td className="gender">{staff.gender}</td>
                <td><i class='bx bxs-edit'></i></td>
                <td><i style={{color: '#f32727'}} class='bx bx-trash'></i></td>
              </tr>)
            })

          }
        </table>
      </div>
    </div>
  );
};

export default Staffs;
