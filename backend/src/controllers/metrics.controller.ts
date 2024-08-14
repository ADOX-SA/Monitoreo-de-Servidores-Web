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

export const metrics = async (req: Request, res: Response) => {
  try {
    const containers = await docker.listContainers();
    const metricsData = await Promise.all(containers.map(async (container: any) => {
      const metrics = await getContainerStats(container.Id);
      return `
        # HELP container_memory_usage_bytes Memory usage in bytes
        container_memory_usage_bytes{container="${container.Names[0]}"} ${metrics?.memoryUsage}
        # HELP container_cpu_usage_seconds_total CPU usage in seconds
        container_cpu_usage_seconds_total{container="${container.Names[0]}"} ${metrics?.cpuUsage}
      `;
    }));

    res.set('Content-Type', 'text/plain');
    res.send(metricsData.join('\n'));
  } catch (error) {
    console.error("Error fetching container metrics:", error);
    res.status(500).send('Error fetching metrics');
  }
};

