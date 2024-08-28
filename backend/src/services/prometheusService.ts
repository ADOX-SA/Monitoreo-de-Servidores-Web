const https = require('https');
import axios from 'axios';

const url = process.env.URL_PORTAINER;
const token = process.env.BEARER_TOKEN;
const prometheus = process.env.PROMETHEUS;

const instance = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    }),
    headers: {
        'x-api-key': token, // Configuración correcta para x-api-key
        //'Authorization': `Bearer ${token}` // Usar este en lugar del anterior si necesitas un Bearer token :P
    }
});

interface ContainerPort {
    IP: string;
    PrivatePort: number;
    PublicPort: number;
    Type: string;
}

interface NetworkSettings {
    IPAddress: string;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    MacAddress: string;
}

interface Container {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: ContainerPort[];
    Labels: Record<string, any>;
    State: string;
    Status: string;
    HostConfig: {
        NetworkMode: string;
    };
    NetworkSettings: {
        Networks: {
            [key: string]: NetworkSettings;
        };
    };
    Mounts: any[];
}

interface DockerSnapshotRaw {
    Containers: Container[];
}

interface Snapshot {
    Time: number;
    DockerVersion: string;
    Swarm: boolean;
    TotalCPU: number;
    TotalMemory: number;
    RunningContainerCount: number;
    StoppedContainerCount: number;
    HealthyContainerCount: number;
    UnhealthyContainerCount: number;
    VolumeCount: number;
    ImageCount: number;
    ServiceCount: number;
    StackCount: number;
    DockerSnapshotRaw: DockerSnapshotRaw;
}

interface ContainerInfo {
    Id: string;
    Name: string;
    Status: string;
    Snapshots: Snapshot[];
}

const convertBytesToMB = (bytes: string) => (parseFloat(bytes) / (1024 ** 2)).toFixed(2);

// Función para obtener métricas de Prometheus para un contenedor específico
const getContainerMetrics = async (containerName: string, totalCPU: number) => {
    try {
        const cpuQuery = `container_cpu_usage_seconds_total{name="${containerName}"}`;
        const memoryQuery = `container_memory_usage_bytes{name="${containerName}"}`;
        const networkQuery = `container_network_receive_bytes_total{name="${containerName}"}`;

        const cpuResponse = await instance.get(`${prometheus}/api/v1/query?query=${encodeURIComponent(cpuQuery)}`);
        const memoryResponse = await instance.get(`${prometheus}/api/v1/query?query=${encodeURIComponent(memoryQuery)}`);
        const networkResponse = await instance.get(`${prometheus}/api/v1/query?query=${encodeURIComponent(networkQuery)}`);

        const cpuValue = parseFloat(cpuResponse.data.data.result[0]?.value[1] || '0');

        //TODO: Esto es muy falopa el calculo
        const cpuUsagePercentage = (cpuValue * 100) / (totalCPU * 1000000); // Ajuste en el cálculo del porcentaje de CPU

        
        return {
            cpu: cpuUsagePercentage.toFixed(2),
            memory: convertBytesToMB(memoryResponse.data.data.result[0]?.value[1] || '0'),
            network: convertBytesToMB(networkResponse.data.data.result[0]?.value[1] || '0'),
        };
    } catch (error) {
        console.error('Error fetching container metrics from Prometheus:', error);
        return null;
    }
};



