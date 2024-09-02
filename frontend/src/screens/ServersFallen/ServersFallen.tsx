'use client';
import { Container, Divider, Icon, List, Paragraph, Spacer } from '@adoxdesarrollos/designsystem-2';
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
    const [alertedContainers, setAlertedContainers] = useState<string[]>([]);
    const [nonRunningContainers, setNonRunningContainers] = useState<Containers[]>([]);

    useEffect(() => {
        const updatedNonRunningContainers = volume.flatMap(container => 
            container.snapshots[0]?.containers.filter(c => c.state !== 'running') || []
        );
        setNonRunningContainers(updatedNonRunningContainers);
    }, [volume]);
    
    const handlePlaySound = async () => {
        await playSound();
    };

    useEffect(() => {
        nonRunningContainers.forEach(c =>{
            if (!alertedContainers.includes(c.name) && c.state !== 'running') {
                setAlertedContainers(prev => [...prev, c.name]);
                handlePlaySound();
            };
        });
    }, [nonRunningContainers, alertedContainers]);

    return (
        <Container padding="none" customClassNames={styles.body} fullWidth>
            <Container>
                <Container>
                    <Divider />
                    <Spacer/>
                        <Container padding="none" justifyContent='center' display='flex' fullWidth>
                            <Icon size="large" color='red' name='warningsign'/> 
                        </Container>
                        <Paragraph align='center' customClassNames={styles.subTitle}>{`<Servidores Caidos>`}</Paragraph>
                        <Container padding="none">
                            {nonRunningContainers.map((container, index) => {
                                const isLast = index === nonRunningContainers.length - 1;
                                return (
                                    <Container
                                        key={index}
                                        justifyContent='center'
                                        customClassNames={`${styles.item} ${isLast ? styles.lastItem : ''}`} // Aplica una clase extra si es el último
                                        padding="none"
                                    >
                                        <Paragraph bold>
                                            {container.name}
                                        </Paragraph>
                                    </Container>
                                );
                            })}
                        </Container>
                </Container>
            </Container>
        </Container>
    );
};

export default ServersFallen;
