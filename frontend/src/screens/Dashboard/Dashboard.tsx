"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from './Components/Card';
import styles from './Dashboard.module.css';

type Container = {
  name: string;
  state: string;
  status: string;
};

const Dashboard = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        setContainers(response.data);
      } catch (error) {
        console.error("Error fetching containers:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  
  return (
    <div className={styles.container}>
      {containers.map((container, index) => (
        <Card key={index} container={container} />
      ))}
    </div>
  );
};

export default Dashboard;
