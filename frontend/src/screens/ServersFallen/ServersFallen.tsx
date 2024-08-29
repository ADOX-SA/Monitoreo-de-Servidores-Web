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
                <Icon size="extra-large" color='red' name='warningsign'/> 
            </Container>
            <Container padding="none">
                {nonRunningContainers.map((container, index) => (
                    <Container key={index} customClassNames={styles.item} >
                        <Paragraph size="small" bold>
                            {container.name}
                        </Paragraph>
                    </Container>
                ))}
            </Container>
        </Container>
    );
};

export default ServersFallen;
