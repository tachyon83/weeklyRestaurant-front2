import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import axios from "axios";
const host = require("../host");

const Navigation = (props) => {
  const { islogin = false, setIslogin = () => {} } = props;
  let history = useNavigate();

  const handleLogout = useCallback(() => {
    axios
      .get(`${host.server}/member/logout`, {
        withCredentials: true,
      })
      .then((result) => {
        setIslogin(false);
        sessionStorage.removeItem("islogin");
        history("/");
      })
      .catch((error) => {
        console.log("failed", error);
      });
  }, [setIslogin, history]);

  return (
    <nav>
      <div className="layoutWrap">
        <h1 className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/cookingList">요리 목록</Link>
          </li>
          {islogin ? (
            <>
              <li>
                <Link to="/cookingForm">요리 추가</Link>
              </li>
              <li>
                <Link to="/inventory">재고 현황</Link>
              </li>
            </>
          ) : null}
        </ul>
        {islogin ? (
          <button className="login" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="login">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
