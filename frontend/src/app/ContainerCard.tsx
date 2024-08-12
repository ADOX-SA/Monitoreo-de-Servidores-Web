import React from 'react';
import styles  from './conteinerCard.module.css';

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

type ContainerCardProps = {
  container: Container;
};


const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>{container.name}</div>
      <p>Status: {container.status}</p>
      <p>Image: {container.image}</p>
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
