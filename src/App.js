import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesApp from "./navigation/RoutesApp";
import { ToastContainer, toast } from "react-toastify";
const App = () => {
  return (
    <div>
      <ToastContainer />
      <Router>
        <RoutesApp />
      </Router>
    </div>
  );
};

export default App;
