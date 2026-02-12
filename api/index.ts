import { createConfiguredApp } from "../server/_core/index.js";

// Vercel Serverless Function entry point
let app;

export default async function handler(req, res) {
  if (!app) {
    app = await createConfiguredApp();
  }
  return app(req, res);
}
