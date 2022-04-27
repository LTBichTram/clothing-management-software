import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

import "./updateProduct.css";
import axios from "axios";

import validateProduct from "../form_validate/validateProduct";
import useFormProduct from "../form_validate/useFormProduct";
import { toast } from "react-toastify";

const UpdateProduct = ({ product, setProduct, setShowFormUpdateProduct }) => {
  const inputAvatarRef = useRef(null);
  const [avatar, setAvatar] = useState();
  const [categories, setCategories] = useState([]);

  const [qrImage, setQrImage] = useState(product.qrCodeUrl);

  const [categoryId, setCategoryId] = useState(product.categoryId);

  //get All cateogories
  useEffect(() => {
    axios.get("http://localhost:8080/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleIncreaseDiscount = (e) => {
    setProduct((prev) => {
      if (prev.discount <= 99) {
        const discount = Math.floor(prev.discount) + 1;
        return {
          ...prev,
          discount: discount,
          salePrice: prev.costPrice - (discount * prev.costPrice) / 100,
        };
      } else {
        return prev;
      }
    });
  };

  const handleDecreaseDiscount = (e) => {
    setProduct((prev) => {
      if (prev.discount > 0) {
        const discount = Math.floor(prev.discount) - 1;
        return {
          ...prev,
          discount: discount,
          salePrice: prev.costPrice - (discount * prev.costPrice) / 100,
        };
      } else {
        return prev;
      }
    });
  };

  //active function when choose image from pc
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  //Submit form
  const submitForm = async () => {
    console.log("Hello from Test");
    console.log(product);
    // console.log(categoryId);
    const formProduct = new FormData();
    formProduct.append("categoryId", categoryId);
    formProduct.append("name", product.name);
    formProduct.append("costPrice", product.costPrice);
    formProduct.append("discount", product.discount);
    formProduct.append("salePrice", product.salePrice);
    formProduct.append("originPrice", product.originPrice);

    formProduct.append("image", avatar);

    //post to API
    axios
      .put(
        `http://localhost:8080/api/products/update/${product.id}`,
        formProduct,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        toast("Cập nhật sản phẩm thành công");
      })
      .catch((error) => {
        if (error.response) {
          toast("Cập nhật sản phẩm thất bại");

          console.log(error.response.data);
        }
      });
  };
  const { handleChange, handleSubmit, errors } = useFormProduct(
    submitForm,
    product,
    setProduct,
    validateProduct
  );

  const onExitClick = () => {
    setShowFormUpdateProduct(false);
  };

  return (
    <div className="form-container">
      <div className="form-heading">
        <h3 className="form-heading-title">Cập nhật sản phẩm</h3>
        <div className="form-heading-info">
          <p>Thông tin</p>
          <div className="line-add"></div>
        </div>
        <div onClick={onExitClick} className="form-btn-exit">
          X
        </div>
      </div>
      <div className="form-body">
        <div className="form">
          <div className="form-row">
            <span>Mã sản phẩm</span>
            <input
              type="text"
              placeholder="Mã tự động"
              value={product.id}
              readOnly
            />
          </div>
          <div className="form-row">
            <span>Giá vốn (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="costPrice"
              value={product.costPrice}
              onChange={handleChange}
            />
            <p className="form-error">{errors.costPrice}</p>
          </div>
          <div className="form-row">
            <span>Loại sản phẩm</span>

            <select
              name="categoryId"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
              }}
              className="form-select"
            >
              {categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-row">
            <span>Giảm giá (%)</span>
            <input
              name="discount"
              type="text"
              pattern="[0-9]*"
              value={product.discount}
              onChange={handleChange}
            />

            <div className="discount_type">
              <i
                onClick={handleIncreaseDiscount}
                class="bx bxs-up-arrow discount_type_item"
              ></i>
              <i
                onClick={handleDecreaseDiscount}
                class="bx bxs-down-arrow discount_type_item"
              ></i>
            </div>
            <p className="form-error">{errors.countInStock}</p>
          </div>

          <div className="form-row">
            <span>Tên sản phẩm</span>
            <input name="name" value={product.name} onChange={handleChange} />
            <p className="form-error">{errors.name}</p>
          </div>
          <div className="form-row">
            <span>Giá bán (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="salePrice"
              className="salePrice"
              value={product.salePrice}
              onChange={handleChange}
            />
            <p className="form-error">{errors.salePrice}</p>
          </div>

          <div className="form-row">
            <span>Giá nhập</span>
            <input
              pattern="[0-9]*"
              name="originPrice"
              type="text"
              value={product.originPrice}
              onChange={handleChange}
            />
            <p className="form-error">{errors.originPrice}</p>
          </div>
        </div>
      </div>
      <div className="form-images">
        <div className="form-image">
          <input
            ref={inputAvatarRef}
            type="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
          <p>Hình ảnh sản phẩm</p>
          <img
            onClick={() => {
              inputAvatarRef.current.click();
            }}
            style={{ height: 120, width: 120 }}
            src={avatar ? URL.createObjectURL(avatar) : product.imageUrl}
            alt=""
          />
        </div>
        <div className="form-image">
          <p>Mã vạch</p>
          <img style={{ height: 120, width: 120 }} src={qrImage} alt="" />
        </div>
      </div>
      <div className="form-btn-row">
        <button onClick={handleSubmit} className="form-btn-save">
          Lưu
        </button>
        <button onClick={onExitClick} className="form-btn-cancel">
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
