import express from "express";
import { registerRoutes } from "../server/routes";
import { ZodError } from "zod";

// This handler is used by Vercel Serverless Functions under /api.
// It only registers the API routes; static assets are served by Vercel
// from the build output directory (dist/public).

const app = express();

app.use(express.json({
  verify: (req: any, _res, buf) => {
    // mirror the dev server behavior so req.rawBody stays available
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: false }));

// Register routes and error handler
(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || (err instanceof ZodError ? 400 : 500);
    const payload: Record<string, unknown> = { message: err.message || "Internal Server Error" };

    if (err instanceof ZodError) {
      payload.details = err.flatten();
    }

    res.status(status).json(payload);
  });
})();

export default app;

