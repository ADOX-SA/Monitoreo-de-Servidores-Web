'use client';
import { Container, Divider, Icon, List, Paragraph } from '@adoxdesarrollos/designsystem-2';
import styles from './ServersFallen.module.css';
import { useEffect, useState } from 'react';
import { playSound } from '@/utils/func.utils';

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
    const [nonRunningContainers, setNonRunningContainers] = useState<Containers[]>([]);

    const handlePlaySound = async () => {
        await playSound();
    };

    useEffect(() => {
        handlePlaySound();
        const updatedNonRunningContainers = volume.flatMap(container => 
            container.snapshots[0]?.containers.filter(c => c.state !== 'running') || []
        );
        setNonRunningContainers(updatedNonRunningContainers);
    }, [volume]);
    
    return (
        <Container customClassNames={styles.body}>
            <Divider />
            <Container alignItems="center" flexDirection="column" fullWidth>
                <Paragraph customClassNames={styles.subTitle}>Servidores Caidos</Paragraph>
                <Icon size="extra-large" color='red' name='warningsign'/> 
            </Container>
            <Container padding="none">
                {nonRunningContainers.map((container, index) => (
                    <Container key={index} customClassNames={styles.item} >
                        <Paragraph size="large" bold>
                            {container.name}
                        </Paragraph>
                    </Container>
                ))}
            </Container>
        </Container>
    );
};

export default ServersFallen;
