import React from "react";
import { useDispatch } from "react-redux";

import { authActions } from "app/redux/actions";

import { HomeContainer } from "./Home.styled";

export default () => {
  const dispatch = useDispatch();

  return (
    <HomeContainer>
      <div>Hello from ArDrive</div>
      <button onClick={() => dispatch(authActions.logout())}>Logout</button>
    </HomeContainer>
  );
};
