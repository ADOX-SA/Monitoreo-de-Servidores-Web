const https = require('https');
import axios from 'axios';

const url = process.env.PORTAINER_API_URL;
const token = process.env.BEARER_TOKEN;

const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    //TODO: Como hago para hacer mas seguro esto Bearer..
    headers: {
        'Authorization': `Bearer ${token}`,
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
                        //image: conteiner.Image,
                        //imageId: c.ImageID,
                        //command: c.Command,
                        //created: c.Created,
                        /*
                        ports: c.Ports.map(port => ({
                            IP: port.IP,
                            privatePort: port.PrivatePort,
                            publicPort: port.PublicPort,
                            type: port.Type,
                        })),*/
                        state: conteiner.State,
                        status: conteiner.Status,
                        /*
                        networkSettings: Object.values(c.NetworkSettings.Networks).map(network => ({
                            ipAddress: network.IPAddress,
                            networkID: network.NetworkID,
                            endpointID: network.EndpointID,
                            gateway: network.Gateway,
                            macAddress: network.MacAddress,
                        })),
                        */
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