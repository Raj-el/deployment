// loaders/casbinLoader.js
import { newEnforcer, newModel } from 'casbin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import RolePermissionsDAO from '../dto/rolePermissions.dto.js';
import ClientJobFunctionsDAO from '../dto/clientJobFunctions.dto.js';
import ClientsDAO from '../dto/clients.dto.js';
import { slugify } from '../utils/string.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let enforcer;

const normalizeResource = (value) => {
  if (!value) return null;
  return String(value).trim().replace(/\/+$/, '').toLowerCase();
};

const normalizeAction = (value) => {
  if (!value) return null;
  return String(value).trim().toLowerCase();
};

const buildClientKey = (client) => {
  if (!client) return 'client-unknown';
  return client.slug?.toLowerCase() ?? slugify(client.name, `client-${client.clientId}`);
};

const buildSubjectKey = (clientKey, jobFunctionName, fallback) => {
  const fnKey = slugify(jobFunctionName, fallback);
  return `${clientKey}:${fnKey}`;
};

export async function loadCasbinPolicies() {
  const modelPath = path.join(__dirname, 'model.conf');
  const modelConf = fs.readFileSync(modelPath, 'utf8');
  const model = newModel(modelConf);

  enforcer = await newEnforcer(model);
  enforcer.clearPolicy();

  const [permissions, jobFunctions, clients] = await Promise.all([
    RolePermissionsDAO.list({ limit: 5000 }),
    ClientJobFunctionsDAO.list({ filters: { is_active: true }, limit: 1000 }),
    ClientsDAO.list({ filters: { is_active: true }, limit: 200 }),
  ]);

  const clientKeyById = new Map(
    clients.map((client) => [client.clientId, buildClientKey(client)])
  );

  const jobFunctionById = new Map(
    jobFunctions.map((jobFunction) => {
      const clientKey =
        clientKeyById.get(jobFunction.clientId) || `client-${jobFunction.clientId}`;
      const subject = buildSubjectKey(
        clientKey,
        jobFunction.functionName,
        `job-${jobFunction.jobFunctionId}`
      );
      return [
        jobFunction.jobFunctionId,
        {
          jobFunctionId: jobFunction.jobFunctionId,
          clientKey,
          subject,
        },
      ];
    })
  );

  for (const perm of permissions) {
    const jobFunctionMeta = jobFunctionById.get(perm.jobFunctionId);
    if (!jobFunctionMeta) {
      console.warn(
        `[Casbin] ⚠️ Skipping role permission ${perm.rolePermissionId} — missing job function ${perm.jobFunctionId}`
      );
      continue;
    }

    const resource = normalizeResource(perm.resourceType);
    const action = normalizeAction(perm.action);

    if (!resource || !action) {
      console.warn(
        `[Casbin] ⚠️ Skipping role permission ${perm.rolePermissionId} — invalid resource/action`
      );
      continue;
    }

    await enforcer.addPolicy(jobFunctionMeta.subject, resource, action);
  }

  // Platform super admins keep a universal allow rule.
  await enforcer.addPolicy('platform:superadmin', '*', '.*');

  const policies = await enforcer.getPolicy();
  console.log(
    `[Casbin] ✅ Loaded ${policies.length} policies for ${jobFunctionById.size} job functions.`
  );
  console.table(policies);

  return enforcer;
}

export function getEnforcer() {
  if (!enforcer) {
    throw new Error('Casbin not initialized. Call loadCasbinPolicies() first.');
  }
  return enforcer;
}
