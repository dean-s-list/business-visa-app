export const log = (
    message: string,
    data?: string | object | number | undefined | null
) => {
    if (data) {
        // eslint-disable-next-line no-console
        return console.log(message, data);
    }

    // eslint-disable-next-line no-console
    return console.log(message);
};

export const logError = (
    message: string | number | object,
    error?: unknown
) => {
    const errorMessage = error instanceof Error ? error?.message : error;

    // eslint-disable-next-line no-console
    return console.error(message, errorMessage);
};

export const isBase64 = (value: string) => {
    try {
        // Convert the string to a Buffer using the Base64 encoding
        const buffer = Buffer.from(value, "base64");

        // Check if the buffer can be encoded back to the original string
        return buffer.toString("base64") === value;
    } catch (error) {
        return false;
    }
};
