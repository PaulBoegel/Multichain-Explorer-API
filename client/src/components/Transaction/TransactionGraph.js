import React, {useRef, useEffect, useState} from "react";
import PropTypes, { number } from "prop-types";
import { select } from "../../../node_modules/d3-selection/dist/d3-selection";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "../../../node_modules/d3-force/dist/d3-force";
import { zoom } from "../../../node_modules/d3-zoom/dist/d3-zoom";
import { drag } from "../../../node_modules/d3-drag/dist/d3-drag";

const TransactionGraph = (props) => {
  const svgRef = useRef();
  const [simulation, setSimulation] = useState(forceSimulation);
  let g;

  useEffect(() => {
      createSVG(svgRef.current)
  }, [props.nodes.length])

  function createSVG(svg){
      const parent = select(".transaction-graph").node();
      const parentWidth = parent.getBoundingClientRect().width;
      const parentHeight = parent.getBoundingClientRect().height;
      let height = parentHeight;
      let width = parentWidth;

      g = select(svg)
      .attr("width", width)
      .attr("height", height)
      .call(zoom().on("zoom", handleZoom))
      .select(".plot-area")
      .attr("transform", props.transform);

      g.html("");

      g.selectAll("line")
      .data(props.links)
      .join("line")
      .style("stroke", "#aaa")
      .attr("stroke-width", 3)

      g.selectAll("circle")
      .data(props.nodes)
      .join("circle")
      .attr("r", 15)
      .attr("id", function(d) {return `node-id-${d.id}`; })
      .style("fill", "#69b3a2")
      .attr("stroke-width", 3)
      .attr("stroke", "#aaa")

      select("#node-id-0")
      .style("fill", "#517a92");

      setSimulation(forceSimulation(props.nodes)
      .alphaMin(0.8)
      .force("link", forceLink()
        .id((d) => d.id )
        .links(props.links)
      )
      .force("charge", forceManyBody().strength(-400))
      .force("center", forceCenter(width / 2, height / 2))
      .on("tick", () => {
        g
        .selectAll("line")
        .attr("x1", link => link.source.x )
        .attr("y1", link => link.source.y )
        .attr("x2", link => link.target.x )
        .attr("y2", link => link.target.y );

        g
        .selectAll("circle")
        .on("mouseover", handleNodeMouseOver)
        .on("mouseout", handleNodeMouseOut)
        .on("click", props.onNodeMouseClick)
        // .call(drag()
        //   .on("start", handleDragStart)
        //   .on("drag", handleDrag)
        //   .on("end", handleDragEnd)
        // )
        .attr("cx", node => node.x )
        .attr("cy", node => node.y )
      }));
  }

  function handleZoom({transform}){
    g.attr("transform", transform);
    props.onHandleZoom(transform);
  }

  // function handleDragStart(event, d){
  //   if (!event.active) simulation.alphaTarget(.03).restart();
  //   d.fx = d.x;
  //   d.fy = d.y;
  // }

  // function handleDrag(event, d){
  //   d.fx = event.x;
  //   d.fy = event.y;
  // }

  // function handleDragEnd(event, d){
  //   if (!event.active) simulation.alphaTarget(.03);
  // }

  function handleNodeMouseOver () {
    select(this)
    .attr("stroke-width", 3)
    .attr("stroke", "#517a92");
  }

  function handleNodeMouseOut() {
    select(this)
    .attr("stroke-width", 3)
    .attr("stroke", "#aaa");
  }

  return (
    <div
    className="transaction-graph"
    style={{
      width: "100%"
    }}>
    <svg
      ref={svgRef}
    >
      <g className="plot-area"></g>
    </svg>
    </div>
  );
};

TransactionGraph.propTypes = {
  className: PropTypes.string,
  onNodeMouseClick: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      source: number,
      target: number
    })
  )
};

export default TransactionGraph;