// Mapeo de los contenedores con las métricas
export const mapContainersWithMetrics = async (response: any) => {
    const mappedContainers = await Promise.all(
        response.data.map(async (container: any) => ({
            id: container.Id,
            name: container.Name.replace('/', ''), // Elimina el prefijo '/' si está presente
            status: container.Status,
            snapshots: await Promise.all(
                container.Snapshots.map(async (snapshot: any) => ({
                    time: snapshot.Time,
                    dockerVersion: snapshot.DockerVersion,
                    swarm: snapshot.Swarm,
                    totalCPU: snapshot.TotalCPU,
                    totalMemory: snapshot.TotalMemory,
                    runningContainerCount: snapshot.RunningContainerCount,
                    stoppedContainerCount: snapshot.StoppedContainerCount,
                    healthyContainerCount: snapshot.HealthyContainerCount,
                    unhealthyContainerCount: snapshot.UnhealthyContainerCount,
                    volumeCount: snapshot.VolumeCount,
                    imageCount: snapshot.ImageCount,
                    serviceCount: snapshot.ServiceCount,
                    stackCount: snapshot.StackCount,
                    containers: await Promise.all(
                        snapshot.DockerSnapshotRaw.Containers.map(async (conteiner: any) => {
                            const metrics = await getContainerMetrics(conteiner.Names[0].replace('/', ''), snapshot.TotalCPU);
                            return {
                                //id: c.Id,
                                name: conteiner.Names[0].replace('/', ''), // Elimina el prefijo '/' si está presente
                                // Mapea las métricas obtenidas desde Prometheus
                                metrics: metrics || {
                                    cpu: '0',
                                    memory: '0',
                                    network: '0',
                                },
                                state: conteiner.State,
                                status: conteiner.Status,
                                /*
                                image: conteiner.Image,
                                imageId: c.ImageID,
                                command: c.Command,
                                created: c.Created,
                                ports: c.Ports.map(port => ({
                                    IP: port.IP,
                                    privatePort: port.PrivatePort,
                                    publicPort: port.PublicPort,
                                    type: port.Type,
                                })),
                                networkSettings: Object.values(c.NetworkSettings.Networks).map(network => ({
                                    ipAddress: network.IPAddress,
                                    networkID: network.NetworkID,
                                    endpointID: network.EndpointID,
                                    gateway: network.Gateway,
                                    macAddress: network.MacAddress,
                                })),
                                */
                            };
                        })
                    ),
                }))
            ),
        }))
    );

    return mappedContainers;
};

// TODO:Función para obtener información de los contenedores
export const getContainerInfo = async () => {
    try {
        const response = await instance.get(`${url}/api/endpoints`);
        const enrichedData = await mapContainersWithMetrics(response);

        return enrichedData;
    } catch (error) {
        console.error('Error fetching container information:', error);
        throw new Error('Error fetching container information');
    }
};

// Funcion anterior...
/*
// TODO:Función para obtener información de los contenedores
export const getContainerInfo = async () => {
    try {
        return instance.get(`${url}/api/endpoints`)
        .then(response => {
            const mappedContainers = response.data.map((container: ContainerInfo) => ({
                id: container.Id,
                name: container.Name.replace('/', ''), // Elimina el prefijo '/' si está presente
                status: container.Status,
                snapshots: container.Snapshots.map(snapshot => ({
                    time: snapshot.Time,
                    dockerVersion: snapshot.DockerVersion,
                    swarm: snapshot.Swarm,
                    totalCPU: snapshot.TotalCPU,
                    totalMemory: snapshot.TotalMemory,
                    runningContainerCount: snapshot.RunningContainerCount,
                    stoppedContainerCount: snapshot.StoppedContainerCount,
                    healthyContainerCount: snapshot.HealthyContainerCount,
                    unhealthyContainerCount: snapshot.UnhealthyContainerCount,
                    volumeCount: snapshot.VolumeCount,
                    imageCount: snapshot.ImageCount,
                    serviceCount: snapshot.ServiceCount,
                    stackCount: snapshot.StackCount,
                    containers: snapshot.DockerSnapshotRaw.Containers.map(conteiner => ({
                        //id: c.Id,
                        name: conteiner.Names[0].replace('/', ''), // Elimina el prefijo '/' si está presente
                        //POR ACA SE PODRIA HACER LA CONSULTA DE PROMETHEUS Y QUE MAPPE LAS METRICAS COMO RAM, CPU  Y RED
                        //image: conteiner.Image,
                        //imageId: c.ImageID,
                        //command: c.Command,
                        //created: c.Created,
                        ports: c.Ports.map(port => ({
                            IP: port.IP,
                            privatePort: port.PrivatePort,
                            publicPort: port.PublicPort,
                            type: port.Type,
                        })),
                        state: conteiner.State,
                        status: conteiner.Status,
                        networkSettings: Object.values(c.NetworkSettings.Networks).map(network => ({
                            ipAddress: network.IPAddress,
                            networkID: network.NetworkID,
                            endpointID: network.EndpointID,
                            gateway: network.Gateway,
                            macAddress: network.MacAddress,
                        })),
                        
                    }))
                }))
            }));

            return mappedContainers;
        })
        .catch(error => {
            console.error(error);
        });
    } catch (error) {
        console.error('Error fetching container information:', error);
        throw new Error('Error fetching container information');
    }
};
*/