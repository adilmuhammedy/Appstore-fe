import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";
import TesterNavbar from "./Components/TesterNavbar";
import "./Myapps.css";
import submitIcon from "./icons/Submit_icon.png";
import analysisIcon from "./icons/analysis_icon.png";
import approveIcon from "./icons/approve-icon.png";
import rejectIcon from "./icons/reject-icon.png"
import PrimaryButton from "./Components/PrimaryButton";

function Myapps() {
  const [apps, setApps] = useState([]);
  const [appIcons, setAppIcons] = useState({});
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const newApp = () => {
    navigate("../Upload");
  };

  const extractValue = (dynamoDBItem) => {
    const extractedItem = {};
    for (const key in dynamoDBItem) {
      extractedItem[key] = dynamoDBItem[key].S; // Assuming all attributes are of type 'S' (string)
    }
    return extractedItem;
  };

 
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/app/getApps");
        const extractedApps = response.data.map((app) => extractValue(app));
        setApps(extractedApps);
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }

    fetchData();
  }, []);

 
  useEffect(() => {
    async function fetchAppIcons() {
      try {
        const iconPromises = apps.map(async (app) => {
          try {
            const iconResponse = await axios.get(`http://localhost:4000/app/icons/${app.app_id}`);
            return { app_id: app.app_id, iconUrl: iconResponse.data[0].url };
          } catch (error) {
            console.error(`Error fetching icon for app ${app.app_id}:`, error);
            return { app_id: app.app_id, iconUrl: null };
          }
        }); 
        const icons = await Promise.all(iconPromises);
        const iconMap = icons.reduce((acc, { app_id, iconUrl }) => {
          acc[app_id] = iconUrl;
          return acc;
        }, {});

        setAppIcons(iconMap);
      } catch (error) {
        console.error("Error fetching app icons:", error);
      }
    }

    if (apps.length > 0) {
      fetchAppIcons();
    }
  }, [apps]);
  useEffect(() => {
    async function main() {
      try {
        for (const app of apps) {
          console.log(`appname of current processing:`, app.appname);
          await processApp(app);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (apps.length > 0) {
      main();
    }
  }, [apps]);

  async function processApp(app) {
    try {
      const apkfile = await fetchapk(app.app_id);
      // console.log(`apk file ${app.appname}`, apkfile);
      const apkBlob = await fetchBlobFromUrl(apkfile.url);
      // console.log(`apk file of ${app.appname}`, apkfile.url);
      const fileName = apkfile.key.split("/").pop(); // Extract the file name from the key
      const apkFile = new File([apkBlob], fileName, { type: apkBlob.type });
      const hashVal = await mobsfUpload(apkFile);
      // console.log(`hash value of ${app.appname}`, hashVal);
      const hashvalresp = await sendhashvalue(app.app_id, hashVal);
      // console.log(`hash value response`, hashvalresp);
      const jsonReport = await mobsfjsonReport(hashVal);
      // console.log(`json report of ${app.appname}`, jsonReport);
      const savejsonReportresponse = await sendjsonReport(app.app_id, jsonReport);
      console.log(`Everything done for ${app.appname}`, savejsonReportresponse);
    } catch (error) {
      console.error(`Error processing app ${app.appname}:`, error);
    }
  }


  async function fetchBlobFromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the APK content");
      }
      return await response.blob();
    } catch (error) {
      console.error("Error fetching blob from URL:", error);
      return null;
    }
  }

  async function fetchapk(app_id) {
    try {
      const response = await fetch(`http://localhost:4000/app/fetchapkfile/${app_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch apk file");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching queue data:", error);
      // Handle error
      return [];
    }
  }

  async function sendjsonReport(app_id, jsonReport) {
    const data = {
      app_id,
      jsonReport,
    };
    try {
      const response = await axios.post(`http://localhost:4000/mobsf/savejson`, data);
      return response.data; // Assuming you want to return data from the backend
    } catch (error) {
      throw new Error(error);
    }
  }

  async function sendhashvalue(app_id, hashvalue) {
    const data = {
      app_id,
      hashvalue,
    };
    try {
      const response = await axios.post("http://localhost:4000/mobsf/savehashvalue", data);
      return response.data; // Assuming you want to return data from the backend
    } catch (error) {
      throw new Error(error);
    }
  }

  // Mobsf API calls

  async function mobsfUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
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
    formData.append("hash", hashValue);
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
    formData.append("hash", hashValue);
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
    navigate(`../AppDetails/`, { state: { app_id: app_id } });
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
          {apps.map((app, index) => {
           const iconUrl = appIcons[app.app_id];
            return (
              <div
                id="applists"
                className="app-item p-8 border border-gray-300 rounded-lg shadow-md mb-8 cursor-pointer transform transition-transform duration-300 hover:scale-105 ml-auto"
                key={index}
                onClick={() => viewAppDetails(app.app_id)}
              >
                <h3 className="app-name text-base font-bold">{app.appname}</h3>
                {iconUrl && <img src={iconUrl} className="appicon" alt=""  />} 
                <p className="app-category">Category: {app.category_id}</p>
                <p className="app-status">Status: {app.status}</p>
                {app.status === "Submitted" ? (
                  <img src={submitIcon} id="submit_icon" alt="Submit Icon" />
                ) : null}
                {app.status === "Analyzed" ? (
                  <img src={analysisIcon} id="submit_icon" alt="Submit Icon" />
                ) : null}
                  {app.status === "Approved" ? (
                  <img src={approveIcon} id="submit_icon" alt="Submit Icon" />
                ) : null}
                     {app.status === "Rejected" ? (
                  <img src={rejectIcon} id="submit_icon" alt="Submit Icon" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Myapps;
