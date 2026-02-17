import { createConfiguredApp } from "../server/_core/index.js";
import type { Express, Request, Response } from "express";

// Railway deployment entry point
let app: Express;

export default async function handler(req: Request, res: Response) {
  if (!app) {
    app = await createConfiguredApp();
  }
  return app(req, res);
}
