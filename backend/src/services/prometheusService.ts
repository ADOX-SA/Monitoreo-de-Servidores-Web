const https = require('https');
import axios from 'axios';

const url = process.env.PORTAINER_API_URL;
const key = process.env.API_KEY;
const idConteinerDocker = process.env.ID_CONTAINTER_DOCKER;


const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
});

interface Container{
    ImageID: string;
    Names: string;
    State: string;
    Labels: string;
    project?: string;
    Status: string;
};


// TODO:Función para obtener información de los contenedores
export const getContainerInfo = async () => {
    try {
       return instance.get(`${url}/api/endpoints/${idConteinerDocker}/docker/containers/json?all=1&X-API-Key=${key}`)
        .then(response => {
            
            const mappedContainers = response.data.map((container : Container) => ({
                id: container.ImageID,
                name: container.Names[0].replace('/', ''), // Quita el prefijo '/' del nombree
                state: container.State,
                project: container.Labels['com.docker.compose.project'],
                Status: container.Status,
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