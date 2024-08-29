'use client';
import { Container, Divider, Icon, List, Paragraph } from '@adoxdesarrollos/designsystem-2';
import styles from './ServersFallen.module.css';

type Containers = {
    name: string;
    state: string;
    status: string;
};

type Snapshots = {
    containers: Containers[];
};

type Volumes = {
    id: string;
    name: string;
    status: string;
    snapshots: Snapshots[];
};

type DataProps = {
    volume: Volumes[];
};

const ServersFallen: React.FC<DataProps> = ({ volume }) => {
    const nonRunningContainers = volume.flatMap(container => 
        container.snapshots[0]?.containers.filter(c => c.state !== 'running') || []
    );

    return (
        <Container customClassNames={styles.body}>
            <Divider />
            <Container alignItems="center" flexDirection="column" fullWidth>
                <Paragraph customClassNames={styles.subTitle} bold>
                    Servidores Caidos
                </Paragraph>
                <Icon name='eye'/>
            </Container>
            <Container flexDirection="row" padding="none" fullWidth>
                {nonRunningContainers.map((container, index) => (
                    <Container key={index} customClassNames={styles.item}>
                        <Paragraph size="large" customClassNames={styles.name} bold>
                            <Icon size="medium" color='red' name='warningsign'/> {container.name}
                        </Paragraph>
                    </Container>
                ))}
            </Container>
        </Container>
    );
};

export default ServersFallen;
