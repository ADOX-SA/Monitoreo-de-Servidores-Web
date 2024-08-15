import { Request, Response } from 'express';
import { getContainerMetrics } from '../services/prometheusService';

export const getContainerMetricsHandler = async (req: Request, res: Response) => {
    try {
        const metrics = await getContainerMetrics(); // Llama al servicio para obtener las métricas
        res.json(metrics); // Devuelve las métricas en formato JSON
    } catch (error) {
        console.error('Error fetching container metrics:', error);
        res.status(500).json({ error: 'Error fetching container metrics' });
    }
};
