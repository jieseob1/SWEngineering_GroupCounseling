import React from "react";
import { withRouter, Route } from "react-router-dom";
import ChatDetail from "../components/Chat/ChatDetail";
import ChatView from "../components/Chat/ChatView";
import ChatMain from "../components/Chat/ChatMain";

const Chat = ({ match }) => {
  return (
    <>
      <Route exact path={match.path} component={ChatMain} />
      <Route exact path={`${match.path}/:view`} component={ChatView} />
      <Route
        exact
        path={`${match.path}/:view/:detail`}
        component={ChatDetail}
      />
    </>
  );
};

export default withRouter(Chat);
