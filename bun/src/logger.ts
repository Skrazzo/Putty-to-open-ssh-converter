import pino from "pino";

// Set up logger
const logger = pino({
    transport: {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
            {
                target: "pino/file",
                options: {
                    sync: false,
                    destination: "/logs/app.log",
                    mkdir: true,
                },
            },
        ],
    },
});

export default logger;
