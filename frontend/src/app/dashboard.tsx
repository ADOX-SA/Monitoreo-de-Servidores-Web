"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContainerCard from './ContainerCard';
import styles from './conteinerCard.module.css';

type Container = {
  name: string;
  state: string;
  cpu: string;
  memory: string;
  networkReceive: string;
  networkTransmit: string;
};

const Dashboard = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        const data = response.data;

        // Transformar los datos recibidos al formato esperado por el frontend
        const transformedData = data
          .filter((container: any) => container.name && container.cpu && container.memory && container.networkReceive && container.networkTransmit)
          .map((container: any) => ({
            name: container.name,
            state: container.state,
            cpu: parseFloat(container.cpu),
            memory: parseFloat(container.memory),
            networkReceive: parseFloat(container.networkReceive),
            networkTransmit: parseFloat(container.networkTransmit),
          }));
          
        setContainers(transformedData);
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
        <ContainerCard key={index} container={container} />
      ))}
    </div>
  );
};

export default Dashboard;
