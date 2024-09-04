"use client";
import styles from './Information.module.css';
import { Container, Divider, Icon, Paragraph, Spacer } from '@adoxdesarrollos/designsystem-2';
import { capitalizeFirstLetter } from '@/utils/func.utils';
import { Card } from './components/Card';

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

const Information: React.FC<ContainerInformationProps> = ({ data }) => {

  return (
    <Container customClassNames={styles.conteiner} fullWidth>
      <Divider/>
      <Spacer/>
      <Container padding="none" alignItems='center'>
        <Icon name='shippingbox' size="medium"/>
        <Paragraph customClassNames={styles.nameContainer}>
          <Icon name='chevronLeft' size="small"/>
          {`${capitalizeFirstLetter(data.name)}`}
          <Icon name='chevronRight' size="small"/>
          </Paragraph>
      </Container>
      <Paragraph size="large">Contenedores: <strong>{data.snapshots[0].containers.length}</strong></Paragraph>
      <Container justifyContent='center' display='flex'>
        <Paragraph size="medium">Ejecutandose: <strong>{data.snapshots[0].runningContainerCount.toString()}</strong></Paragraph>
        <Spacer/>
        <Paragraph size="medium">Detenidos: <strong>{data.snapshots[0].stoppedContainerCount.toString()}</strong></Paragraph>
      </Container>
      <Card data={data}/>
    </Container>
  );
};

export default Information;
