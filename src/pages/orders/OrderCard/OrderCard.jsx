import React, { useState, useRef } from "react";
import "./order_card.css";
const options = [
  "Linh",
  "Hao",
  "Vy",
  "Nhan",
  "Linh 123",
  "Hao 123",
  "Linh xe om",
];
const OrderCard = ({ title }) => {
  const wrapperRef = useRef(null);
  const [display, setDisplay] = useState(false);
  const [input, setInput] = useState("");
  //get List filter
  const filterName = options.filter((value) => {
    if (!input) return options;
    return value.toLowerCase().indexOf(input.toLowerCase()) !== -1;
  });

  window.addEventListener("mousedown", (e) => {
    //  console.log(wrapperRef.current);
    const wrap = wrapperRef.current;
    console.log({ eventtarget: e.target, wrap });

    if (wrap && !wrap.contains(e.target)) {
      setDisplay(false);
    }
  });
  return (
    <div className="order-card" ref={wrapperRef}>
      <h3 className="order-card-title">{title}</h3>
      <input
        placeholder="Án vào đây"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        type="text"
        onClick={() => {
          setDisplay(true);
        }}
      />

      {display && (
        <div className="order-list-filter">
          {filterName.map((value, index) => {
            return (
              <div
                onClick={(e) => {
                  setInput(value);
                  setDisplay(false);
                }}
              >
                {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
