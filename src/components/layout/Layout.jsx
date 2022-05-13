import "./Layout.css";
import SideBar from "../sidebar/SideBar";
import Account from "../../pages/account/Account";
import Customers from "../../pages/customers/Customers";
import DashBoard from "../../pages/dashboard/DashBoard";
import Orders from "../../pages/orders/Orders";
import Products from "../../pages/products/Products";
import Returns from "../../pages/returns/Returns";
import Revenues from "../../pages/revenues/Revenues";
import Sales from "../../pages/sales/Sales";
import Staffs from "../../pages/staffs/Staffs";
import ProductQr from "../../pages/products/product_qr/ProductQr";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import OrderDetail from "../../pages/orders/OrderDetail/OrderDetail";

const Layout = () => {
  return (
    <Router>
      <SideBar>
        <Switch>
          <Route path="/orders" element={<Orders />}>
            <Orders />
          </Route>
          <Route path="/orderDetail">
            <OrderDetail />
          </Route>
          <Route path="/customers" element={<Customers />}>
            <Customers />
          </Route>
          <Route path="/products" element={<Products />}>
            <Products />
          </Route>
          <Route path="/productQr" element={<ProductQr />}>
            <ProductQr />
          </Route>
          <Route path="/staffs" element={<Staffs />}>
            <Staffs />
          </Route>
          <Route path="/revenues" element={<Revenues />}>
            <Revenues />
          </Route>
          <Route path="/sales" element={<Sales />}>
            <Sales />
          </Route>
          <Route path="/returns" element={<Returns />}>
            <Returns />
          </Route>
          <Route path="/account" element={<Account />}>
            <Account />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <DashBoard />
          </Route>

          <Route path="*" element={<> not found</>} />
        </Switch>
      </SideBar>
    </Router>
  );
};
export default Layout;
