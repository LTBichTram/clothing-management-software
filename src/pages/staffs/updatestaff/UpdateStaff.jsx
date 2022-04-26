import React, { useState, useRef } from "react";
import "./updatestaff.css";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import useFormStaff from "../form_validate/useFormStaff";
import validateUpdateStaff from "../form_validate/validateUpdateStaff";
import axios from "axios";

const UpdateStaff = ({ staff, setStaff, setShowFormUpdateStaff }) => {
  const inputAvatarRef = useRef(null);

  //Call API
  const submitForm = () => {
    var formStaff = new FormData();
    console.log(staff.position);
    formStaff.append("username", staff.username);

    formStaff.append("fullname", staff.fullname);
    formStaff.append("address", staff.address);
    formStaff.append("birthday", new Date(staff.birthday));
    formStaff.append("gender", staff.gender);
    formStaff.append("position", staff.position);
    formStaff.append("email", staff.email);
    formStaff.append("phone", staff.phone);
    console.log(avatar);
    if (avatar) {
      formStaff.append("image", avatar);
    }

    //post to API
    axios
      .put(
        `http://localhost:8080/api/users/update/${staff.id}`,
        formStaff,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        },
        { timeout: 1000 }
      )
      .then((res) => {
        toast("Cập nhật nhân viên thành công");
        setShowFormUpdateStaff(false);
      })
      .catch((err) => {
        console.log(err.response);
        alert("Cập nhật nhân viên thất bại");
        //setShowFormUpdateStaff(false);
      });
  };
  const { handleChange, handleChangeBirthday, handleSubmit, errors } =
    useFormStaff(submitForm, staff, setStaff, validateUpdateStaff);
  const [avatar, setAvatar] = useState();
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };
  const onExitClick = () => {
    setShowFormUpdateStaff(false);
  };
  return (
    <div className="update_staff-container">
      <div className="update_staff-heading">
        <h3 className="update_staff-heading-title">
          Cập nhật thông tin nhân viên
        </h3>
        <div
          onClick={onExitClick}
          className="bx bx-x update_staff-btn-exit"
        ></div>
      </div>
      <div className="update_staff-body">
        <div className="update_staff_img">
          <img
            src={avatar ? URL.createObjectURL(avatar) : staff.imgUrl}
            alt=""
            className="update_staff-avatar"
          />
          <input
            ref={inputAvatarRef}
            type="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
          <button
            className="btn-pickImage"
            onClick={() => {
              inputAvatarRef.current.click();
            }}
          >
            Chọn ảnh
          </button>
        </div>
        <div className="update_staff-form">
          <div className="update_staff-form-row">
            <span>Mã nhân viên</span>
            <input
              name="username"
              value={staff.id.substr(staff.id.length - 7)}
              type="text"
            />
            <p className="update_staff-form-error">{errors.username}</p>
          </div>
          <div className="update_staff-form-row">
            <span>Ngày sinh</span>
            <p className="update_staff-form-error">{errors.birthday}</p>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                views={["day", "month", "year"]}
                value={staff.birthday}
                name="birthday"
                onChange={handleChangeBirthday}
                renderInput={(params) => (
                  <TextField
                    open
                    fullWidth
                    size="small"
                    style={{
                      height: "100%",
                      width: "206px",
                      borderRadius: 5,
                      zIndex: 4,
                      border: "1px solid #4e5052",
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="update_staff-form-row">
            <span>Họ tên</span>
            <input
              name="fullname"
              onChange={handleChange}
              value={staff.fullname}
              className={errors.fullname ? "error" : ""}
              type="text"
            />
            <p className="update_staff-form-error">{errors.fullname}</p>
          </div>
          <div className="update_staff-form-row">
            <span>Giới tính</span>

            <select
              value={staff.gender}
              className="update_staff-form-select"
              name="gender"
              onChange={handleChange}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="update_staff-form-row">
            <span>Chức vụ</span>
            <select
              onChange={handleChange}
              value={staff.position}
              className="update_staff-form-select"
              name="position"
              id="active"
            >
              <option value="Nhân viên kho">Nhân viên kho</option>
              <option value="Nhân viên thu ngân">Nhân viên thu ngân</option>
            </select>
          </div>

          <div className="update_staff-form-row">
            <span>Email</span>
            <input
              name="email"
              onChange={handleChange}
              value={staff.email}
              type="text"
              className={errors.email ? "error" : ""}
            />
            <p className="update_staff-form-error">{errors.email}</p>
          </div>
          <div className="update_staff-form-row">
            <span>Địa chỉ</span>
            <input
              name="address"
              onChange={handleChange}
              value={staff.address}
              className={errors.address ? "error" : ""}
              type="text"
            />
            <p className="update_staff-form-error">{errors.address}</p>
          </div>
          <div className="update_staff-form-row">
            <span>Số điện thoại</span>
            <input
              name="phone"
              value={staff.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
              type="text"
            />
            <p className="update_staff-form-error">{errors.phone}</p>
          </div>
        </div>
      </div>
      <div className="update_staff-btn-row">
        <button onClick={handleSubmit} className="update_staff-btn-save">
          Cập nhật
        </button>
        <button onClick={onExitClick} className="update_staff-btn-cancel">
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default UpdateStaff;
