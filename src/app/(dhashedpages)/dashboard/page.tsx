// import Image from "next/image";
"use client";
import styles from "./page.module.css";

import { TbDeviceAnalytics } from "react-icons/tb";
import { RiUser3Line } from "react-icons/ri";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineCloudUpload } from "react-icons/ai";
import BarChart from "@/app/componants/BarChart";
import LineChart from "@/app/componants/LineChart";
import PieChart from "@/app/componants/PieChart";

import { useMyContext } from "@/app/context/MyContext";
import { useEffect, useState } from "react";

export default function Home() {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [totalDeviceRegistored, setTotalDeviceRegistored] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalnumberscanned, setTotalnumberscanned] = useState(0);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    fetchstatedata();
    fetchtotalscannedDev();
    const name =
      typeof window !== "undefined"
        ? localStorage.getItem("username") ?? "Admin"
        : "Admin";
    setAdminName(name);
  }, []);

  useEffect(() => {
    // Fetch the permit value from localStorage
    const permit =
      typeof window !== "undefined"
        ? localStorage.getItem("permits") ?? ""
        : "";
    // console.log("Permit from localStorage:", permit); // Debugging log

    // Redirect logic
    if (permit === "") {
      // If permit is not set, redirect to login
      console.warn("No permit found, redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }

    // Check if the user is a super admin (permit === "0")
    if (permit === "0") {
      // Super admin has access to all pages, so no need to redirect
      return;
    }

    // Check if the user has the required permission for the dashboard
    if (!permit.includes("2")) {
      // If the user doesn't have permission, redirect to login
      console.warn("User does not have permission, redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }
  }, []);


  async function fetchtotalscannedDev(){
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

      try{
        const res = await fetch(
          `${baseURL}/app/reports/total-device/${token}`,
          { method: "GET" }
        );

        const data = await res.json();
        // console.log(data);
        setTotalnumberscanned(data.no_of_devices_till_date);
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
  }

  const fetchstatedata = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(`${baseURL}/dashboard/cards-data/${token}`, {
        method: "GET",
      });

      const data = await response.json();

      setTotalDeviceRegistored(data.totalDevices);
      setActiveUsers(data.activeUsers);
      setTotalUpload(data.totalReportUploadedToday);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hello}>
        <h3>👋 Hello, {adminName}</h3>
        <p>Here is all your analytics overview</p>
      </div>

      <div className={styles.statesContainer}>
        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>TOTAL DEVICES REGISTERED</p>
            <h2>{totalDeviceRegistored}</h2>
            {/* <p className={styles.measure}>↑ 3.5% Increase</p> */}
          </div>
          <div className={styles.stateIcon}>
            <TbDeviceAnalytics size={28} />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>ACTIVE USERS</p>
            <h2>{activeUsers}</h2>
            {/* <p className={styles.measure} style={{ color: "red" }}>
              ↑ 3.5% Increase
            </p> */}
          </div>
          <div className={styles.stateIcon}>
            <RiUser3Line size={28} />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>REPORTS UPLOADED TODAY</p>
            <h2>{totalUpload}</h2>
            {/* <p className={styles.measure}>↑ 3.5% Increase</p> */}
          </div>
          <div className={styles.stateIcon}>
            <AiOutlineCloudUpload size={28} />
          </div>
        </div>

        <div className={styles.stateBox}>
          <div className={styles.stateText}>
            <p>TOTAL NO OF UPLOADS</p>
            <h2>{totalnumberscanned}</h2>
            {/* <p className={styles.measure}>↑ 3.5% Increase</p> */}
          </div>
          <div className={styles.stateIcon}>
            <IoMdPaper size={28} />
          </div>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.bChart}>
          <div>
            <p style={{ marginBottom: "4px" }}>Data Uploads</p>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <h1>159</h1> <p style={{ color: "green" }}>230%</p>
            </div> */}
          </div>
          <BarChart />
        </div>
        <div className={styles.bChart}>
          <div>
            <p style={{ marginBottom: "4px" }}>Reports Generated</p>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <h1>09</h1> <p style={{ color: "green" }}>90%</p>
            </div> */}
          </div>
          <LineChart />
        </div>
        {/* <div className={styles.bChart}>
          <div>
            <p style={{ marginBottom: "60px" }}>Device Activity</p>
          </div>
          <PieChart />
        </div> */}
      </div>
    </div>
  );
}
