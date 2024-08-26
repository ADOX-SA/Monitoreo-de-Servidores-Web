import React, { useEffect, useState } from 'react';
import styles from './Card.module.css';
import { Container, Divider, Icon, Paragraph } from '@adoxdesarrollos/designsystem-2';

type Containers={
  name: string;
  state: string;
  status: string;
}

type Snapshots ={
  time: BigInteger,
  dockerVersion: string,
  swarm: boolean,
  totalCPU: Number,
  totalMemory: BigInt,
  runningContainerCount: Number,
  stoppedContainerCount: Number,
  healthyContainerCount: Number,
  unhealthyContainerCount: Number,
  volumeCount: Number,
  imageCount: Number,
  serviceCount: Number,
  stackCount: Number,
  containers: Containers[];
}

type ContainerCardProps = {
  data: {
    id: string;
    name: string;
    status: string;
    snapshots: Snapshots[];
  };
};


const Card: React.FC<ContainerCardProps> = ({ data }) => {
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [conteiners, setContainers] = useState(data.snapshots[0].containers);

  console.log("Conteiners hook:", conteiners);

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
    await playSound(); // Reproduce el sonido y espera a que termine
    setHasPlayedSound(true);
  };

  
  useEffect(() => {
      {
      if (conteiners.state === 'exited' && !hasPlayedSound) {
        // Trigger sound with user interaction, e.g., button click
        handlePlaySound();
        alert(`El contenedor ${data.name} está detenido.`);
      } else if (conteiners.state === 'running') {
        setHasPlayedSound(false); // Reset if the container is running
      }
    };
  }, [data.state, data.name, hasPlayedSound]);


  return (
    <div className={styles.conteiner}>
      <Divider></Divider>
      <Paragraph customClassNames={styles.name}>{data.name}</Paragraph>
      {data.snapshots[0].containers.map((container, index) => (
        <Container key={index} customClassNames={styles.card}>
          <Container key={index} customClassNames={styles.name}>{container.name}</Container>
            <Container key={index} customClassNames={styles.items}>
              <Paragraph>
                {container.state === "running" ? (
                  <Icon color='green' name='checkmark' size="extra-large" />
                ) : (
                  <Icon color='red' name='warningsign' size="extra-large" />
                )}
              </Paragraph>
            </Container>
          <Paragraph key={index} customClassNames={styles.name}>{container.status}</Paragraph>
        </Container>
    ))}
    </div>

  );
};

export default Card;
