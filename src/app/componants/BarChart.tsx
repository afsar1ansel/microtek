"use client";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { getRelativePosition } from "chart.js/helpers";

// Register necessary components for "bar" chart
Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

export default function BarChart() {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"bar", number[], string> | null>(null);

  const [graphData, setGraphData] = useState({
    currentDayCountFileUpload: 2,
    lastWeekCountFileUpload: 10,
    lastMonthCountFileUpload: 6,
    lastThreeMonthsCountFileUpload: 4,
  });

  async function fetcherFun() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(
        `${baseURL}/app/duration-wise/count-upload/${token}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setGraphData(data);
      // console.log(data, "graphData" , graphData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetcherFun();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const data = {
      labels: ["Today", "Last Week", "Last Month", "Last 3 Months"],
      datasets: [
        {
          label: "File Uploads",
          data: [
            graphData.currentDayCountFileUpload,
            graphData.lastWeekCountFileUpload,
            graphData.lastMonthCountFileUpload,
            graphData.lastThreeMonthsCountFileUpload,
          ],
          backgroundColor: [
            "rgba(0, 181, 98, 0.2)",
            "rgba(0, 181, 98, 0.4)",
            "rgba(0, 181, 98, 0.5)",
            "rgba(0, 181, 98, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      onClick: (event: any, elements: any[], chart: any) => {
        if (!chart) return;

        if (elements.length > 0) {
          const canvasPosition = getRelativePosition(event, chart);
          const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

          console.log(`X: ${dataX}, Y: ${dataY}`);
        }
      },
    };

    if (chartRef.current) {
      // If the chart already exists, update its data
      chartRef.current.data = data;
      chartRef.current.update();
    } else {
      // Create a new chart if it doesn't exist
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options as any,
      });
    }

    // Cleanup chart instance on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [graphData]); // This effect runs whenever graphData changes

  return (
    <div>
      <canvas ref={canvasRef} width="100px" height="100px"></canvas>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0px",
        }}
      >
        <button
          style={{ padding: "10px 1.56vw", border: "none", fontSize: "12px" }}
        >
          
        </button>
        <button
          style={{ padding: "10px 1.56vw", border: "none", fontSize: "12px" }}
        >
          
        </button>
        <button
          style={{ padding: "10px 1.56vw", border: "none", fontSize: "12px" }}
        >
        
        </button>
        <button
          style={{ padding: "10px 1.56vw", border: "none", fontSize: "12px" }}
        >
        </button>
      </div>
    </div>
  );
}
