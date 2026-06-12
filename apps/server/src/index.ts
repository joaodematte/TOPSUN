import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@topsun/api/context";
import { appRouter } from "@topsun/api/routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    allowMethods: ["GET", "POST", "OPTIONS"],
    origin: process.env.CORS_ORIGIN ?? "",
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    createContext: (_opts, context) => createContext({ context }),
    router: appRouter,
  })
);

app.get("/", (c) => c.text("OK"));

export default {
  fetch: app.fetch,
  port: 3001,
};
