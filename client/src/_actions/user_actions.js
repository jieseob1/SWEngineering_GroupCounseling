import axios from "axios";
import { DEV_SERVER, ROOT_SERVER } from "../Config";

export const REGISTER_USER = "REGISTER_USER";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const AUTH_USER = "AUTH_USER";

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${DEV_SERVER}/dev/user/register`, dataToSubmit)
    .then((response) => response.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  // datatosubmit:username(or email),password->
  // 사용자의 username, password가 넘어오게 되면 /user/check로 넘겨서 존재 여부를 확인, 존재할 경우
  //     해당 사용자 데이터의 userid, usertype 등을 되돌려주고 세션에 token 정보를 등록함

  const request = axios
    .get(`${DEV_SERVER}/dev/user/login`, dataToSubmit)
    .then((response) => response.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios.get("/logout").then((response) => response.data);
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios.get("/auth").then((response) => response.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}
