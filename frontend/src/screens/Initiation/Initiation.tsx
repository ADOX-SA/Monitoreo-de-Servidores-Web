"use client";
import React, { useEffect, useState } from 'react';
import styles from './Initiation.module.css';
import { Dashboard } from '../Dashboard';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Title } from '../Title';
import { Container } from '@adoxdesarrollos/designsystem-2';
import axios from 'axios';
import { ServersFallen } from '../ServersFallen';

type Data = {
  id: string;
  name: string;
  status: string;
  snapshots: [];
};

const Initiation = () => {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <Container fullWidth>
        <Header/>
        <Title/>
        <ServersFallen volume={data}/>
        <Dashboard volume={data} />
        <Footer/>
    </Container>
  );
}

export default Initiation;
