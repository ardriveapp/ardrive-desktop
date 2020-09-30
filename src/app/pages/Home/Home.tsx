import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { appActions } from "../../redux/actions";
import { appSelectors } from "../../redux/selectors";
import { HomeContainer } from "./Home.styled";

export default () => {
  const dispatch = useDispatch();
  const counter = useSelector(appSelectors.getCounter);

  return (
    <HomeContainer>
      <div>Hello from ArDrive</div>
      <button onClick={() => dispatch(appActions.click())}>Click me</button>
      <div>{counter}</div>
    </HomeContainer>
  );
};
