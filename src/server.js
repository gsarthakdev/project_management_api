import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// OpenAPI setup
let specs;
try {
  specs = yaml.load(fs.readFileSync("./docs/openapi.yaml", "utf8"));
} catch (error) {
  console.log("Failed to load OpenAPI specification", error);
  process.exit(1);
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Project Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Generic Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
