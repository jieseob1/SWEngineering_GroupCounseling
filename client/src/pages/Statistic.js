import React from "react";
import { withRouter } from "react-router-dom";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const Statistic = () => {
  return (
    <div>
      <Line
        data={{
          labels: ["sun", "mon", "tue", "wed", "thur", "fri", "sat"],
          datasets: [
            {
              label: "My First Dataset",
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        }}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};

export default withRouter(Statistic);
