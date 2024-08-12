"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContainerCard from './ContainerCard'; // Asegúrate de la ruta correcta

type Port = {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
};

type Container = {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: Port[];
};

const Dashboard = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        setContainers(response.data); // Ajusta según la estructura de tu respuesta
      } catch (error) {
        console.error("Error fetching containers:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {containers.map(container => (
        <ContainerCard key={container.id} container={container} />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: '16px',
  },
};

export default Dashboard;
