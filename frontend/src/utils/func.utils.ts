
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export function translateStatus(status: string): string {
    const patterns = {
        up: /Up\s+(\d+\s+(days|weeks|months|minutes))/,
        exited: /Exited\s+\((\d+)\)\s+(\d+\s+(days|weeks|months|minutes))\s+ago/,
        exitedWithoutCode: /Exited\s+(\d+\s+(days|weeks|months|minutes))\s+ago/,
        created: /Created/
    };

    const timeTranslations: { [key: string]: string } = {
        days: 'días',
        weeks: 'semanas',
        months: 'meses',
        minutes: 'minutos'
    };

    const translateTimeUnit = (unit: string): string => {
        return timeTranslations[unit] || unit;
    };

    let match = status.match(patterns.up);
    if (match) {
        return `Funcionando desde hace ${match[1].replace(/(days|weeks|months|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.exited);
    if (match) {
        return `Detenido desde hace ${match[2].replace(/(days|weeks|months|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.exitedWithoutCode);
    if (match) {
        return `Contenedor detenido desde ${match[1].replace(/(days|weeks|months|minutes)/g, translateTimeUnit)}`;
    }

    match = status.match(patterns.created);
    if (match) {
        return `Contenedor solamente creado <.<`;
    }

    return status;
};
