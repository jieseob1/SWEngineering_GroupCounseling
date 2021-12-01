import React, { useState } from "react";
// import BoardSubmit from "../Section/BoardSubmit";
// import axios from "axios";
// import BoardInput from "../Section/BoardInput";
// import BoardTextarea from "../Section/BoardTextarea";
// import Header from "../../Common/Header";

// 채팅방 만들기-> 이부분은 내용 넣는게 아니라 제목만 넣는다
const MakeChattingRoom = ({ match }) => {
  const userFrom = localStorage.getItem("userId");
  const writerFrom = localStorage.getItem("userNickname"); // writerFrom은 userNickname 관련
  const [WriterIcon, setWriterIcon] = useState(true);
  const [BoardWriter, setBoardWriter] = useState("익명"); //게시판 적는 사람 이름
  const [inputs, setInput] = useState({
    boardTitle: "",
    boardContent: "",
  });
  const { boardTitle, boardContent } = inputs;

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
        // 여기서 다시 board/view로 돌아가는 부분
      } else {
        alert("게시글 업로드에 실패하였습니다.");
      }
    });
  };

  //

  console.log();
  const onChange = (e) => {
    const { value, name } = e.target;
    setInput({
      ...inputs, //spread 함수
      [name]: value,
    });
  };

  // 익명 관련
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

  return (
    <>
      <Header title="게시글 작성" link="/board" backbutton={false} />
      <BoardSubmit
        onSubmit={onSubmit}
        BoardInput={BoardInput}
        boardTitle={boardTitle}
        onChange={onChange}
        BoardTextarea={BoardTextarea}
        boardContent={boardContent}
        WriterIcon={WriterIcon}
        onIconClick={onIconClick}
      />
    </>
  );
};

export default MakeChattingRoom;
