import React from "react";
import "./orders_navbar.css";
import order from "../../../assets/data/order";
const OrdersNavbar = () => {
  return (
    <div>
      <div
        className="row orders_navbar_container "
        style={{ alignItems: "center", fontSize: "20px" }}
      >
        <div className="col-3">
          <h3>Hoá đơn</h3>
        </div>
        <div className="col-5">
          <div className="navbar__search">
            <input type="text" placeholder="Theo mã hoá đơn" />
            <i className="bx bx-search"></i>
          </div>
        </div>
        <div className="col-4">
          <div className="row list-action-orders-btn">
            <div className="action-orders-btn">
              <i class="bx bxs-file-import"></i>
              Gộp đơn
            </div>
            <div className="action-orders-btn">
              <i class="bx bxs-file-export"></i>Xuất file
            </div>
            <div className="action-orders-btn">
              <i class="bx bx-menu"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersNavbar;
