import Docker from 'dockerode';

// Configura Dockerode para conectarse al daemon Docker en el servidor
const docker = new Docker({ 
    host: 'http://localhost:2375',  // Reemplaza con la URL del daemon Docker en el servidor
    port: 2375                 // El puerto en el que Docker está escuchando
});

// Función para obtener información de los contenedores
export const getContainerInfo = async () => {
    try {
        // Lista todos los contenedores, incluyendo los detenidos
        const containers = await docker.listContainers({ all: true });

        // Mapea la información de los contenedores a un formato más simple
        const containerInfo = containers.map(container => ({
            id: container.Id,
            name: container.Names[0].replace('/', ''), // Quita el prefijo '/' del nombre
            state: container.State
        }));

        console.log(containerInfo);
        return containerInfo;
    } catch (error) {
        console.error('Error fetching container information:', error);
        throw new Error('Error fetching container information');
    }
};