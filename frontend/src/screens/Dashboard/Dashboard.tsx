"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from './Components/Card';
import styles from './Dashboard.module.css';
import { Container } from '@adoxdesarrollos/designsystem-2';

type Container = {
  id: string;
    name: string;
    status: string;
    snapshots: [];
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
    <Container customClassNames={styles.container}>
      {containers.map((container, index) => (
        <Card key={index} data={container} />
      ))}
    </Container>
  );
};

export default Dashboard;
