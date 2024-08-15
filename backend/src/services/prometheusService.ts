import axios from 'axios';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

export const getContainerMetrics = async () => {
    try {
        const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
            params: {
                query: 'container_tasks_state{job="cadvisor"}' //TODO: Ajusta la query según lo que necesites
            }
        });
        console.log("Data: ", response);
        return response.data.data.result;
    } catch (error) {
        console.error('Error fetching metrics from Prometheus:', error);
        throw new Error('Error fetching metrics from Prometheus');
    }
};
