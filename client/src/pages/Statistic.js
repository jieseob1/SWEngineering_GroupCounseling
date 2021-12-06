import React from "react";
import { withRouter } from "react-router-dom";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import BarChart from "../components/Chat/Section/BarChart";
const Statistic = () => {
  return <BarChart />;
};

export default withRouter(Statistic);
