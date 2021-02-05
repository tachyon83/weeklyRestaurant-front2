import React, { useCallback, useState } from "react";
import axios from 'axios';
const host = require("../host");

const Login = ({ setIslogin }) => {

  const [loginValue, setLoginValue] = useState(
    {
      username: 'test',
      password: 'abcd1234',
    }
  );

  const onLoginInputId = useCallback((e) => {
    e.preventDefault();
    setLoginValue({ ...loginValue, username: e.target.value });
  }, [loginValue])

  const onLoginInputPassword = useCallback((e) => {
    e.preventDefault();
    setLoginValue({ ...loginValue, password: e.target.value });
    setTimeout(() => { console.log(loginValue) }, 1000)
  }, [loginValue])

  const handleLogin = useCallback((event) => {
    event.preventDefault();
    axios.post(`${host.server}/member/login`, loginValue, {
      withCredentials: true
    }).then((result) => {
      console.log(result)
      setIslogin(true)
    }).catch(error => { console.log('failed', error) })
  }, [loginValue]);

  return (
    <form className="Login">
      <div className="Login__title">로그인</div>
      <div className="Login__inputWrap">
        <dl>
          <dt>ID</dt>
          <dd>
            <input type="text" onChange={onLoginInputId} value={loginValue.username} />
          </dd>
        </dl>
        <dl>
          <dt>Password</dt>
          <dd>
            <input type="password" onChange={onLoginInputPassword} value={loginValue.password} />
          </dd>
        </dl>
        <div className="Login__buttonWrap">
          <button className="Login__button" onClick={handleLogin}>
            로그인
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
