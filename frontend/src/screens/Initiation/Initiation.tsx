"use client";
import React, { useEffect, useState } from 'react';
import styles from './Initiation.module.css';
import { Dashboard } from '../Dashboard';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Title } from '../Title';
import { Container, Spacer } from '@adoxdesarrollos/designsystem-2';
import axios from 'axios';

type Data = {
  id: string;
  name: string;
  status: string;
  snapshots: [];
};

const  Initiation = () => {
  const [data, setdata] = useState<Data[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        setdata(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container fullWidth>
        <Header/>
        <Spacer/>
        <Title/>
        <Dashboard volume={data} />
        <Spacer/>
        <Footer/>
    </Container>
  );
}

export default Initiation;
