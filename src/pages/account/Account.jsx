import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import "./Account.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
export default function EditProfile({ rerender, setRerender }) {
  let location = useLocation();
  let history = useHistory();
  const userLocal = JSON.parse(localStorage.getItem("user"));
  console.log(userLocal);
  const [user, setUser] = useState();
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/filter?key=${userLocal.id}`)
      .then((res) => {
        console.log("get all data");
        console.log(res.data);
        setUser(res.data[0]);
      });
  }, []);

  const [userUpdate, setUserUpdate] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",

    birthday: user?.birthday || new Date(),
  });
  const [avatar, setAvatar] = useState("");
  const handleUpdateUser = (e) => {
    setUserUpdate((prev) => {
      const name = e.target.name;
      const value = e.target.value;
      return { ...prev, [name]: value };
    });
  };
  const handleSubmitFormUpdate = (e) => {
    e.preventDefault();
    var formStaff = new FormData();

    userUpdate.fullname && formStaff.append("fullname", userUpdate.fullname);
    userUpdate.phone && formStaff.append("phone", userUpdate.phone);
    userUpdate.address && formStaff.append("address", userUpdate.address);
    userUpdate.email && formStaff.append("email", userUpdate.email);
    userUpdate.birthday && formStaff.append("birthday", userUpdate.birthday);

    avatar && formStaff.append("image", avatar);

    //post to API
    axios
      .put(
        `http://localhost:8080/api/users/update/${userLocal.id}`,
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
        toast("C???p nh???t th??ng tin th??nh c??ng");
      })
      .catch((err) => {
        console.log(err.response);
        alert("C???p nh???t th??ng tin th???t b???i");
      });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };
  const inputAvatarRef = useRef(null);
  return (
    <div className="main">
      <div className="search_name"></div>

      <div className="account_header">
        <h1 className="userTitle">Th??ng tin ng?????i d??ng</h1>
        <div className="account_header-control">
          <div className="action-btn mg-0 ani_fade-in-top account-logout">
            <button
              className="btn mg-0"
              style={{ fontSize: "16px", padding: ".5rem 2rem !important" }}
              onClick={() => {
                window.location.reload();
              }}
            >
              <i class="bx bx-log-out action-btn-icon"></i>
              ????ng xu???t
            </button>
          </div>
        </div>
      </div>

      <div className="main_list">
        <div className="list_left">
          <div className="userShow">
            <div className="userShowTop">
              <img src={user?.imgUrl} alt="" className="userShowImg" />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{user?.fullname}</span>
                <span className="userShowUserTitle">{user?.position}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">T??i kho???n</span>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">{user?.username}</span>
              </div>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">
                  {formatDate(user?.birthday)}
                </span>
              </div>
              <span className="userShowTitle">Li??n h???</span>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">{user?.phone}</span>
              </div>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">{user?.email}</span>
              </div>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">{user?.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="list_right">
          <div className="userUpdate">
            <span className="userUpdateTitle">C???p nh???t</span>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>H??? t??n</label>
                  <input
                    type="text"
                    name="fullname"
                    value={userUpdate?.fullname}
                    onChange={handleUpdateUser}
                    placeholder={user?.fullname}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>S??? ??i???n tho???i</label>
                  <input
                    name="phone"
                    type="phone"
                    value={userUpdate?.phone}
                    placeholder={user?.phone}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;

                      // if value is not blank, then test the regex

                      if (e.target.value === "" || re.test(e.target.value)) {
                        setUserUpdate((prev) => {
                          return { ...prev, phone: e.target.value };
                        });
                      }
                    }}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={user?.email}
                    className="userUpdateInput"
                    value={userUpdate?.email}
                    onChange={handleUpdateUser}
                  />
                </div>
                <div className="userUpdateItem">
                  <label style={{ padding: 0 }}>Ng??y sinh</label>
                  <div className="user-date-picker">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={userUpdate?.birthday}
                        inputFormat="dd/MM/yyyy"
                        onChange={(value) => {
                          setUserUpdate((prev) => {
                            return { ...prev, birthday: value };
                          });
                        }}
                        views={["day", "month", "year"]}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        renderInput={(params) => (
                          <TextField
                            InputLabelProps={{
                              shrink: false,
                            }}
                            {...params}
                            variant="standard"
                            size="small"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="userUpdateItem">
                  <label>?????a ch???</label>
                  <input
                    type="text"
                    placeholder={user?.address || ""}
                    name="address"
                    value={userUpdate?.address}
                    className="userUpdateInput"
                    onChange={handleUpdateUser}
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    onClick={() => {
                      inputAvatarRef.current.click();
                    }}
                    className="userUpdateImg"
                    src={avatar ? URL.createObjectURL(avatar) : user?.imgUrl}
                    alt=""
                  />

                  <label htmlFor="file"></label>
                  <input
                    onChange={onImageChange}
                    accept="image/png, image/gif, image/jpeg"
                    ref={inputAvatarRef}
                    type="file"
                    style={{ display: "none" }}
                  />
                </div>
                <button
                  onClick={handleSubmitFormUpdate}
                  className="userUpdateButton"
                >
                  C???p nh???t
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
