import React, { useEffect, useState } from 'react';
import styles from './Card.module.css';
import { Container, Icon, Paragraph } from '@adoxdesarrollos/designsystem-2';

type ContainerCardProps = {
  container: {
    name: string;
    state: string;
  };
};

const Card: React.FC<ContainerCardProps> = ({ container }) => {
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const playSound = () => {
    const audio = new Audio('/audio/Alarma.m4a');
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  };

  useEffect(() => {
    if (container.state === 'exited' && !hasPlayedSound) {
      playSound();
      alert(`El contenedor ${container.name} está detenido.`); // Muestra la alerta
      setHasPlayedSound(true); // Asegura que el sonido se reproduzca solo una vez
    } else if (container.state === 'running') {
      setHasPlayedSound(false); // Resetea si el contenedor vuelve a estar en ejecución
    }
  }, [container.state, container.name, hasPlayedSound]);

  return (
    <Container customClassNames={styles.card}>
      <Container customClassNames={styles.name}>{container.name}</Container>
      <Container customClassNames={styles.items}>
        <Paragraph>
          {container.state === "running" ? (
            <Icon color='green' name='checkmark' size="extra-large" />
          ) : (
            <Icon color='red' name='warningsign' size="extra-large" />
          )}
        </Paragraph>
      </Container>
      {/* 
      <Divider thickness='sm'/>
      <Container alignItems='flex-start'>
        {container.cpu && <p>CPU: <strong>{container.cpu.toFixed(2)} %</strong></p>}
        {container.memory && <p>RAM: <strong>{(container.memory / 1e6).toFixed(2)} MB</strong></p>}
        {container.networkReceive && <p>Recepción de Red: <strong>{(container.networkReceive / 1e6).toFixed(2)} MB</strong></p>}
        {container.networkTransmit && <p>Transmisión de Red: <strong>{(container.networkTransmit / 1e6).toFixed(2)} MB</strong></p>}
      </Container>
      <Divider thickness='sm'/> 
      */}
    </Container>
  );
};

export default Card;
