import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orderdetail.css";
import { useLocation, useHistory } from "react-router-dom";
import NumberFormat from "react-number-format";

const OrderDetail = () => {
  let location = useLocation();
  const history = useHistory();
  const orderId = location.state.orderId;
  const [order, setOrder] = useState([]);
  const formateDate = (dateStr) => {
    var date = new Date(dateStr);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/orders/filterId?key=${orderId}`)
      .then((res) => {
        console.log(res.data[0]);
        setOrder(res.data[0]);
      })
      .catch((err) => {
        alert("Lỗi server");
      });
  }, [orderId]);

  return (
    <div className="main">
      <div className="search_name">
      </div>
      <div className="order_detail-header">
        <h3>Thông tin chi tiết hoá đơn</h3>
        <div className="action-btn mg-0 ani_fade-in-top">
          <button 
            className="btn mg-0" 
            onClick={() => history.push("/orders")}
            style={{fontSize: '16px'}} 
          >
            <i className="bx bx-window-close action-btn-icon"></i>
            Thoát
          </button>
        </div>
      </div>
      <div className="main_list">
        <div className="order_detail-left">
          <div className="card_value">
            <div className="card_value-item">
              <span className="order_detail-span">Khách hàng:</span>
              <b>{order?.customer?.name || "Khách lẻ"}</b>
            </div>
            <div className="card_value-item">
              <span className="order_detail-span">Số điện thoại:</span>
              <span>{order?.customer?.phone || "Không có"}</span>
            </div>
            <div className="card_value-item">
              <span className="order_detail-span">Điểm tích luỹ:</span>
              <span>{order?.customer?.point || 0}</span>
            </div>
            <div className="card_value-item">
              <span className="order_detail-span">Ngày mua hàng:</span>
              <b>{formateDate(order.dateOrder)}</b>
            </div>
            <div className="card_value-item"></div>
          </div>
          <div className="card_value">
            <div className="card_value-item">
              <span className="order_detail-span">Mã hoá đơn:</span>
              <b style={{ color: "#237fcd" }}>
                {order?.id?.substr(order.id.length - 10)}
              </b>
            </div>
            {order.totalReturnPrice > 0 && (
              <div className="card_value-item">
                <span className="order_detail-span">Tổng giá trị hoá đơn :</span>
                <b style={{ color: "#237fcd" }}>{`${(
                  order.orderTotal -
                  (order?.totalReturnPrice || 0) +
                  order.discount
                ).toLocaleString("en")} đ`}</b>
              </div>
            )}
            <div className="card_value-item">
              <span className="order_detail-span">Khuyến mãi:</span>
              <b
                style={{ color: "#237fcd" }}
              >{`${order.discount?.toLocaleString("en")} đ`}</b>
            </div>
            <div className="card_value-item">
              <span className="order_detail-span">Tổng tiền hoá đơn :</span>
              <b style={{ color: "#237fcd" }}>{`${(
                order.orderTotal - (order?.totalReturnPrice || 0)
              ).toLocaleString("en")}đ`}</b>
            </div>
          </div>
        </div>
        <div className="order_detail-right ani_fade-in-top">
          <div className="order_detail-list">
            {order.orderDetails?.length === 0 && (
              <h3>Hoá đơn này đã hết hàng</h3>
            )}
            {order.orderDetails?.length > 0 &&
              order.orderDetails?.map((orderItem, index) => {
                return (
                  orderItem.product &&
                  orderItem.quantity > 0 && (
                    <div className="order_detail-card ">
                      <div className="order_detail-card-left">
                        <div className="order_detail-card-left-img">
                          <img src={orderItem?.product?.imageUrl} alt="" />
                        </div>
                      </div>

                      <div className="order_detail-card-middle">
                        <b>
                          Mã sản phẩm:{" "}
                          {orderItem?.product?.id.substr(
                            orderItem.product.id.length - 10
                          )}
                        </b>
                        <p className="order_detail-card-middle-content">
                          {orderItem.product?.name}
                        </p>
                        <div className="order_detail-card-middle-desc">
                          <p className="order_detail-card-middle-desc-item">
                            Đơn giá:
                            {` ${orderItem?.product?.salePrice.toLocaleString(
                              "en"
                            )} đ`}
                          </p>

                          <span className="order_detail-card-middle-desc-item">
                            Số lượng: {orderItem?.quantity}
                          </span>

                          <span className="order_detail-card-middle-desc-item">
                            Thành tiền:
                            <b>{` ${(
                              orderItem.product.salePrice * orderItem?.quantity
                            ).toLocaleString("en")} đ`}</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
