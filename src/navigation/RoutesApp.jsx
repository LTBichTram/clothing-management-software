import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Login from "../pages/login/Login";

const RoutesApp = () => {
  //const [isAuticated, setIsAuticated] = useState(false);
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route path="/home">
        <Layout />
      </Route>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
      {/* <Route exact path="*">
        <Redirect to="/home" />
      </Route> */}
    </Switch>
  );
};
export default RoutesApp;
