import React from "react";
import { useReducer } from "react";
import DigitButton from "./digitButton";
import OperationButton from "./operationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPR_ACT: "choose-operation",
  CLEAR: "clear",
  DEL_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPR_ACT:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.prevOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        prevOperand: null,
        operation: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };

    case ACTIONS.DEL_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function evaluate({ currentOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "x":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
}

export default function App() {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
