import React from "react";
import { BrowserRouter as Route } from "react-router-dom";
import ChatDetail from "../components/Chat/ChatDetail";
import ChatView from "../components/Chat/ChatView";
const Chat = ({ match }) => {
  return (
    <>
      <Route
        exact
        path={`${match.path}/:view/:detail`}
        component={ChatDetail}
      />
      <Route path={`${match.path}/:view`} component={ChatView} />
    </>
  );
};

export default Chat;
