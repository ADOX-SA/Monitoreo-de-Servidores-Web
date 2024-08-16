import React from 'react';
import styles from './conteinerCard.module.css';

// Tipo para el contenedor
type Container = {
  name: string;
  state: string;
  cpu: string; // Cambiado a string para manejar "N/A"
  memory: string; // Cambiado a string para manejar "N/A"
  networkReceive: string; // Cambiado a string para manejar "N/A"
  networkTransmit: string; // Cambiado a string para manejar "N/A"
};

type ContainerCardProps = {
  container: Container;
};

// Función para convertir el valor a número y manejar casos de "N/A"
const formatValue = (value: string): number | string => {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? 'N/A' : parsedValue;
};

const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
  const cpu = formatValue(container.cpu);
  const memory = formatValue(container.memory);
  const networkReceive = formatValue(container.networkReceive);
  const networkTransmit = formatValue(container.networkTransmit);

  return (
    <div className={styles.card}>
      <div className={styles.name}>{container.name}</div>
      <p>Status: {container.state}</p>
      {cpu !== 'N/A' && <p>CPU Usage: {(cpu as number).toFixed(2)}%</p>}
      {memory !== 'N/A' && <p>Memory Usage: {(memory as number / 1e6).toFixed(2)} MB</p>}
      {networkReceive !== 'N/A' && <p>Network Receive: {(networkReceive as number / 1e6).toFixed(2)} MB</p>}
      {networkTransmit !== 'N/A' && <p>Network Transmit: {(networkTransmit as number / 1e6).toFixed(2)} MB</p>}
    </div>
  );
};

export default ContainerCard;