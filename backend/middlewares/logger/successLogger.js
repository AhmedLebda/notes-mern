import fs from "fs";
import path from "path";
import morgan from "morgan";

// Define __dirname for ES modules
const __dirname = path.resolve();

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, "logs");
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

// Create a write stream (in append mode) for request logs in logs/req.log
const requestLogStream = fs.createWriteStream(
    path.join(logsDirectory, "req.log"),
    {
        flags: "a",
    }
);

// Setup morgan middleware for request logging to req.log (only for successful requests)
const requestLogger = morgan("combined", {
    skip: (req, res) => res.statusCode >= 400,
    stream: requestLogStream,
});

export default requestLogger;
