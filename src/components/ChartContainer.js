import React from "react";
import "../scss/ChartContainer.scss"

const Title = props => <h3 className="chart__title">{props.title}</h3>;
const Subtitle = props => <h4 className="chart__subtitle">{props.subtitle}</h4>;
const ChartContainer = props => (
  <div className="chart">
    <div className="chart__meta-container">
      { props.title ? <Title title={props.title} /> : null}
      { props.subtitle ? <Subtitle subtitle={props.subtitle} /> : null }
    </div>
    <div className="chart__figure">{props.children}</div>
  </div>
);

export default ChartContainer;
