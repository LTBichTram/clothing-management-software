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
    <div className="order-detail-container">
      <div className="order-detail-container-heading">
        <h3>Thông tin chi tiết hoá đơn</h3>

        <button
          onClick={() => {
            history.push("/orders");
          }}
          className="order-detail-btn-exit"
        >
          Thoát
        </button>
      </div>
      <div className="order-detail-container-body">
        <div className="order-detail-container-body-left">
          <div className="order-detail-container-body-left-list">
            {order.orderDetails?.length === 0 && (
              <h3>Hoá đơn này đã hết hàng</h3>
            )}
            {order.orderDetails?.length > 0 &&
              order.orderDetails?.map((orderItem, index) => {
                return (
                  orderItem.product &&
                  orderItem.quantity > 0 && (
                    <div className="order-detail-card ">
                      <div className="order-detail-card-left">
                        <div className="order-detail-card-left-img">
                          <img src={orderItem?.product?.imageUrl} alt="" />
                        </div>
                      </div>

                      <div className="order-detail-card-middle">
                        <b>
                          Mã sản phẩm:{" "}
                          {orderItem?.product?.id.substr(
                            orderItem.product.id.length - 10
                          )}
                        </b>
                        <p className="order-detail-card-middle-content">
                          {orderItem.product?.name}
                        </p>
                        <div className="order-detail-card-middle-desc">
                          <p className="order-detail-card-middle-desc-item">
                            Đơn giá:
                            {` ${orderItem?.product?.salePrice.toLocaleString(
                              "en"
                            )} đ`}
                          </p>

                          <span className="order-detail-card-middle-desc-item">
                            Số lượng: {orderItem?.quantity}
                          </span>

                          <span className="order-detail-card-middle-desc-item">
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
        <div className="order-detail-container-body-right">
          <div className="refund-payment-card">
            <div className="refund-payment-row">
              <span>Khách hàng:</span>
              <b>{order?.customer?.name || "Khách lẻ"}</b>
            </div>
            <div className="refund-payment-row">
              <span>Số điện thoại:</span>
              <span>{order?.customer?.phone || "Không có"}</span>
            </div>
            <div className="refund-payment-row">
              <span>Điểm tích luỹ:</span>
              <span>{order?.customer?.point || 0}</span>
            </div>
            <div className="refund-payment-row">
              <span>Ngày mua hàng:</span>
              <b>{formateDate(order.dateOrder)}</b>
            </div>
            <div className="refund-payment-row"></div>
          </div>
          <div className="refund-payment-card">
            <div className="refund-payment-row">
              <span>Mã hoá đơn:</span>
              <b style={{ color: "#237fcd" }}>
                {order?.id?.substr(order.id.length - 10)}
              </b>
            </div>
            {order.totalReturnPrice > 0 && (
              <div className="refund-payment-row">
                <span>Tổng giá trị hoá đơn :</span>
                <b style={{ color: "#237fcd" }}>{`${(
                  order.orderTotal -
                  (order?.totalReturnPrice || 0) +
                  order.discount
                ).toLocaleString("en")} đ`}</b>
              </div>
            )}
            <div className="refund-payment-row">
              <span>Khuyến mãi:</span>
              <b
                style={{ color: "#237fcd" }}
              >{`${order.discount?.toLocaleString("en")} đ`}</b>
            </div>
            <div className="refund-payment-row">
              <span>Tổng tiền hoá đơn :</span>
              <b style={{ color: "#237fcd" }}>{`${(
                order.orderTotal - (order?.totalReturnPrice || 0)
              ).toLocaleString("en")}đ`}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
