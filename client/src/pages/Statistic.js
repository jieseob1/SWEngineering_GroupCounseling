import React from "react";
import { withRouter } from "react-router-dom";
import BarChart from "../components/Chat/Section/BarChart";
const Statistic = () => {
  const data = [
    {
      date: "9/11",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/12",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/13",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/14",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/15",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/16",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/17",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/18",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/19",
      positive: 10,
      negative: 10,
    },
    {
      date: "9/20",
      positive: 10,
      negative: 10,
    },
  ];

  let startData = data.slice(0, 2);
  let endData = data.slice(data.length - 3, data.length);
  let new_data = [];

  Object.values(startData).forEach((item) => {
    new_data.push(item);
  });
  Object.values(endData).forEach((item) => {
    new_data.push(item);
  });

  return <BarChart data={new_data} />;
};

export default withRouter(Statistic);
