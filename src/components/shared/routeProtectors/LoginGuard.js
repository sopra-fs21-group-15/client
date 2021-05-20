import React from "react";
import { Redirect } from "react-router-dom";

export const LoginGuard = props => {
  if (!localStorage.getItem("username")) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /mainScreen
  return <Redirect to={"/mainScreen"} />;
};
