// frontend/pages/Initiation.tsx
"use client";
import React, { useEffect, useState } from 'react';
import styles from './Initiation.module.css';
import { Dashboard } from '../Dashboard';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Title } from '../Title';
import { Container, Icon, Paragraph, Spacer } from '@adoxdesarrollos/designsystem-2';
import { io, Socket } from 'socket.io-client';
import { ServersFallen } from '../ServersFallen';
import dotenv from 'dotenv';


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
    // Carga las variables de entorno
    dotenv.config();
    const socket: Socket = io(process.env.NEXT_PUBLIC_BACK_URL as string); // Cambiar esto....


    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('data', (newData: Data[]) => {
      setData(newData);
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.cube}>
            <div className={`${styles.face} ${styles.front}`}></div>
            <div className={`${styles.face} ${styles.back}`}></div>
            <div className={`${styles.face} ${styles.right}`}></div>
            <div className={`${styles.face} ${styles.left}`}></div>
            <div className={`${styles.face} ${styles.top}`}></div>
            <div className={`${styles.face} ${styles.bottom}`}></div>
          </div>
        </div>
        <Spacer size="extra-large"/>
        <Spacer size="extra-large"/>
        <div className={styles.loading}>
          <Paragraph className={styles.text}>
            <Icon name='chevronLeft' size="small"/>
            Cargando contenedores
            <Icon name='chevronRight' size="small"/>
            </Paragraph>
          <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
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
};

export default Initiation;
