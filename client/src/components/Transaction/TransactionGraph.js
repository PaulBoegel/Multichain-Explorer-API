import React, {useRef, useEffect, useState} from "react";
import PropTypes, { number } from "prop-types";
import { select } from "../../../node_modules/d3-selection/dist/d3-selection";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "../../../node_modules/d3-force/dist/d3-force";
import { zoom } from "../../../node_modules/d3-zoom/dist/d3-zoom";
// import { drag } from "../../../node_modules/d3-drag/dist/d3-drag";

const TransactionGraph = (props) => {
  const svgRef = useRef();
  const [simulation, setSimulation] = useState(forceSimulation);
  const [tooltip, setTooltip] = useState(select);
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

      if(props.activeNode.id > 0)
        setParent(props.activeNode);

      setTooltip(select(".node-tooltip")
        .style("visibility", "hidden")
      )

      g = select(svg)
      .attr("width", width)
      .attr("height", height)
      .call(zoom().on("zoom", handleZoom))
      .on("dblclick.zoom", null)
      .select(".plot-area")
      .attr("transform", props.transform);

      g.html("");

      g.selectAll("line")
      .data(props.links)
      .join("line")
      .style("stroke", link => link.active ? "#e59379" : "#aaa")
      .attr("stroke-width", 3)

      g.selectAll("circle")
      .data(props.nodes)
      .join("circle")
      .attr("r", 15)
      .attr("id", function(d) {return `node-id-${d.id}`; })
      .style("fill", circle => circle.active ? "#517a92" : "#69b3a2")
      .attr("stroke-width", 3)
      .attr("stroke", circle => circle.active ? "#e59379" : "#aaa")
      .on("mouseover", handleNodeMouseOver)
      .on("mouseout", handleNodeMouseOut)
      .on("click", props.onNodeMouseClick)

      select("#node-id-0")
      .style("fill", "#517a92");

      setSimulation(forceSimulation(props.nodes)
      .alphaMin(0.8)
      .force("link", forceLink()
        .id((d) => d.id )
        .links(props.links)
        .distance(50)
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
        // .call(drag()
        //   .on("start", handleDragStart)
        //   .on("drag", handleDrag)
        //   .on("end", handleDragEnd)
        // )
        .attr("cx", node => node.x )
        .attr("cy", node => node.y )
      }));
  }

  const setParent = (activeNode) => {
    let findParent = props.links.find(link => link.source === activeNode.id)

    if(findParent === undefined) {
      findParent = props.links.find(link => link.source.id === activeNode.id);
      props.nodes[activeNode.id].parent = props.nodes[findParent.target.id];
      activateParents(props.nodes[activeNode.id]);
      return;
    }

    const parent = props.nodes[findParent.target];
    props.nodes[activeNode.id].parent = parent;
    props.nodes[activeNode.id].parent.active = true;
    const activeLink = props.links.find(link => (
      link.source === activeNode.id &&
      link.target == parent.id
    ));
    activeLink.active = true;
  }

  const activateParents = (currentNode) => {
    if(currentNode.parent){
      const activeLink = props.links.find(link => (
        link.source.id === currentNode.id &&
        link.target.id == currentNode.parent.id
      ))
      activeLink.active = true;
      currentNode.parent.active = true;
      activateParents(currentNode.parent);
    }
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

    const id = parseInt(this.getAttribute("id").slice(8));
    const txid = props.nodes[id].name;

    tooltip
    .style("visibility", "visible")
    // .style("left", (this.getAttribute("cx") * 1.02)+"px")
    // .style("top", (this.getAttribute("cy") * 0.82)+"px")
    .text(txid)
    .style("color", "#fff")
  }

  function handleNodeMouseOut() {
    select(this)
    .attr("stroke-width", 3)
    .attr("stroke", circle => circle.active ? "#e59379" : "#aaa");

    tooltip
    .style("visibility", "hidden");
  }

  return (
    <>
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
    <div className="node-tooltip">de117955bfa1b95a0102936e3ad02fa8dc55e3046e52055fbef8fb1a4deb26ab</div>
    </>
  );
};

TransactionGraph.propTypes = {
  className: PropTypes.string,
  onNodeMouseClick: PropTypes.func.isRequired,
  transform: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    k: PropTypes.number
  }),
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
