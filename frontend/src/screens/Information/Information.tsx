"use client";
import styles from './Information.module.css';
import { Container, Divider, Icon, Paragraph, Spacer } from '@adoxdesarrollos/designsystem-2';
import { capitalizeFirstLetter } from '@/utils/func.utils';
import { Card } from './components/Card';

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

const Information: React.FC<ContainerInformationProps> = ({ data }) => {

  return (
    <Container customClassNames={styles.conteiner} fullWidth>
      <Divider />
      <Spacer/>
      <Paragraph customClassNames={styles.nameContainer}>{`<${capitalizeFirstLetter(data.name)}>`} <Icon name='shippingbox'></Icon></Paragraph>
      <Spacer/>
      <Container>{`Contenedores en total ${data.snapshots[0].containers.length}`}</Container>
      <Container justifyContent='center' display='flex'>
        <Paragraph>{`Ejecutandose: ${data.snapshots[0].runningContainerCount}`}</Paragraph>
        <Spacer/>
        <Paragraph>{`Detenidos: ${data.snapshots[0].stoppedContainerCount}`}</Paragraph>
      </Container>
      <Card data={data}/>
    </Container>
  );
};

export default Information;
