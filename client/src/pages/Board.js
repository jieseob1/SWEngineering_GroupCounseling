import React from "react";
import { Route, withRouter } from "react-router-dom";
import BoardDetail from "../components/Board/BoardDetail";
// 게시판 디테일
import BoardView from "../components/Board/BoardView";

function Board({ match }) { //app.js에서 확인 가능
  return (
    <>
      <Route exact path={match.path} component={BoardView} />
      {/* 제일 처음 보이는 부분은 boardView가 된다 */}
      <Route path={`${match.path}/:id`} component={BoardDetail} />
      {/* board/:id가 되며 boarddetail 부분으로 빠지게 된다 
      :id 부분이 params가 된다*/}
    </>
  );
}

export default withRouter(Board);
