import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import Main from "./component/Main";
import Login from "./component/Login";
import Navigation from "./component/Navigation";
import Inventory from "./component/Inventory";
import CookingForm from "./component/CookingForm";
import CookingList from "./component/CookingList";
import CookingDetail from "./component/CookingDetail";
import Loading from "./component/Loading";

const App = () => {
  const [islogin, setIslogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("islogin");
    if (loginStatus) {
      setIslogin(JSON.parse(loginStatus));
    }
  }, []);

  return (
    <Router basename={"/"}>
      <Loading isLoading={isLoading} />
      <Navigation islogin={islogin} setIslogin={setIslogin} />
      <main>
        <div className="layoutWrap">
          <Routes>
            <Route path="/weeklyRestaurant" element={<Navigate to="/" />} />
            <Route
              exact
              path="/"
              element={<Main islogin={islogin} setIsLoading={setIsLoading} />}
            />
            <Route
              path="/login"
              element={
                islogin ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIslogin={setIslogin} />
                )
              }
            />
            <Route
              path="/cookingList/:cookingId"
              element={
                <CookingDetail islogin={islogin} setIsLoading={setIsLoading} />
              }
            />
            <Route
              path="/cookingList"
              element={<CookingList setIsLoading={setIsLoading} />}
            />
            <Route
              path="/cookingForm/:cookingId"
              element={<CookingForm setIsLoading={setIsLoading} />}
            />
            <Route
              path="/cookingForm"
              element={<CookingForm setIsLoading={setIsLoading} />}
            />
            <Route
              path="/inventory"
              element={<Inventory setIsLoading={setIsLoading} />}
            />
          </Routes>
        </div>
      </main>
      <footer>
        <div className="layoutWrap">Copyright &copy; 2020 - 2021</div>
      </footer>
    </Router>
  );
};

export default App;
