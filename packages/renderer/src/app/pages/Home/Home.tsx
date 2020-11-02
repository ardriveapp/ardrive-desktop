import React from "react";
import { useDispatch } from "react-redux";

import { authActions } from "app/redux/actions";

import { MainContainer } from "app/components";

export default () => {
  const dispatch = useDispatch();

  return (
    <MainContainer>
      <div>Hello from ArDrive</div>
      <button onClick={() => dispatch(authActions.logout())}>Logout</button>
    </MainContainer>
  );
};
