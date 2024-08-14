import React from 'react';
import styles from './conteinerCard.module.css';

type Port = {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
};

type Metrics = {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  uptime: number;
};

type Container = {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: Port[];
  metrics: Metrics;
};

type ContainerCardProps = {
  container: Container;
};

const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>{container.name}</div>
      <p>Status: {container.status}</p>
      <p>Image: {container.image}</p>
      <p>CPU Usage: {container.metrics.cpuUsage.toFixed(2)}%</p>
      <p>Memory Usage: {(container.metrics.memoryUsage / 1e6).toFixed(2)} MB</p>
      <p>Disk Usage: {(container.metrics.diskUsage / 1e6).toFixed(2)} MB</p>
      <p>Network In: {(container.metrics.networkIn / 1e6).toFixed(2)} MB</p>
      <p>Network Out: {(container.metrics.networkOut / 1e6).toFixed(2)} MB</p>
      <p>Uptime: {(container.metrics.uptime / 3600).toFixed(2)} hours</p>
      <div>
        <h4>Ports:</h4>
        <ul>
          {container.ports.map((port, index) => (
            <li key={index}>
              {port.PublicPort} (Private: {port.PrivatePort})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContainerCard;
