import React from "react";
import { ACTIONS } from "../src/App";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPR_ACT, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
