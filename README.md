# Arquitectura del Proyecto:

En esta arquitectura, cAdvisor obtiene la información de los contenedores del servidor 1, como se muestra en la imagen. Esta información es proporcionada a Prometheus. Desde el backend, realizamos consultas a Prometheus para obtener la información necesaria sobre el estado de los servidores, verificando si están activos o caídos. Esta información se refleja en el frontend para su visualización.

![image](https://github.com/user-attachments/assets/994500cb-6bd8-4477-950a-ef738d571bf6)

## Comandos del proyecto Back-end/Front-end:

- `yarn dev`: Incia el proyecto.
- `yarn`: Instala las dependecias necesarias para iniciarlo.
- `yarn add @example`: Instala una dependecia en específico.

## Comandos Docker:

- `docker compose pull`: Descarga las imágenes.
- `docker-compose up -d`: Crea y levanta las imágenes en segundo plano.
- `docker ps`: Verifica qué contenedores están en ejecución.
- `docker-compose ps`: Muestra los contenedores en ejecución de una forma más sencilla.
