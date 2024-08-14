import { Request, Response } from 'express';
const Docker = require('dockerode');
// Conéctate a Docker usando TCP
const docker = new Docker({
  host: process.env.DOCKER_HOST,
  port: Number(process.env.DOCKER_PORT),
});

// TODO: Se repite esta funcion
const getContainerStats = async (containerId: string) => {
  try {
    const container = docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });
    return {
      cpuUsage: stats.cpu_stats.cpu_usage.total_usage,
      memoryUsage: stats.memory_stats.usage,
      memoryLimit: stats.memory_stats.limit,
      memoryPercentage: (stats.memory_stats.usage / stats.memory_stats.limit) * 100,
      networkIO: stats.networks,
      blockIO: stats.blkio_stats,
    };
  } catch (error) {
    console.error("Error fetching container stats:", error);
    return null;
  }
};

export const images = async (req: Request, res: Response) => {
  try {
    const containers = await docker.listContainers();
    const formattedContainers = await Promise.all(containers.map(async (container: any) => {
      const metrics = await getContainerStats(container.Id);
      return {
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
        metrics,
      };
    }));

    res.json(formattedContainers);
  } catch (error) {
    console.error("Error fetching containers:", error);
    res.status(500).json({ error: 'Error fetching containers' });
  }
};
