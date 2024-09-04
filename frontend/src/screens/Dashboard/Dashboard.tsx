"use client";
import React from 'react';
import styles from './Dashboard.module.css';
import { Container } from '@adoxdesarrollos/designsystem-2';
import { Information } from '../Information';

type Volumes = {
  id: string;
  name: string;
  status: string;
  snapshots: [];
};

type DataProps = {
  volume: Volumes[];
};

const Dashboard: React.FC<DataProps> = ({ volume }) => {

  return (
    <Container customClassNames={styles.container}>
      {volume.map((container, index) => (
        <Information key={index} data={container} />
      ))}
    </Container>
  );
};

export default Dashboard;
