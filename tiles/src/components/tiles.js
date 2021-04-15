import { useReducer, useMemo } from "react";
import { getInitialData } from "../App";

const getMapArr = (n) => {
  return Array(n)
    .fill(0)
    .map(() => []);
};
function reducer(state, action) {
  switch (action.type) {
    case "setActiveTiles": // active Tiles
      return { ...state, act: action.value };
    case "setOpen":
      return { ...state, openedTiles: action.value };
    case "setRound":
      return { ...state, round: action.value };
    case "setMode":
      return getInitialData(action.mode);
    case "reset":
      return {
        ...action.value,
        openedTiles: [
          ...Array(action.value.openedTiles.length)
            .fill(0)
            .map(() => [])
        ]
      };
    default:
      throw new Error();
  }
}

export default function Tiles({ initial, options }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const getColor = (ind0, ind1) => {
    return state.color[ind0][ind1];
  };

  const nextRound = () => {
    const win = isWin();
    dispatch({ type: "setRound", value: win ? state.round : ++state.round });
    dispatch({ type: "setActiveTiles", value: [[], []] });
  };

  const setActive = (arr) => {
    const colorAct = getColor(arr[0], arr[1]);
    const colorLast =
      Number.isInteger(state.act[0][0]) &&
      getColor(state.act[0][0], state.act[0][1]);

    if (colorAct === colorLast) {
      const newOpened = [...state.openedTiles];

      newOpened[arr[0]][arr[1]] = colorAct;
      newOpened[state.act[0][0]][state.act[0][1]] = colorAct;

      dispatch({ type: "setOpen", value: newOpened });
    }
    const newAct = Number.isInteger(state.act[0])
      ? [arr, state.act[0]]
      : [arr, []];
    dispatch({ type: "setActiveTiles", value: newAct });

    if (colorAct && colorLast) {
      setTimeout(nextRound, 100);
    }
  };

  const isSame = (ind0, ind1) =>
    state.act[0][0] === ind0 && state.act[0][1] === ind1;

  const isActiv = (ind0, ind1) => {
    // is active color
    return (
      (state.act[0][0] === ind0 && state.act[0][1] === ind1) ||
      (state.act[1][0] === ind0 && state.act[1][1] === ind1)
    );
  };
  const isOpen = (ind0, ind1) => {
    // is open the same color
    return state.openedTiles[ind0] && state.openedTiles[ind0][ind1];
  };
  const block = (ind0, ind1) => {
    return isOpen(ind0, ind1) || isSame(ind0, ind1) || isActiv(ind0, ind1);
  };

  const isWin = () => {
    let res = true;
    state.openedTiles.forEach((el) => {
      if (el.length < 2 || el.includes(undefined)) {
        res = false;
      }
    });
    return res;
  };

  const changeFunc = () => {
    const selectBox = document.getElementById("selectBox");
    const selectedValue = selectBox.options[selectBox.selectedIndex].value;
    const newMode = (selectedValue + "").split(",").map((el) => +el);
    dispatch({
      type: "setMode",
      mode: newMode
    });
  };

  const row = useMemo(() => getMapArr(state.mode[0]), [state.mode[0]]); // eslint-disable-line
  const col = useMemo(() => getMapArr(state.mode[1]), [state.mode[1]]); // eslint-disable-line

  return (
    <div className="App center">
      <div>
        <select
          id="selectBox"
          onChange={() => {
            changeFunc();
          }}
        >
          {options.map((item, i) => (
            <option value={item} key={i}>{`${item[0]} * ${item[1]}`}</option>
          ))}
        </select>
      </div>
      <span>
        {isWin() ? "YOU WIN /" : ""} ROUND: {state.round}
      </span>
      <table className="square center">
        <tbody>
          {row.map((_, ind0) => (
            <tr key={ind0}>
              {col.map((_, ind1) => (
                <td
                  key={ind1}
                  style={{
                    backgroundColor:
                      isActiv(ind0, ind1) || isOpen(ind0, ind1)
                        ? getColor(ind0, ind1)
                        : "grey",
                    outline: isActiv(ind0, ind1) ? "1px solid black" : ""
                  }}
                  data-ind0={ind0}
                  data-ind1={ind1}
                  data-color={getColor(ind0, ind1)}
                  onClick={() => {
                    if (block(ind0, ind1)) {
                      return false;
                    }
                    setActive([ind0, ind1]);
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isWin() && (
        <button
          onClick={() => {
            const value = getInitialData(state.mode);
            dispatch({
              type: "reset",
              value: value
            });
          }}
        >
          NEW GAME
        </button>
      )}
    </div>
  );
}
