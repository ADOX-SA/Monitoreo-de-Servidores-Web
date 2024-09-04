import { Container, Divider, Icon, Paragraph } from '@adoxdesarrollos/designsystem-2';
import styles from './Card.module.css';
import { capitalizeFirstLetter, extractKeyword, playSound, translateStatus } from '@/utils/func.utils';
import { useEffect, useState } from 'react';

type Containers={
    name: string;
    state: string;
    status: string;
    metrics:{
      cpu: string;
      memory: string;
      network: string;
    }
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
  //const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [containers, setContainers] = useState<Containers[]>([]);
  //const [alertedContainers, setAlertedContainers] = useState<string[]>([]);

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

/*  
    const handlePlaySound = async () => {
      await playSound();
      setHasPlayedSound(true);
    };

*/

/*        useEffect(() => {
        containers.forEach(c => {
          if (c.state === 'exited' && !alertedContainers.includes(c.name)) {
            setAlertedContainers(prev => [...prev, c.name]);
            handlePlaySound();
          } else if (c.state === 'running') {
            setHasPlayedSound(false);
          }
        });
      }, [containers, alertedContainers]);
*/    
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
                <Container customClassNames={styles.items}>
                <Paragraph>
                  {(() => {
                    switch (container.state) {
                      case "running":
                        return <Icon color='green' name='checkmark' size="extra-large" />;
                      case "exited":
                        return <Icon color='red' name='warning' size="extra-large" />;
                      case "created":
                        return <Icon color='cyan' name='add' size="extra-large" />;
                      default:
                        return <div>Otro estado</div>;
                    }
                  })()}
                </Paragraph>
                </Container>
            <Paragraph customClassNames={styles.description}>{translateStatus(container.status)}</Paragraph>
            <Container fullWidth>
              <Divider/>
              <Container>
                <Paragraph size="medium">CPU: <strong>{container.metrics.cpu}%</strong></Paragraph>
                <Paragraph size="medium">RAM: <strong>{container.metrics.memory}MB</strong></Paragraph>
                <Paragraph size="medium">RED: <strong>{container.metrics.network}MB</strong></Paragraph>
              </Container>
              <Divider/>
            </Container>
          </Container>
        ))}
    </Container>
    )
};

export default Card;