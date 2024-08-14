import { Request, Response } from 'express';
const Docker = require('dockerode');
// Conéctate a Docker usando TCP
const docker = new Docker({
  host: process.env.DOCKER_HOST,
  port: Number(process.env.DOCKER_PORT),
});

export const images = async (req: Request, res: Response) => {
    try {
      const containers = await docker.listContainers();
      const formattedContainers = containers.map((container: any) => ({
        id: container.Id,
        name: container.Names[0],
        image: container.Image,
        imageId: container.ImageID,
        created: container.Created,
        status: container.Status,
        state: container.State,
        labels: container.Labels,
        ports: container.Ports,
        mounts: container.Mounts,
        networkSettings: container.NetworkSettings,
      }));
      res.json(formattedContainers);
    } catch (error) {
      console.error("Error fetching containers:", error);
      res.status(500).json({ error: 'Error fetching containers' });
    }
  };