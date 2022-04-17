import './SideBar.css';
import { NavLink } from "react-router-dom";
import { FaBars} from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import sidebar from "../../assets/data/sidebar.json";
import logo from "../../assets/images/minaT.png"

const SideBar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pageActive,setPageActive] = useState(0);
    const toggle = () => setIsOpen(!isOpen);
  
    const showAnimation = {
      hidden: {
        width: 0,
        opacity: 0,
        transition: {
          duration: 0.6,
        },
      },
      show: {
        opacity: 1,
        width: "auto",
        transition: {
          duration:0.3,
        },
      },
    };
  
    return (
      <>
        <div className="main-container">
          <motion.div
            animate={{
              width: isOpen ? "240px" : "45px",
  
              transition: {
                duration: 0.2,
                type: "spring",
                damping: 10,
              },
            }}
            className={`sidebar `}
          >
            <div className="top_section">
              <AnimatePresence>
                {isOpen && (
                  <motion.h1
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="logo"
                  >
                    <img style={{  height: "35px" }} src={logo} alt="" />
                   The MinaT
                  </motion.h1>
                )}
              </AnimatePresence>
  
              <div className="bars">
                <FaBars className="icon-bars" onClick={toggle} />
              </div>
            </div>
            
            <section className="routes">
              {sidebar.map((item, index) => {
  
                return (
                  <NavLink
                  onClick={()=>{
                    setPageActive(index);
                  }}
                    to={item.route}
                    key={index}
                    className={index===pageActive?`link sidebar-active`:`link`}
                  >
                    <i className={`${item.icon} icon`}></i>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {item.display_name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </section>
          </motion.div>
  
          <main>{children}</main>
        </div>
      </>
    );
  };
  export default SideBar;
  