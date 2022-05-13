import { useState,useRef,useEffect } from "react";
import "./combobox.css";

function Combobox({ options, categoryActive, setCategoryActive }) {
  const [isActive, setIsActive] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActive(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div ref={wrapperRef} className="dropdown">
      <div 
        className="dropdown-btn" 
        onClick={(e) => setIsActive(!isActive)}
      >
        <p>{categoryActive}</p>
        <span className="fas fa-caret-down"></span>
      </div>
      {isActive && (
        <div className="dropdown-content">
          <div
            className="dropdown-item"
            onClick={() => {
              setCategoryActive("Tất cả");
              setIsActive(false);
            }}
          >
            Tất cả
          </div>
          {options.map((option) => (
            <div
              onClick={(e) => {
                setCategoryActive(option.name);
                setIsActive(false);
              }}
              className="dropdown-item"
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Combobox;
