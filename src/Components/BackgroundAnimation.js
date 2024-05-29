import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
  const [apps, setApps] = useState([]);
  const [appIcons, setAppIcons] = useState({});

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

  return (
    <ul className="background">
      {Array.from({ length: 24 }).map((_, index) => (
        <li key={index}></li>
      ))}
    </ul>
  );
};

export default BackgroundAnimation;
