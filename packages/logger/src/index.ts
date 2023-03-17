import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

console.log("process.env.LOGFLARE_KEY1", process.env.LOGFLARE_KEY);

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
  apiKey: process.env.LOGFLARE_KEY!,
  sourceToken: process.env.LOGFLARE_KEY!,
});

// create pino logger
const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug",
    base: {
      env: process.env.VERCEL_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream
);

export const log = logger.info.bind(logger);

export default logger;
