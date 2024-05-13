import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";
import TesterNavbar from "./Components/TesterNavbar";
import "./Myapps.css";
import submitIcon from "./icons/Submit_icon.png";
import analysisIcon from "./icons/analysis_icon.png";
import PrimaryButton from "./Components/PrimaryButton";

function Myapps() {
  const fileToAppIdMap = {};
  const hashValToAppIdMap = {};
  const [apps, setApps] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const newApp = () => {
    navigate("../Upload");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/applist/getApp");
        setApps(response.data.apps);
        await main();
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }
    fetchData();
  }, []);

  async function main() {
    try {
      const queueData = await fetchapkfromQueue();
      // console.log(queueData);
      // Mapping app id to filename
      for (let i = 0; i < queueData.filesData.length; i++) {
        const fileName = queueData.filesData[i];
        const appId = queueData.appIds[i];
        fileToAppIdMap[fileName] = appId;
      }

      for (const file of queueData.filesData) {
        const serveFileLink = await filetolink(file);
        const responsefile = await fetch(serveFileLink);
        const hashVal = await mobsfUpload(new File([await responsefile.blob()], `${file}`));
        // console.log(hashVal);
        const hashvalresp = await sendhashvalue(hashVal, fileToAppIdMap[file]);
        // console.log(`hashvalresp `, hashvalresp);
        hashValToAppIdMap[fileToAppIdMap[file]] = hashVal;
        // console.log(`hash value of ${fileToAppIdMap[file]}`, hashValToAppIdMap[fileToAppIdMap[file]]);
        const scanResult = await mobsfScan(hashVal);
        const jsonReport = await mobsfjsonReport(hashVal);
        const savejsonReportresponse = await sendjsonReport(jsonReport, fileToAppIdMap[file]);
      }

      for (let i = 0; i < queueData.filesData.length; i++) {
        console.log(`hashvalue of ${fileToAppIdMap[queueData.filesData[i]]}`, hashValToAppIdMap[fileToAppIdMap[queueData.filesData[i]]]);
      }

      for (let i = 0; i < queueData.filesData.length; i++) {
        console.log(`file name of ${queueData.filesData[i]}`, fileToAppIdMap[queueData.filesData[i]]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function fetchapkfromQueue() {
    try {
      const response = await fetch("http://localhost:4000/fetchapk/fetchname");
      if (!response.ok) {
        throw new Error("Failed to fetch queue data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching queue data:", error);
      // Handle error
      return [];
    }
  }

  async function filetolink(filename) {
    try {
      const servefile = `http://localhost:4000/fetchapk/fetchfile/${filename}`;
      return servefile;
    } catch (error) {
      console.error("Error creating file link:", error);
      throw error;
    }
  }

  async function sendjsonReport(jsonReport, app_id) {

    const data = {
      jsonReport,
      app_id
    };
    console.log(jsonReport);
    try {
      const response = await axios.post("http://localhost:4000/save/savejson", data);
      return response.data; // Assuming you want to return data from the backend
    } catch (error) {
      throw new Error(error);
    }
  }
  async function sendhashvalue(hashvalue, app_id) {

    const data = {
      hashvalue,
      app_id
    };
    try {
      const response = await axios.post("http://localhost:4000/save/savehashvalue", data);
      return response.data; // Assuming you want to return data from the backend
    } catch (error) {
      throw new Error(error);
    }
  }

  // Mobsf API calls

  async function mobsfUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/upload", formData, {
        headers: {
          Authorization: `helo@123`,
          "Content-Type": `multipart/form-data`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to send file");
      }
      return response.data.hash;
    } catch (error) {
      console.error("Error sending file names:", error);
    }
  }

  async function mobsfScan(hashValue) {
    const formData = new FormData();
    formData.append('hash', hashValue);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/scan", formData, {
        headers: {
          Authorization: `helo@123`,
          "Content-Type": `multipart/form-data`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to scan the file");
      }
      return response.data;
    } catch (error) {
      console.error("Error scanning file:", error);
    }
  }

  async function mobsfjsonReport(hashValue) {
    const formData = new FormData();
    formData.append('hash', hashValue);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/report_json", formData, {
        headers: {
          Authorization: `helo@123`,
          "Content-Type": `multipart/form-data`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to generate the JSON report");
      }
      return response.data;
    } catch (error) {
      console.error("Error generating JSON report:", error);
    }
  }





  const viewAppDetails = (app_id) => {
    navigate(`../AppDetails/`, { state: { app_id: app_id, hashValue: hashValToAppIdMap[app_id] } });
  };

  return (
    <div className="myapps-bg">
      <div>
        {/* Conditional rendering based on the role */}
        {role === "developer" && <Navbar />}
        {role === "tester" && <TesterNavbar />}
      </div>
      {role === "developer" && (
        <div id="newappbtn" onClick={newApp}>
          <PrimaryButton buttonText="New App" />
        </div>
      )}
      <div className="app-container">
        <div className="header-section mb-8 m-8">
          <h1 className="text-3xl font-bold text-gray-800">MyApps</h1>
          <p className="text-base text-gray-600">
            Submitted apps will be listed here
          </p>
        </div>
        <div className="flex flex-wrap justify-right">
          {apps.map((app, index) => (
            <div
              id="applists"
              className="app-item p-8 border border-gray-300 rounded-lg shadow-md mb-8 cursor-pointer transform transition-transform duration-300 hover:scale-105  ml-auto"
              key={index}
              onClick={() => viewAppDetails(app.app_id)}
            >
              <h3 className="app-name text-base font-bold">{app.appname}</h3>
              <p className="app-category">Category: {app.category_id}</p>
              <p className="app-status">Status: {app.status}</p>
              {app.status === "Submitted" ? (
                <img src={submitIcon} id="submit_icon" alt="Submit Icon" />
              ) : null}
              {app.status === "Analyzed" ? (
                <img src={analysisIcon} id="submit_icon" alt="Submit Icon" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Myapps;
