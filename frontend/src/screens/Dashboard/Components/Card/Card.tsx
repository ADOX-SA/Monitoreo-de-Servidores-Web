"use client";
import styles from './Card.module.css';
import { Container, Divider, Icon, Paragraph } from '@adoxdesarrollos/designsystem-2';

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

const Card: React.FC<ContainerCardProps> = ({ container }) => {
  const cpu = formatValue(container.cpu);
  const memory = formatValue(container.memory);
  const networkReceive = formatValue(container.networkReceive);
  const networkTransmit = formatValue(container.networkTransmit);

  return (
    <Container customClassNames={styles.card}>
      <Container customClassNames={styles.name}>{container.name}</Container>
      <Container customClassNames={styles.items}>
        <Paragraph>{container.state == "running"? 
          <Icon color='green' name='checkmark' size="extra-large"></Icon>
          : 
          <Icon color='red' name='warningsign' size="extra-large"></Icon>}
        </Paragraph>
      </Container>
      <Divider thickness='sm'/>
      <Container alignItems='flex-start'>
        {cpu !== 'N/A' && <p>CPU: <strong>{(cpu as number).toFixed(2)} %</strong></p>}
        {memory !== 'N/A' && <p>RAM: <strong>{(memory as number / 1e6).toFixed(2)} MB</strong></p>}
        {networkReceive !== 'N/A' && <p>Recepción de Red: <strong>{(networkReceive as number / 1e6).toFixed(2)} MB</strong></p>}
        {networkTransmit !== 'N/A' && <p>Transmisión de Red: <strong>{(networkTransmit as number / 1e6).toFixed(2)} MB</strong></p>}
      </Container>
      <Divider thickness='sm'/>  
    </Container>
  );
};

export default Card;