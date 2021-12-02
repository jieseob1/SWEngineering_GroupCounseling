// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { ResponsivePie } from "@nivo/pie";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
// 차트 부분, 컴포넌트로 사용해서 보여주고 싶은 컴포넌트에서 사용한다.
const PieChart = ({ data }) => (
  <div style={{ height: "200px" }}>
    <ResponsivePie
      data={data}
      innerRadius={0.1}
      cornerRadius={3}
      activeInnerRadiusOffset={8}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "nivo" }}
      borderWidth={2}
      borderColor={{ from: "color", modifiers: [["darker", "0.2"]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextOffset={7}
      arcLinkLabelsTextColor="#000000"
      arcLinkLabelsOffset={-2}
      arcLinkLabelsStraightLength={36}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      arcLabelsSkipAngle={19}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", "3"]] }}
      legends={[]}
    />
  </div>
);

export default PieChart;
