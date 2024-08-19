import axios from 'axios';
import { execSync } from 'child_process';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

interface MetricData {
    metric: {
        name: string;
    };
    value: [number, string];
}

interface ContainerRegistry {
    [key: string]: {
        state: string;
    };
}

interface Metric {
    name: string;
    state: string;
    cpu: string;
    memory: string;
    networkReceive: string;
    networkTransmit: string;
}

let containerRegistry: ContainerRegistry = {};

export const getContainerMetrics = async () => {
    try {
        updateContainerRegistryFromDocker();

        const queries = [
            'container_tasks_state{job="cadvisor"}', 
            'container_cpu_usage_seconds_total{job="cadvisor"}',
            'container_memory_usage_bytes{job="cadvisor"}',
            'container_network_receive_bytes_total{job="cadvisor"}',
            'container_network_transmit_bytes_total{job="cadvisor"}'
        ];

        const promises = queries.map(query => 
            axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
                params: { query }
            })
        );

        const results = await Promise.all(promises);

        const metrics = {
            states: results[0].data.data.result as MetricData[],
            cpu: results[1].data.data.result as MetricData[],
            memory: results[2].data.data.result as MetricData[],
            networkReceive: results[3].data.data.result as MetricData[],
            networkTransmit: results[4].data.data.result as MetricData[]
        };

        const containers = processContainerMetrics(metrics, containerRegistry);

        // Eliminar duplicados de los contenedores
        return removeDuplicates(containers);
    } catch (error) {
        console.error('Error fetching metrics from Prometheus:', error);
        throw new Error('Error fetching metrics from Prometheus');
    }
};

// Actualiza el registro de contenedores usando `docker ps -a`
const updateContainerRegistryFromDocker = () => {
    const containerStatus = execSync('docker ps -a --format "{{.Names}} {{.Status}}"').toString();
    const lines = containerStatus.split('\n');

    lines.forEach(line => {
        const [name, ...statusParts] = line.split(' ');
        const status = statusParts.join(' ');

        containerRegistry[name] = {
            state: status.includes('Exited') ? 'stopped' : 'running'
        };
    });
};

// Elimina entradas repetidas en los datos de métricas
const removeDuplicates = (metrics: Metric[]): Metric[] => {
    const uniqueMetrics: { [key: string]: Metric } = {};

    metrics.forEach(metric => {
        if (!uniqueMetrics[metric.name] || uniqueMetrics[metric.name].state === 'stopped') {
            uniqueMetrics[metric.name] = metric;
        }
    });

    return Object.values(uniqueMetrics);
};

export const processContainerMetrics = (metrics: any, containerRegistry: any) => {
    const processedMetrics: Metric[] = [];

    metrics.states.forEach((metric: MetricData) => {
        const containerName = metric.metric.name;

        if (!containerName) {
            // TODO: Si no tiene nombre, no lo agrega cuando se hace el push..
            //console.warn('Missing container name in metrics data');
            return;
        }

        processedMetrics.push({
            name: containerName,
            state: containerRegistry[containerName]?.state || 'unknown',
            cpu: metrics.cpu.find((m: MetricData) => m.metric.name === containerName)?.value[1] || "N/A",
            memory: metrics.memory.find((m: MetricData) => m.metric.name === containerName)?.value[1] || "N/A",
            networkReceive: metrics.networkReceive.find((m: MetricData) => m.metric.name === containerName)?.value[1] || "N/A",
            networkTransmit: metrics.networkTransmit.find((m: MetricData) => m.metric.name === containerName)?.value[1] || "N/A"
        });
    });

    // Agregar contenedores que están en el registro pero no reportaron métricas
    Object.keys(containerRegistry).forEach((containerName: string) => {  
        const metric = processedMetrics.find((container: any) => container.name === containerName);

        if (!metric) {
            processedMetrics.push({
                name: containerName,
                state: containerRegistry[containerName]?.state || 'stopped',
                cpu: "N/A",
                memory: "N/A",
                networkReceive: "N/A",
                networkTransmit: "N/A"
            });
        }
    });

    return processedMetrics;
};
