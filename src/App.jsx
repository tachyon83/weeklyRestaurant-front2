import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Redirect,
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
    if (JSON.parse(sessionStorage.getItem("islogin"))) {
      setIslogin(true);
    }
  }, []);

  return (
    <Router basename={"/"}>
      <Loading isLoading={isLoading} />
      <Navigation islogin={islogin} setIslogin={setIslogin} />
      <main>
        <div className="layoutWrap">
          <Routes>
            <Redirect from="/weeklyRestaurant" to="/" />
            <Route exact path="/">
              <Main islogin={islogin} setIsLoading={setIsLoading} />
            </Route>
            <Route path="/login">
              {islogin ? (
                <Redirect to="/" />
              ) : (
                <Login setIslogin={setIslogin} />
              )}
            </Route>
            <Route
              path="/cookingList/:cookingId"
              render={() => (
                <CookingDetail islogin={islogin} setIsLoading={setIsLoading} />
              )}
            />
            <Route path="/cookingList">
              <CookingList setIsLoading={setIsLoading} />
            </Route>
            <Route path="/cookingForm/:cookingId">
              <CookingForm setIsLoading={setIsLoading} />
            </Route>
            <Route path="/cookingForm">
              <CookingForm setIsLoading={setIsLoading} />
            </Route>
            <Route path="/inventory">
              <Inventory setIsLoading={setIsLoading} />
            </Route>
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
