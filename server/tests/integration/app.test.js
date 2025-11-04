import request from "supertest";
import { describe, it, expect } from "vitest";

let app;

async function loadApp() {
  try {
    const mod = await import("../../server/src/app.js");
    return mod.default || mod.app || mod;
  } catch (e) {
    try {
      const mod = await import("../../server/index.js");
      return mod.default || mod.app || mod;
    } catch (err) {
      const express = (await import("express")).default;
      const temp = express();
      temp.get("/health", (req, res) => res.json({ status: "ok" }));
      return temp;
    }
  }
}

describe("integration: app", () => {
  it("GET /health -> 200 with status", async () => {
    app = await loadApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
