import axios from 'axios';
import { Request, Response } from 'express';

export const metrics = async (req: Request, res: Response) => {
    try {
        const queries = {
            cpu: 'sum(rate(container_cpu_usage_seconds_total[5m])) by (instance)',
            memory: 'sum(container_memory_usage_bytes) by (instance)',
            disk: 'sum(container_fs_usage_bytes) by (instance)',
            networkIn: 'sum(rate(container_network_receive_bytes_total[5m])) by (instance)',
            networkOut: 'sum(rate(container_network_transmit_bytes_total[5m])) by (instance)',
            containersStatus: 'container_last_seen{container_label_com_docker_swarm_task_state="running"}',
            uptime: 'time() - container_start_time_seconds'
        };

        const metrics = await Promise.all(Object.entries(queries).map(async ([key, query]) => {
            const response = await axios.get('http://localhost:3000/api/datasources/proxy/1/api/v1/query', {
                params: { query },
                headers: {
                    'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}`
                }
            });
            return { [key]: response.data.data.result };
        }));

        res.json(Object.assign({}, ...metrics));
    } catch (error) {
        console.error('Error fetching data from Grafana:', error);
        res.status(500).json({ error: 'Error fetching data from Grafana' });
    }
};
