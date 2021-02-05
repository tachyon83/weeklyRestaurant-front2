import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import logo from '../images/logo.png';
import axios from 'axios';
const host = require("../host");

const Navigation = (props) => {
  const {islogin, setIslogin} = props

  const handleLogout = useCallback(
    () => {
      axios.get(`${host.server}/member/logout`, {
        withCredentials: true
      }).then((result) => {
        setIslogin(false)
      }).catch( error => { console.log('failed', error) })
    }, [setIslogin])

  return (
    <nav>
      <div className="layoutWrap">
        <h1 className="logo">
          <Link to="/">
            <img
              src="https://png2.cleanpng.com/sh/4e46ea245115c8278f5307440fa79692/L0KzQYm3U8MxN5Z6iZH0aYP2gLBuTfJqe6V3h59sYXboPbb5jfl1aV5oh9D7YXSwfbL1ifxiNaNqiAZqdYLkfsW0kvV0fJJ6itN3dD3vf7j2TcViapY8TNZsMHWzdYS4Tsc4PGM4TaU8MUW1QoW6UcE6PmE6T6g3cH7q/kisspng-bistro-cafe-ermita-conrad-manila-restaurant-restaurant-logo-5abe74dc0e0e31.7742353315224311960576.png"
              src={logo}
              alt=""
            />
          </Link>
        </h1>
        <ul>
          <li><Link to="/cookingList">요리 목록</Link></li>
          {
            islogin 
            ? 
            <>
              <li><Link to="/cookingForm">요리 추가</Link></li>
              <li><Link to="/inventory">재고 현황</Link></li>
            </>
            : null
          }
        </ul>
        {
          islogin
          ? <button className="login" onClick={handleLogout} >로그아웃</button>
          : <Link to="/login" className="login">로그인</Link>
        }
      </div>
    </nav>
  );
};

export default Navigation;
