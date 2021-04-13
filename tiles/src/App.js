// import logo from './logo.svg';
// import './App.css';
// import { useState } from "react";
import "./styles.css";
import Tiles from "./components/tiles";

export const getInitialData = (mode) => {
  const getColorArrs = (mode) => {
    const colors = [
      "red",
      "blue",
      "green",
      "orange",
      "pink",
      "purple",
      "brown",
      "yellow"
    ];
    const arr = Array((mode[0] * mode[1]) / 2)
      .fill(0)
      .map(
        (_, i) => colors[i] || colors[Math.floor(Math.random() * colors.length)]
      );
    const arr2 = [].concat(arr).concat(arr);
    const getArrInds = () => {
      const set = new Set();
      while (set.size < arr2.length) {
        set.add(Math.floor(Math.random() * Math.floor(arr2.length)));
      }
      return [...set];
    };
    const inds = getArrInds(); // [1, 0, 3, 2]
    const randArr = [];
    arr2.forEach((_, i) => {
      randArr[i] = arr2[inds[i]];
    });
    const colorsArr = [];
    let colorRow = [];
    randArr.forEach((item) => {
      colorRow.push(item);
      if (colorRow.length === mode[1]) {
        colorsArr.push(colorRow);
        colorRow = [];
      }
    });
    return colorsArr;
  };

  const openedTiles = (mode) => [
    ...Array(mode[0])
      .fill(1)
      .map((el) => [])
  ];
  const col = getColorArrs(mode);

  return {
    // mode: [3, 2],
    mode,
    // openedTiles: [[], [], []],
    openedTiles: openedTiles(mode),
    act: [[], []],
    round: 1,
    color: col
  };
};


export default function App() {
  console.log("Appp");
  const options = [
    [2, 2],
    [3, 2],
    [4, 4],
    [6, 6],
    [8, 8]
  ];
  const mode = options[0];
  const initial = getInitialData(mode);
  return (
    <>
      <Tiles initialData={getInitialData} initial={initial} options={options} />
    </>
  );
}
