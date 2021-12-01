import React from "react";
import { BrowserRouter as Route } from "react-router-dom";
import ChatDetail from "../components/Chat/ChatDetail";
const Chat = ({ match }) => {
  return (
    <>
      <Route exact path={`${match.path}/:detail`} component={ChatDetail} />
    </>
  );
};

export default Chat;
