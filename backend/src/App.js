import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// role auth
import { loadCasbinPolicies, getEnforcer } from "./casbin/casbinLoader.js";

// routes
import loginRoutes from './routes/v1/auth.routes.js';
import planRoutes from './routes/v1/plan.routes.js';
import adminRoutes from './routes/v1/admin.routes.js';
import healthScoreRoutes from './routes/v1/healthscore.routes.js';


const app = express();

async function initCasbin() {
  try {
    console.log("[App] ⏳ Initializing Casbin policies...");
    await loadCasbinPolicies();
    const enforcer = getEnforcer();
    console.log("[App] ✅ Casbin policies loaded:", await enforcer.getPolicy());
  } catch (err) {
    console.error("[App] ❌ Failed to initialize Casbin:", err.message);
    process.exit(1);
  }
}

// Call initialization *before* routes are registered
await initCasbin();

// --- Middleware stack ---
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --- Default route ---
app.get('/', (req, res) => {
  res.status(200).send('Backend is live: hit the /api/v1 endpoints for the app.');
});

// --- Versioned routes ---
app.use('/api/v1/auth', loginRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/healthscore', healthScoreRoutes);


// --- Catch-all ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
