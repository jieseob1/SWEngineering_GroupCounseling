import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import chat from "../../../assets/chat.png";

const StyledHeader = styled.div`
  display: flex;
  color: #353535;
  width: 100%;
  height: 25px;
  padding: 0px 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: center;
`;
const Logo = styled.img`
  margin-top: 10px;
  width: 20px;
  height: 20px;
  vertical-align: center;
  cursor: pointer;
`;
const HeaderTitle = styled.span`
  color: #454545;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  line-height: 24px;
  margin-left: 4px;
`;
const WriteChat = (props) => {
  return (
    <StyledHeader>
      <Link to={props.link}>
        <Logo src={chat} alt="chat" />
        <HeaderTitle>{props.title}</HeaderTitle>
      </Link>
    </StyledHeader>
  );
};

export default WriteChat;
