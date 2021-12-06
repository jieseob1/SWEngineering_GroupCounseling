import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Board from "./pages/Board";
import MyPage from "./pages/MyPage";
import Chat from "./pages/Chat";

const Container = styled.div`
  margin: 10px auto;
  width: 370px;
`;

function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/register" component={Register} />
          <Route authenticated path="/board" component={Board} />
          {/* <Route path="/board/:boardId" component={Auth(BoardDetail, true)} /> */}
          <Route path="/chat" component={Chat} />
          <Route path="/mypage" component={MyPage} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
