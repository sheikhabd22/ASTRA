import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import data from "./cansat.csv";
import "./App.css";
import { FullScreenSpin, SummarySpin } from "./FSSpin";

const SpinChart = (props) => {
  const [fullScreenModalState, setFullScreenModalState] = useState(false);

  const chartRef = useRef(null);
  const refreshMe = props.refreshMe;

  useEffect(() => {
    d3.csv(data, (d) => ({
      time: parseInt(d.time_stamping),
      spin: parseFloat(d.gyro_spin_rate),
    })).then((dataset) => {
      const slicedData = dataset.slice(-15);
      if (!refreshMe) {
        return;
      }

      const width = 240;
      const height = 150;

      d3.select(chartRef.current).select("svg").remove();
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height + 100)
        .append("g")
        .attr("transform", `translate(42,18)`);

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(slicedData, (d) => d.time))
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(slicedData, (d) => d.spin)])
        .range([height, 0]);

      const line = d3
        .line()
        .x((d) => xScale(d.time))
        .y((d) => yScale(d.spin));

      svg
        .append("path")
        .datum(slicedData)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none") // Set fill to none for the line path
        .style("stroke", "steelblue")
        .style("stroke-width", "2");
      svg
        .append("text")
        .attr("x", 95)
        .attr("y", 185)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Time");
      svg
        .append("text")
        .attr("x", 90)
        .attr("y", 33)
        .attr("transform", "rotate(90)")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Spin Rate");

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g").call(d3.axisLeft(yScale));
    });
  }, [refreshMe]);

  return (
    <>
      <button
        id="myBtnSpin"
        className="modal-button"
        onClick={launchSummaryMode}
      >
        <i
          class="fa fa-arrows-alt"
          style={{
            top: "-205px",
            position: "relative",
            color: "white",
            left: "210px",
          }}
        ></i>
      </button>
      <button
        id="myBtnS"
        className="modal-button"
        onClick={launchFullScreenMode}
      >
        <i
          class="fa fa-play"
          style={{
            top: "-205px",
            position: "relative",
            left: "0px",
            color: "white",
          }}
        ></i>
      </button>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div ref={chartRef}></div>
      <FullScreenSpin toggle={fullScreenModalState} slice={false} />
      <SummarySpin toggle={fullScreenModalState} slice={false} />
    </>
  );
  function launchFullScreenMode() {
    const modal = document.getElementById("myModalS");
    modal.style.display = "block";
    modal.style.zIndex = 9999;
    const modalback = document.getElementById("modalS");
    modalback.style.display = "block";
    modal.style.zIndex = 1;
  }
  function launchSummaryMode() {
    const modal = document.getElementById("myModalSpin");
    modal.style.display = "block";
    modal.style.zIndex = 9999;
    const modalback = document.getElementById("modalSpin");
    modalback.style.display = "block";
    modal.style.zIndex = 1;
  }
};

export default SpinChart;
