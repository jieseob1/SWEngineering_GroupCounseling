import React, { useEffect, useState, useReducer } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import styled from "styled-components";
import send from "../assets/send.jpg";
import { withRouter } from "react-router-dom";
// 하위 컴포넌트
import Messages from "../components/Chat/Messages/Messages";
import RoomInfo from "../components/Chat/RoomInfo";
import Input from "../components/Chat//Input";
import Header from "../components/Common/Header";
import StyledContainer from "../components/Style/styledContainer";
import StyledBox from "../components/Style/styledBox";

// Material-ui
import Paper from "@material-ui/core/Paper";

import { ROOT_SERVER, DEV_SERVER } from "../Config";
const Chatbox = styled.div`
  color: #212121;
  width: 100%;
  height: 500px;
  border: 1px solid #eaeaea;
  box-sizing: content-box;
`;

const HeadTextDiv = styled.div`
  height: 75px;
  color: #505050;
  line-height: 75px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
`;

const FootTextDiv = styled.div`
  height: 75px;
  display: flex;
  font-size: 5px;
`;

const ChatDiv = styled.div`
  height: 350px;
  border-bottom: 1px solid #ddd;
`;

const Send = styled.img`
  margin-top: 10px;
  margin-right: 10px;
  width: 50px;
  height: 50px;
`;

const style = {
  width: "500px",
  height: "50px",
  marginLeft: "10px",
};

let socket;

const Chat = ({ location }) => {
  // location:현재 페이지 정보,location.search로 현재 url의 쿼리 스트링을 가지고 올 수 있다.
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // 메세지들을 담는 배열
  const [users, setUsers] = useState("");

  const ENDPOINT = DEV_SERVER;

  useEffect(
    () => {
      // query-string middleware의 사용
      // const data = queryString.parse(location.search);
      // console.log(location.search); // ?name=lama&room=peru
      // console.log(data); // 객체 : {name: "lama", room: "peru"}
      // 다시 정리

      const { name, room } = queryString.parse(location.search);
      // queryString:url뒤에 ?부분 부터로 파라미터들로 구성된 부분-> location객체가 가진 search 속성을 사용할 수 있다.
      socket = io(ENDPOINT); // 소켓 연결

      setName(name);
      setRoom(room);

      console.log(name, room); // lama peru

      // console.log(socket);
      socket.emit("join", { name, room }, (error) => {
        // 데이터 받는 부분
        // console.log("error");
        // 에러 처리
        if (error) {
          alert(error);
        }
      });

      return () => {
        socket.emit("disconnect");

        socket.off();
      };
    }
    // [ENDPOINT, location.search]
  ); // 한번만 부른다 // 불필요한 사이드 이펙트를 줄인다

  useEffect(() => {
    // 서버에서 message 이벤트가 올 경우에 대해서 `on`
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  // 메세지 보내기 함수
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, setMessage(""));
    }
  };

  console.log(message, messages);
  console.log(users, "users");

  // return <h1>Chat</h1>;
  // 1.roominfo
  // 2.messages
  // 3.input

  return (
    <>
      <Header title="채팅방" link="/board"></Header>
      <Chatbox>
        <HeadTextDiv>Room: undefined</HeadTextDiv>
        <ChatDiv></ChatDiv>
        <FootTextDiv>
          <input
            type="text"
            placeholder="메세지를 입력하세요"
            style={style}
          ></input>
          <Send src={send} />
        </FootTextDiv>
      </Chatbox>
    </>
  );
};

export default withRouter(Chat);
