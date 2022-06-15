import React, { useState, useEffect, useRef } from "react";
import AddCustomer from "./AddCustomer/AddCustomer";
import axios from "axios";
import ComboBox from "../../components/combobox/Combobox";
import { Link } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import "./Sales.css";
import NumberFormat from "react-number-format";
const Sales = () => {
  let existCurrentCustomer;
  let existCurrentOrders;
  try {
    existCurrentCustomer = JSON.parse(localStorage.getItem("currentCustomer"));
    existCurrentOrders = JSON.parse(localStorage.getItem("orders"));
  } catch {
    existCurrentCustomer = localStorage.getItem("currentCustomer");
    existCurrentOrders = localStorage.getItem("orders");
  }

  const [categories, setCategories] = useState([]);
  const [categoryActive, setCategoryActive] = useState("Tất cả");
  const [categoryIdActive, setCategoryIdActive] = useState("*");
  const [showListCustomers, setShowListCustomer] = useState(false);
  const [products, setProducts] = useState([]);
  const [originProducts, setOriginProducts] = useState([]);
  const [productSearchText, setProductSearchText] = useState();
  const [customers, setCustomers] = useState([]);
  const [scroreInput, setScoreInput] = useState(0);
  const [filterCustomers, setFilterCustomers] = useState([]);
  const [showFormAddCustomer, setShowFormAddCustomer] = useState(false);
  const [inputTextSearchCustomer, setInputTextSearchCustomer] = useState("");
  const [showScanQrCode, setShowScanQrcode] = useState(false);
  const wrapperRef = useRef(null);
  const [guestMoney, setGuestMoney] = useState({
    guestMoneyFormat: "0 đ",
    guestMoneyValue: 0,
  });
  const [orders, setOrders] = useState([
    {
      activeTab: 0,

      orderDetails:
        (existCurrentOrders && existCurrentOrders[0].orderDetails) || [],
    },
    {
      activeTab: 1,
      orderDetails:
        (existCurrentOrders && existCurrentOrders[1].orderDetails) || [],
    },
    {
      activeTab: 2,
      orderDetails:
        (existCurrentOrders && existCurrentOrders[2].orderDetails) || [],
    },
    {
      activeTab: 3,
      orderDetails:
        (existCurrentOrders && existCurrentOrders[3].orderDetails) || [],
    },
    {
      activeTab: 4,
      orderDetails:
        (existCurrentOrders && existCurrentOrders[4].orderDetails) || [],
    },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState(
    existCurrentCustomer || [
      {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      },
      {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      },
      {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      },
      {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      },
      {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      },
    ]
  );

  //get All cateogories
  useEffect(() => {
    axios.get("http://localhost:8080/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);
  //filter products by category
  useEffect(() => {
    console.log(` Category Active is ${categoryIdActive}`);
    axios
      .get(
        `http://localhost:8080/api/products/productsByCategoryId/${categoryIdActive}`
      )
      .then((res) => {
        setProducts(res.data);
        setOriginProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryIdActive]);

  // get All customers
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/customers")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        console.log("Lỗi call api");
      });
  }, [showFormAddCustomer]);
  //search Product
  useEffect(() => {
    //   console.log({ originProducts });
    const productsFilter = originProducts.filter((product) => {
      return (
        product?.name?.toLowerCase().indexOf(productSearchText?.toLowerCase()) >
          -1 ||
        product._id?.toLowerCase().indexOf(productSearchText?.toLowerCase()) >
          -1
      );
    });
    setProducts(productsFilter);
  }, [productSearchText]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowListCustomer(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    {
      tabIndex: 0,

      name: "Hoá đơn 1",
    },
    {
      tabIndex: 1,
      name: "Hoá đơn 2",
    },
    {
      tabIndex: 2,
      name: "Hoá đơn 3",
    },
    {
      tabIndex: 3,
      name: "Hoá đơn 4",
    },
    {
      tabIndex: 4,
      name: "Hoá đơn 5",
    },
  ]);

  const handleCancel = () => {
    setShowFormAddCustomer(false);
  };
  const handleClickActiveStaff = (index) => {
    setActiveTab(index);
  };
  //handle Score Input
  const handleScoreInput = (e) => {
    const score = e.target.value;
    if (score <= currentCustomer[activeTab].point) {
      setScoreInput(e.target.value);
    }
  };
  const getDecreasePrice = () => {
    //100 điểm được 15000
    //x điểm thì được 15000*x/100
    return (15000 * scroreInput) / 100;
  };
  const getTotalPrice = () => {
    return getTempPrice() - getDecreasePrice();
  };
  //search customer by name or by phone
  const searchCustomers = (searchText) => {
    var originCustomers = customers;
    if (!checkExistCustomer(searchText)) {
      const newCurrentCustomer = [...currentCustomer];
      newCurrentCustomer[activeTab] = {
        name: "Khách lẻ",
        phone: "",
        point: 0,
      };
      setCurrentCustomer(newCurrentCustomer);
      localStorage.setItem(
        "currentCustomer",
        JSON.stringify(newCurrentCustomer)
      );
    }
    if (!searchText || !filterCustomers) {
      setFilterCustomers(customers);
    }
    const customersFilter = originCustomers.filter((customer) => {
      return (
        customer.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
        customer.phone.indexOf(searchText) > -1
      );
    });
    setFilterCustomers(customersFilter);
  };
  //handle scan product
  const handleScanProduct = (data) => {
    if (data) {
      console.log(JSON.parse(data));
      const productScan = JSON.parse(data);
      const prouduct = getProductByName(productScan.name);
      addItemToOrderDetail(prouduct);
    }
  };
  const getProductByName = (name) => {
    const index = products.findIndex((product) => product.name === name);
    return products[index];
  };
  //handle add 1 item to orderDetail
  const addItemToOrderDetail = (product) => {
    var temp = [];
    var result = [];
    const orderItem = {
      productId: product.id,
      imageDisplay: product.imageUrl,
      productName: product.name,
      salePrice: product.salePrice,
      quantity: 1,
    };
    var newOrders = [...orders];

    newOrders[activeTab] = {
      ...newOrders[activeTab],
      orderDetails: [...newOrders[activeTab].orderDetails, orderItem],
    };

    for (var order of newOrders[activeTab].orderDetails) {
      if (!temp[order.productId]) {
        temp[order.productId] = order;
      } else {
        temp[order.productId].quantity += order.quantity;
      }
    }

    for (var i in temp) {
      result.push(temp[i]);
    }
    newOrders[activeTab] = { ...newOrders[activeTab], orderDetails: result };
    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
  };
  const getTempPrice = () => {
    let sum = 0;

    orders[activeTab]?.orderDetails &&
      orders[activeTab].orderDetails.forEach((orderItem) => {
        sum += orderItem.quantity * orderItem.salePrice;
      });
    return sum;
  };
  const checkExistCustomer = (name) => {
    return customers.some((customer) => {
      return customer.name === name;
    });
  };
  const getAccumulatedPoint = () => {
    //900000 được 100 điểm
    //totalPrice ngàn được x điểm
    //Điểm tích luỹ chỉ được sài cho mua kế tiếp
    return Math.floor((getTotalPrice() * 100) / 900000);
  };
  return (
    <div className="main">
      <AddCustomer open={showFormAddCustomer} handleCancel={handleCancel} />

      <div className="search_name"></div>

      <div className="main_list sales_main">
        <div className="sales_left">
          <div className="sales_header">
            <div className="sales_header-top">
              <div className="search_name-wrapper sales_search">
                <input
                  className="search_name-input"
                  id="search_name-input"
                  onChange={(e) => {
                    setProductSearchText(e.target.value);
                  }}
                  value={productSearchText}
                  type="text"
                  placeholder="Tìm kiếm..."
                />
                <label
                  htmlFor="search_name-input"
                  className="search_name-icon bx bx-search"
                ></label>
              </div>
              <div className="action-btn mg-0 ani_fade-in-top">
                <button
                  className="btn mg-0"
                  style={{ fontSize: "16px", padding: ".5rem 2rem !important" }}
                  onClick={() => {
                    setShowScanQrcode(!showScanQrCode);
                  }}
                >
                  <i className="bx bx-qr action-btn-icon"></i>
                  {showScanQrCode && "Tắt webcam"}
                  {!showScanQrCode && "Quét mã vạch"}
                </button>
              </div>
              <div className="sales_filter">
                <ComboBox
                  categoryIdActive={categoryActive}
                  categoryActive={categoryActive}
                  setCategoryIdActive={setCategoryIdActive}
                  setCategoryActive={setCategoryActive}
                  options={categories}
                />
              </div>
            </div>
            <div className="sales_header-bottom">
              <ul className="tab-bills">
                {tabs.map((tab) => {
                  return (
                    <li
                      onClick={() => {
                        setGuestMoney({
                          guestMoneyFormat: "0 đ",
                          guestMoneyValue: 0,
                        });
                        handleClickActiveStaff(tab.tabIndex);
                      }}
                      className={tab.tabIndex === activeTab ? "active" : ""}
                    >
                      {tab.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="sales-list-products row">
            {showScanQrCode && (
              <div className="col-3">
                <div className="sales-card">
                  <QrReader
                    onScan={handleScanProduct}
                    showViewFinder={false}
                    delay={500}
                  />
                </div>
              </div>
            )}
            {products &&
              products.map((product) => {
                return (
                  <div className=" col-3">
                    <div className="sales-card">
                      <div className="sales-card-img">
                        <img
                          className="sales-card-img"
                          src={product.imageUrl}
                          alt="Ảnh"
                        />
                      </div>
                      <div className="sales-card-desc">
                        <div className="sales-card-name">
                          <p>{product.name}</p>
                        </div>
                        <div className="sales-card_prices">
                          {product.discount > 0 && (
                            <p className="sales-card-cost-price">{`${product.costPrice.toLocaleString(
                              "en"
                            )}đ`}</p>
                          )}
                          <p className="sales-card-sale-price">{`${product.salePrice.toLocaleString(
                            "en"
                          )}đ`}</p>
                        </div>
                        <div className="sales-card-buy">
                          <div
                            onClick={() => {
                              addItemToOrderDetail(product);
                            }}
                            className="sales-card-buy-btn"
                          >
                            Chọn
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="sales_right">
          <div className="sales_header">
            <div className="sales_header-top">
              <p style={{ fontSize: "17px", fontWeight: "bold" }}>Khách hàng</p>
              <div className="action-btn mg-0 ani_fade-in-top">
                <button
                  className="btn mg-0"
                  style={{ fontSize: "16px", padding: ".5rem 2rem !important" }}
                  onClick={() => {
                    setShowFormAddCustomer(true);
                  }}
                >
                  <i className="bx bx-plus action-btn-icon"></i>
                  Thêm mới
                </button>
              </div>
            </div>
            <div className="sales_header-bottom">
              <div
                className="search_name-wrapper sales_search"
                style={{ width: "100%" }}
              >
                <input
                  className="search_name-input"
                  id="search_name-input"
                  value={inputTextSearchCustomer}
                  onChange={(e) => {
                    setInputTextSearchCustomer(e.target.value);

                    setShowListCustomer(true);
                    searchCustomers(e.target.value);
                  }}
                  onFocus={() => {
                    setShowListCustomer(true);
                    searchCustomers("");
                  }}
                  type="text"
                  placeholder="Tìm kiếm khách hàng"
                />
                <label
                  htmlFor="search_name-input"
                  className="search_name-icon bx bx-search"
                ></label>
              </div>

              {showListCustomers && (
                <div ref={wrapperRef} className="tab-scrollY sales_customers">
                  {filterCustomers.map((customer) => {
                    return (
                      <div
                        onClick={() => {
                          setShowListCustomer(!showListCustomers);
                          let newCurrentCustomer = [...currentCustomer];
                          newCurrentCustomer[activeTab] = {
                            id: customer.id,
                            name: customer.name,
                            phone: customer.phone,
                            point: customer.point,
                          };
                          setCurrentCustomer(newCurrentCustomer);
                          localStorage.setItem(
                            "currentCustomer",
                            JSON.stringify(newCurrentCustomer)
                          );
                          setInputTextSearchCustomer(
                            newCurrentCustomer[activeTab].name
                          );
                        }}
                        className="tab-scrollY-item"
                      >
                        {customer.name}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="sales_customer-info">
                <div className="sales_customer-info-item">
                  Khách hàng:&nbsp; <b>{currentCustomer[activeTab].name}</b>
                </div>
                <div className="sales_customer-info-item">
                  Số điện thoại:&nbsp; <b>{currentCustomer[activeTab].phone}</b>
                </div>
                <div className="sales_customer-info-item">
                  Tổng điểm tích luỹ:&nbsp;{" "}
                  <b>{currentCustomer[activeTab].point}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="card sales_order">
            <h3 className="sales_order-header">Chi tiết hoá đơn</h3>
            <div className="tab-scrollY sales_order-body">
              {orders[activeTab]?.orderDetails &&
                orders[activeTab].orderDetails.map((orderItem, index) => {
                  if (orderItem.quantity >= 0)
                    return (
                      <div className="tab-scrollY-item sales_order-item">
                        <div className="sales_order-img">
                          <img src={orderItem.imageDisplay} alt="" />
                        </div>
                        <div className="sales_order-midle">
                          <div className="sales_order-name">
                            <p>{orderItem.productName}</p>

                            <i
                              style={{
                                color: "#F26339",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                var newOrders = [...orders];
                                console.log(
                                  newOrders[activeTab].orderDetails[index]
                                );
                                if (
                                  newOrders[activeTab].orderDetails[index]
                                    .quantity >= 0
                                ) {
                                  newOrders[activeTab].orderDetails = orders[
                                    activeTab
                                  ].orderDetails.filter((orderItem) => {
                                    return (
                                      orderItem.productId !==
                                      newOrders[activeTab].orderDetails[index]
                                        .productId
                                    );
                                  });
                                  // newOrders[activeTab].orderDetails[
                                  //   index
                                  // ].quantity = 0;
                                  setOrders(newOrders);
                                  localStorage.setItem(
                                    "orders",
                                    JSON.stringify(newOrders)
                                  );
                                }
                              }}
                              class="bx bx-trash"
                            ></i>
                          </div>

                          <div className="sales_order-desc">
                            <div className="group-count">
                              <div className="group-count-item">
                                <i
                                  onClick={() => {
                                    var newOrders = [...orders];
                                    if (
                                      newOrders[activeTab].orderDetails[index]
                                        .quantity > 0
                                    ) {
                                      newOrders[activeTab].orderDetails[
                                        index
                                      ].quantity -= 1;
                                      setOrders(newOrders);
                                      localStorage.setItem(
                                        "orders",
                                        JSON.stringify(newOrders)
                                      );
                                    }
                                  }}
                                  class="bx bx-minus"
                                ></i>
                              </div>
                              <div className="group-count-item">
                                <input
                                  value={orderItem.quantity}
                                  onChange={(e) => {
                                    let newOrders = [...orders];
                                    let orderItem = {
                                      ...newOrders[activeTab].orderDetails[
                                        index
                                      ],
                                    };
                                    if (Math.floor(e.target.value) >= 0) {
                                      orderItem.quantity = Math.floor(
                                        e.target.value
                                      );
                                      newOrders[activeTab].orderDetails[index] =
                                        orderItem;
                                      setOrders(newOrders);
                                      localStorage.setItem(
                                        "orders",
                                        JSON.stringify(newOrders)
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <div className="group-count-item">
                                <i
                                  onClick={() => {
                                    var newOrders = [...orders];
                                    newOrders[activeTab].orderDetails[
                                      index
                                    ].quantity += 1;
                                    setOrders(newOrders);
                                    localStorage.setItem(
                                      "orders",
                                      JSON.stringify(newOrders)
                                    );
                                  }}
                                  class="bx bx-plus"
                                ></i>
                              </div>
                            </div>
                            <b>{`${(
                              orderItem.salePrice * orderItem.quantity
                            ).toLocaleString("en")}đ`}</b>
                          </div>
                        </div>
                      </div>
                    );
                })}
            </div>
          </div>
          <div className="sales_prices">
            <div className="sales_prices-item">
              <p>Tạm tính</p>
              <span>{`${getTempPrice().toLocaleString("en")}đ`}</span>
            </div>
            <div className="sales_prices-item">
              <p>Điểm tích luỹ</p>
              <span>{getAccumulatedPoint()}</span>
            </div>
            <div className="sales_prices-item">
              <p>Sử dụng điểm</p>
              <input
                value={scroreInput}
                onChange={handleScoreInput}
                className="sales-score-used"
                type="text"
              />
            </div>
            <div className="sales_prices-item">
              <p>Giảm giá</p>
              <b>{`${getDecreasePrice().toLocaleString("en")}đ`}</b>
            </div>
            <div className="sales_prices-item">
              <p>Tổng tiền</p>
              <b>{`${getTotalPrice().toLocaleString("en")}đ`}</b>
            </div>
            <div className="refund-payment-row">
              <span style={{ color: "gray", fontWeight: "bold" }}>
                Tiền khách đưa:
              </span>
              <NumberFormat
                thousandSeparator={true}
                suffix=" đ"
                value={guestMoney.guestMoneyFormat}
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  if (guestMoney.guestMoneyValue >= 0) {
                    setGuestMoney({
                      guestMoneyFormat: formattedValue,
                      guestMoneyValue: value,
                    });
                  }
                }}
                style={{
                  color: "#237fcd",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textAlign: "right",
                }}
                type="text"
              />
            </div>
            <div className="refund-payment-row">
              <span style={{ color: "gray", fontWeight: "bold" }}>
                Tiền thối:
              </span>
              {guestMoney.guestMoneyValue - getTotalPrice() > 0 && (
                <NumberFormat
                  readOnly
                  thousandSeparator={true}
                  suffix=" đ"
                  value={guestMoney.guestMoneyValue - getTotalPrice()}
                  style={{
                    color: "#237fcd",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "right",
                  }}
                  type="text"
                />
              )}
            </div>
          </div>

          {getTempPrice() > 0 && (
            <Link
              to={{
                pathname: "/checkout",
                state: {
                  order: {
                    activeTab: activeTab,
                    orderTotal: getTotalPrice(),
                    subTotal: getTempPrice(),
                    discount: getDecreasePrice(),
                    orderDetails: orders[activeTab]?.orderDetails,
                    customer: currentCustomer[activeTab],
                    user: JSON.parse(localStorage.getItem("user")),
                  },
                },
              }}
            >
              <div className="action-btn sales_btn">
                <button
                  className="btn"
                  onClick={() => {
                    currentCustomer[activeTab].point -= scroreInput;
                    currentCustomer[activeTab].point += getAccumulatedPoint();
                  }}
                  style={{ width: "100%" }}
                >
                  <i class="bx bx-credit-card-front action-btn-icon"></i>
                  Thanh toán
                </button>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
