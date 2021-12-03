import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import Header from "../Common/Header";
import profile from "../../assets/profile.png";
import BarChart from "./BarChart";

const ChatListbox = styled.div`
  color: #212121;
  width: 100%;
  height: 300px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  box-sizing: content-box;
`;
const BestPostBox = styled.div`
  color: #212121;
  width: 100%;
  height: 200px;
  margin: 8px 0px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
`;
const StyledDiv = styled.div`
  height: 50px;
  & + & {
    border-top: 1px solid #ddd;
  }
  line-height: 50px;
  cursor: pointer;
`;
const HeadTextDiv = styled.div`
  color: #505050;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
`;
const ContextTextDiv = styled(Link)`
  display: block;
  color: #505050;
  text-align: center;
  font-size: 13px;
`;
const FlexBox = styled.div`
  height: 50px;
  display: flex;
  justify-content: start;
  margin: 10px 0px 0px 0px;
`;
const StyledSpan = styled.span`
  font-size: 10px;
  color: #505050;
  margin: 10px 0px 0px 5px;
`;
const ProfileImage = styled.img`
  width: 20px;
  height: 20px;
  margin: 10px 5px 10px 10px;
  border-radius: 6px;
  pointer: cursor;
`;

const ChatBox = styled.div`
  color: #212121;
  width: 200px;
  height: 50px;
  margin: 8px 0px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  line-height: 50px;
  margin: 0px auto;
`;

function ChatMain({ match }) {
  // let new_data = [];

  // let data = [
  //   {
  //     date: "10/11",
  //     positive: "30",
  //     negative: "50",
  //   },
  //   {
  //     date: "10/12",
  //     positive: "35",
  //     negative: "40",
  //   },
  //   {
  //     date: "10/13",
  //     positive: "30",
  //     negative: "28",
  //   },
  //   {
  //     date: "10/14",
  //     positive: "30",
  //     negative: "50",
  //   },
  //   {
  //     date: "10/15",
  //     positive: "35",
  //     negative: "40",
  //   },
  //   {
  //     date: "10/16",
  //     positive: "30",
  //     negative: "28",
  //   },
  //   {
  //     date: "10/17",
  //     positive: "30",
  //     negative: "50",
  //   },
  //   {
  //     date: "10/18",
  //     positive: "35",
  //     negative: "40",
  //   },
  //   {
  //     date: "10/19",
  //     positive: "30",
  //     negative: "28",
  //   },
  //   {
  //     date: "10/20",
  //     positive: "30",
  //     negative: "50",
  //   },
  //   {
  //     date: "10/21",
  //     positive: "35",
  //     negative: "40",
  //   },
  //   {
  //     date: "10/22",
  //     positive: "30",
  //     negative: "28",
  //   },
  // ];

  // let startdata = data.slice(0, 2);
  // let enddata = data.slice(data.length - 4, data.length - 1);

  // Object.values(startdata).forEach((item) => {
  //   new_data.push(item);
  // });
  // Object.values(enddata).forEach((item) => {
  //   new_data.push(item);
  // });

  return (
    <>
      <Header title="채팅방" link="/chat"></Header>
      <ChatListbox>
        <StyledDiv>
          <HeadTextDiv>채팅방 목록</HeadTextDiv>
        </StyledDiv>
        <StyledDiv>
          <ContextTextDiv to="/chat/loveview">연애 채팅방</ContextTextDiv>
        </StyledDiv>
        <StyledDiv>
          <ContextTextDiv to="/chat/homeview">가정 채팅방</ContextTextDiv>
        </StyledDiv>
        <StyledDiv>
          <ContextTextDiv to="/chat/schoolview">학업 채팅방</ContextTextDiv>
        </StyledDiv>
        <StyledDiv>
          <ContextTextDiv to="/chat/futureview">진로 채팅방</ContextTextDiv>
        </StyledDiv>
        <StyledDiv>
          <ContextTextDiv to="/chat/companyview">직장 채팅방</ContextTextDiv>
        </StyledDiv>
      </ChatListbox>
      <ChatBox>
        <ContextTextDiv to="/board">게시판으로 이동하기</ContextTextDiv>
      </ChatBox>
      {/* <BarChart data={new_data} /> */}
    </>
  );
}

export default withRouter(ChatMain);
