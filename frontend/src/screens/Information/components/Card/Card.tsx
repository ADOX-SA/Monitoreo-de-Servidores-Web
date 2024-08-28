import { Container, Icon, Paragraph, Spacer } from '@adoxdesarrollos/designsystem-2';
import styles from './Card.module.css';
import { capitalizeFirstLetter, extractKeyword, translateStatus } from '@/utils/func.utils';
import { useEffect, useState } from 'react';

type Containers={
    name: string;
    state: string;
    status: string;
};

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
};

type ContainerInformationProps = {
    data: {
        id: string;
        name: string;
        status: string;
        snapshots: Snapshots[];
    };
};

const Card: React.FC<ContainerInformationProps> = ({ data }) => {
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [containers, setContainers] = useState<Containers[]>([]);
  const [alertedContainers, setAlertedContainers] = useState<string[]>([]);

  const playSound = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio('/audio/Alarma.mp3');
        audio.play()
          .then(() => resolve())
          .catch(error => {
            console.error('Error al reproducir el sonido:', error);
            reject(error);
          });
      });
    };
    
    const handlePlaySound = async () => {
      await playSound();
      setHasPlayedSound(true);
    };

    useEffect(() => {
      // Ordena los contenedores con estado 'exited' o 'created' al principio
      const sortedContainers = data.snapshots[0].containers.slice().sort((a, b) => {
        if (a.state === 'exited' || a.state === 'created' && b.state !== 'exited') return -1;
        if (a.state !== 'exited' && b.state === 'exited' || b.state === 'created') return 1;
        return 0;
      }
    );
    setContainers(sortedContainers);
  }, [data.snapshots[0].containers]);

    useEffect(() => {
        containers.forEach(c => {
          if (c.state === 'exited' && !alertedContainers.includes(c.name)) {
            alert(`El contenedor ${c.name} está detenido.`);
            setAlertedContainers(prev => [...prev, c.name]);
            handlePlaySound();
          } else if (c.state === 'running') {
            setHasPlayedSound(false);
          }
        });
      }, [containers, alertedContainers]);

      
    return (
    <Container>
        {containers.map((container) => (
        <Container key={container.name + '-name'} customClassNames={styles.card}>
            <Container 
              key={container.name + '-name'} 
              display='flex' 
              justifyContent='center' 
              padding="none"
              fullWidth>
                <Paragraph align='center' size="large" bold>
                  {`${capitalizeFirstLetter(extractKeyword(container.name))}`}
                </Paragraph>
                </Container>
            <Spacer/>
            <Container customClassNames={styles.items} >
                <Paragraph>
                    {container.state === "running" ? (
                        <Icon color='green' name='checkmark' size="extra-large" />
                    ) : (
                        <Icon color='red' name='warningsign' size="extra-large" />
                    )}
                </Paragraph>
              </Container>
            <Paragraph customClassNames={styles.description}>{translateStatus(container.status)}</Paragraph>
          </Container>
        ))}
    </Container>
    )
};

export default Card;