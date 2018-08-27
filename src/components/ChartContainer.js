import React from "react";

const Title = title => <h1 className="chart__title">title</h1>;
const Subtitle = subtitle => <h2 className="chart__subtitle">subtitle</h2>;
const ChartContainer = props => (
  <div className="chart">
    <Title title={props.title} />
    <Subtitle subtitle={props.subtitle} />
    <div className="chart__figure">{props.children}</div>
  </div>
);

export default ChartContainer;
