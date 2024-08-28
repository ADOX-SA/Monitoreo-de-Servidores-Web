
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export function translateStatus(status: string): string {
    const patterns = {
        up: /Up\s+(\d+\s+(days|weeks|months|hours|minutes))/,
        exited: /Exited\s+\((\d+)\)\s+(\d+\s+(days|weeks|months|hours|minutes))\s+ago/,
        exitedWithoutCode: /Exited\s+(\d+\s+(days|weeks|months|hours|minutes))\s+ago/,
        created: /Created/
    };

    const timeTranslations: { [key: string]: string } = {
        days: 'días',
        weeks: 'semanas',
        months: 'meses',
        hours: 'horas',
        minutes: 'minutos'
    };

    const translateTimeUnit = (unit: string): string => {
        return timeTranslations[unit] || unit;
    };

    let match = status.match(patterns.up);
    if (match) {
        return `Hace ${match[1].replace(/(days|weeks|months|hours|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.exited);
    if (match) {
        return `Hace ${match[2].replace(/(days|weeks|months|hours|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.exitedWithoutCode);
    if (match) {
        return `Hace ${match[1].replace(/(days|weeks|months|hours|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.created);
    if (match) {
        return `Contenedor creado`;
    }

    return status;
};

export const extractKeyword = (name: string): string => {
    // Define las palabras clave que quieres buscar
    const keywords = ["Api", "Web", "Back", "Front", "Socket", "Portainer agent", "Data tcp", "NetData", "Data", "Mensajeria", "Control V2", "Control ", "Simulation"];
    const lowercasedName = name.toLowerCase().replace(/_/g, ' ');
    
    // Busca la primera palabra clave que esté contenida en el nombre
    for (const keyword of keywords) {
        if (lowercasedName.includes(keyword.toLowerCase())) {
            return keyword;
        }
    }

    // Retorna el nombre original si no se encuentra ninguna palabra clave
    return name;
};