import React, { useState, useRef } from "react";
import AddProduct from "../AddProduct";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { styled } from "@mui/system";
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
const ProductsNavbar = ({ setRerenderProducts, handlePrint }) => {
  const [showFormAddProduct, setShowFormAddProduct] = useState(false);
  const handleClose = () => {
    setShowFormAddProduct(false);
  };
  
  return (
    <div>
      <div>
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={showFormAddProduct}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <AddProduct
            setRerenderProducts={setRerenderProducts}
            setShowFormAddProduct={setShowFormAddProduct}
          />
        </StyledModal>
      </div>

      <div 
        onClick={() => setShowFormAddProduct(true)}
        className="action-btn"
        style={{animation: 'fade-in-left 1.5s'}}
      >
        <button className="btn">
            <i className="bx bx-plus action-btn-icon"></i>
            Thêm mới{" "}
        </button>
      </div>

      <div
        onClick={() => {handlePrint()}}
        className="action-btn"
      >
        <button className="btn">
            <i className="bx bxs-file-export action-btn-icon"></i>
            Xuất file
        </button>
      </div>
    </div>
  );
};

export default ProductsNavbar;
