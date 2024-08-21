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

  const playSound = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio('/audio/Alarma.m4a');
      audio.play()
        .then(() => resolve())
        .catch(error => {
          console.error('Error al reproducir el sonido:', error);
          reject(error);
        });
    });
  };

  const handlePlaySound = async () => {
    try {
      await playSound(); // Reproduce el sonido y espera a que termine
      alert(`El contenedor ${container.name} está detenido.`);
      setHasPlayedSound(true);
    } catch (error) {
      // Maneja errores si el sonido no se puede reproducir
      console.error('Error en handlePlaySound:', error);
    }
  };

  useEffect(() => {
    if (container.state === 'exited' && !hasPlayedSound) {
      // Trigger sound with user interaction, e.g., button click
      document.getElementById('play-sound-button')?.addEventListener('click', handlePlaySound);
    } else if (container.state === 'running') {
      setHasPlayedSound(false); // Reset if the container is running
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
