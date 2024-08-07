import fs from "fs";
import path from "path";
import morgan from "morgan";

// Define __dirname for ES modules
const __dirname = path.resolve();

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, "logs");
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

// Create a write stream (in append mode) for error logs in logs/error.log
const errorLogStream = fs.createWriteStream(
    path.join(logsDirectory, "error.log"),
    {
        flags: "a",
    }
);

// Setup morgan middleware for error logging to error.log
const errorLogger = morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream,
});

export default errorLogger;
