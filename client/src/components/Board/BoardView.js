import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import StyledBox from "../Style/styledBox";
import AddBoard from "./Section/AddBoard";
import BoardInput from "./Section/BoardInput";
import CheckNickname from "./Section/CheckNickname";
import BoardTextarea from "./Section/BoardTextarea";
import UserProfile from "./Section/UserProfile";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import Pagination from "@material-ui/lab/Pagination";
import BoardSubmit from "./Section/BoardSubmit";
import WriteBoard from "./Section/WriteBoard";

const Profilebox = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
`;
const Profilebtn = styled.div`
  display: inline-block;
  width: 64px;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 12px 4px;
  font-size: 13px;
  line-height: 28px;
  color: #505050;
  pointer: cursor;
`;
/*제목과 내용 쓰는 칸 + submit 칸*/
const BoardForm = styled.form`
  position: relative;
  height: 165px;
  border: 1px solid #ddd;
  margin: 0px -1px;
  box-sizing: border-box;
`;
/*베스트 게시글 탭*/
const BestPostBox = styled.div`
  height: 110px;
  border-bottom: 1px solid #ddd;
`;
const StyledDiv = styled.div`
  color: #505050;
  text-align: left;
  margin-top: 10px;
  font-size: 13px;
  margin-left: 10px;
`;
const FlexBox = styled.div`
  display: flex;
  justify-content: start;
  margin: 0px 0px 0px 0px;
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
const PaginationBox = styled.div`
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
`;

function BoardView({ history, match }) {
  // 파라미터:history,match
  const userFrom = localStorage.getItem("userId");
  const writerFrom = localStorage.getItem("userNickname"); // writerFrom은 userNickname 관련
  const [totalPage, settotalPage] = useState(0); //전체 페이지 설정
  const [currentPage, setcurrentPage] = useState(1); //현재 페이지 설정
  const [WriterIcon, setWriterIcon] = useState(true);
  const [BoardWriter, setBoardWriter] = useState("익명"); //게시판 적는 사람 이름
  const [Content, setContent] = useState([]); //컨텐츠
  const [inputs, setInput] = useState({
    boardTitle: "",
    boardContent: "",
  });
  const { boardTitle, boardContent } = inputs;

  useEffect(() => {

    FetchBoard();
    console.log("fetch");
  }, [currentPage]);


  const FetchBoard = () => {
    axios
      .post("/communicate/view-chats", { page: currentPage }) //현재 페이지에 관련된 게시판들을 가져 온다
      .then((response) => {
        if (response.data.success) {
          setContent(response.data.boards); // 성공한경우 서버에서 준 데이터 안에 있는 게시판을 가지고 와서 세팅해줌
          settotalPage(Math.ceil(response.data.count / 5)); //소수점 이하를 반올림 한다 즉, 한페이지에 5개씩만 보여줄 예정인듯
        } else {
          alert("게시글을 보여줄 수 없습니다.");
        }
      });
  };

  // 
  const onRemove = (id) => {
    //
    setContent(Content.filter((Content) => Content._id !== id)); // 컨텐츠를 filter 함수를 통해 다시 재구성한다
    FetchBoard(); //게시판을 가지고 온다
  };

  const onChange = (e) => {
    const { value, name } = e.target;
    setInput({
      ...inputs, //spread 함수
      [name]: value,
    });
  };

  const onIconClick = () => {
    // 닉네임을 보여줄시, 익명으로 처리할지 보여주는 부분
    if (WriterIcon) {
      // writerIcon이 true이게 되면
      setWriterIcon(false); //writericon을 false로 설정하고
      setBoardWriter(writerFrom); //닉네임을 설정하게 된다
    } else {
      setWriterIcon(true); //writericon이 true가 되면 글쓴이의 아이콘이 보이지 않는다.
      setBoardWriter("익명");
    }
  };

  const onSubmit = (e) => {
    //제출하는 부분
    e.preventDefault();
    if (!boardTitle) {
      alert(`제목을 작성해주세요`);
      return;
    } else if (!boardContent) {
      alert(`내용을 작성해주세요`);
      return;
    } else if (boardContent.length > 300) {
      alert(`내용을 300자 이내로 작성해주세요`);
      return;
    }
    // 유효성 검증

    let variables = {
      userFrom: userFrom,
      boardTitle: boardTitle,
      boardContent: boardContent,
      boardWriter: BoardWriter,
    }; // variable에 필요한 변수들 넣고 post로 서버에 넘겨준다
    axios.post("/board/upload", variables).then((response) => {
      if (response.status === 200) {
        setInput({
          boardTitle: "",
          boardContent: "",
        });
        FetchBoard(); //게시글 보여주기
      } else {
        alert("게시글 업로드에 실패하였습니다.");
      }
    });
  };

  const handlePageChange = (e) => {
    //페이지 바꾸면 벌어지는 이벤트
    const currentPage = parseInt(e.target.textContent);
    setcurrentPage(currentPage); // ????
  };
  return (
    <>
      <Header title="자유게시판" link="/board" />
      <StyledBox backColor="#fafafa" padding="10px 0px" lineHeight="auto">
        <Profilebox>
          <UserProfile boardPage={true} />
          {/* userprofile 부분에 프로필과,아이디,학교등이 들어가게 된다. */}
        </Profilebox>

        {/* 글쓰기 부분 */}
        <WriteBoard link={"/board"} title={"글쓰기"} />
        <BoardSubmit BoardForm={BoardForm} onSubmit={onSubmit} BoardInput={BoardInput}
          boardTitle={boardTitle} onChange={onChange} BoardTextarea={BoardTextarea} boardContent={boardContent}
          WriterIcon={WriterIcon} onIconClick={onIconClick} />
        {/* 게시판submit부분 컴포넌트화 */}

        {/* 게시판 보여주는 부분 */}

        {Content && //아까 서버로 보낸 컨텐츠를 Content안에에다가 넣어주게 된다
          Content.map((board, index) => {
            return (
              <React.Fragment key={index}>
                <AddBoard // content 배열안에 id,user,time등 여러가지가 존재하고 그 관련된 부분들을 Addboard 컴포넌트안에 넣어준다
                  id={board._id}
                  user={board.userFrom._id}
                  time={board.createdAt}
                  writer={board.boardWriter}
                  title={board.boardTitle}
                  content={board.boardContent}
                  history={`${history}`}
                  onRemove={onRemove}
                />
              </React.Fragment>
            );
          })}

        <PaginationBox>
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            size="small"
            hidePrevButton
            hideNextButton
          />
          {/* 페이지네이션 하는 부분 */}
        </PaginationBox>
        <Footer />

      </StyledBox>
    </>
  );
}

export default withRouter(BoardView);
