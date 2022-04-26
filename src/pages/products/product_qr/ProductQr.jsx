import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./productQr.css";
import { useLocation, useNavigate } from "react-router";
import { useReactToPrint } from "react-to-print";
const ProductQr = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  let location = useLocation();
  const history = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        alert("Lỗi server");
      });
  }, []);

  return (
    <div className="product-qr-container">
      <div className="product-qr-container-heading">
        <h3>Thông tin danh sách sản phẩm</h3>

        <div>
          <button
            onClick={() => {
              handlePrint();
            }}
            className="product-qr-btn"
          >
            Xuất file
          </button>
          <button
            onClick={() => {
              history.push("/products");
            }}
            className="product-qr-btn"
          >
            Thoát
          </button>
        </div>
      </div>
      <div className="product-qr-container-body">
        <div ref={componentRef} className="product-qr-container-body-left-list">
          {products.map((product, index) => {
            return (
              <div className="product-qr-card ">
                <div className="product-qr-card-left">
                  <div className="product-qr-card-left-img">
                    <img src={product?.qrCodeUrl} alt="" />
                  </div>
                </div>

                <div className="product-qr-card-middle">
                  <b>
                    Mã sản phẩm: {product?.id.substr(product.id.length - 10)}
                  </b>
                  <p className="product-qr-card-middle-content">
                    {product?.name}
                  </p>
                  <div className="product-qr-card-middle-desc">
                    <p className="product-qr-card-middle-desc-item">
                      Giá gốc:
                      {` ${product?.originPrice.toLocaleString("en")} đ`}
                    </p>

                    <span className="product-qr-card-middle-desc-item">
                      Giá bán: {` ${product?.salePrice.toLocaleString("en")} đ`}
                    </span>

                    <span className="product-qr-card-middle-desc-item">
                      Giảm giá:
                      <b>{` ${product.discount.toLocaleString("en")} %`}</b>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductQr;
