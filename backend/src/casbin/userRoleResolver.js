import ClientAdminsDAO from '../dto/clientAdmins.dto.js';
import ClientJobFunctionsDAO from '../dto/clientJobFunctions.dto.js';
import ClientTeamDAO from '../dto/clientTeam.dto.js';
import ClientsDAO from '../dto/clients.dto.js';
import ExpertsDAO from '../dto/experts.dto.js';
import SuperAdminsDAO from '../dto/superAdmins.dto.js';
import UsersDAO from '../dto/users.dto.js';
import { slugify } from '../utils/string.js';

const clientKeyCache = new Map();
const jobFunctionCache = new Map();

const guestProfile = {
  type: 'guest',
  company_name: 'public',
  role: 'guest',
  subject: 'public:guest',
};

const buildSubject = (companyKey, roleKey) => `${companyKey}:${roleKey}`;

const resolveClientKey = async (clientId) => {
  if (!clientId) return 'unknown';
  if (clientKeyCache.has(clientId)) return clientKeyCache.get(clientId);
  const client = await ClientsDAO.findById(clientId);
  const key = client
    ? client.slug?.toLowerCase() ?? slugify(client.name, `client-${client.clientId}`)
    : `client-${clientId}`;
  clientKeyCache.set(clientId, key);
  return key;
};

const resolveJobFunctionMeta = async (jobFunctionId) => {
  if (!jobFunctionId) return null;
  if (jobFunctionCache.has(jobFunctionId)) return jobFunctionCache.get(jobFunctionId);
  const jobFunction = await ClientJobFunctionsDAO.findById(jobFunctionId);
  if (!jobFunction) return null;
  const clientKey = await resolveClientKey(jobFunction.clientId);
  const roleKey = slugify(jobFunction.functionName, `job-${jobFunctionId}`);
  const meta = {
    jobFunctionId,
    clientId: jobFunction.clientId,
    companyKey: clientKey,
    functionName: jobFunction.functionName,
    functionCategory: jobFunction.functionCategory,
    roleKey,
    subject: buildSubject(clientKey, roleKey),
  };
  jobFunctionCache.set(jobFunctionId, meta);
  return meta;
};

/**
 * Resolves the user’s access tier using the normalized tables:
 *  1. SuperAdmin (platform-wide)
 *  2. Client Admin (per tenant)
 *  3. Client Team member (job function permissions)
 *  4. Expert (cross-tenant pool)
 *  5. Guest (fallback)
 */
export async function resolveUserRole(email) {
  if (!email) {
    return { email, ...guestProfile };
  }

  const user = await UsersDAO.findByEmail(email);
  if (!user?.userId) {
    return { email, ...guestProfile };
  }

  const userId = user.userId;

  const [superAdmin] = await SuperAdminsDAO.list({
    filters: { user_id: userId, is_active: true },
    limit: 1,
  });
  if (superAdmin) {
    return {
      email,
      type: 'superadmin',
      company_name: 'platform',
      role: 'superadmin',
      subject: 'platform:superadmin',
      user_id: userId,
    };
  }

  const [clientAdmin] = await ClientAdminsDAO.list({
    filters: { user_id: userId, is_active: true },
    limit: 1,
  });
  if (clientAdmin) {
    const companyKey = await resolveClientKey(clientAdmin.clientId);
    return {
      email,
      type: 'client_admin',
      company_name: companyKey,
      client_id: clientAdmin.clientId,
      role: 'admin',
      subject: buildSubject(companyKey, 'admin'),
      user_id: userId,
    };
  }

  const [teamMember] = await ClientTeamDAO.list({
    filters: { user_id: userId, is_active: true },
    limit: 1,
  });
  if (teamMember) {
    const companyKey = await resolveClientKey(teamMember.clientId);
    const jobFunctionMeta = (await resolveJobFunctionMeta(teamMember.jobFunctionId)) || null;
    const roleKey = jobFunctionMeta?.roleKey ?? 'client-team';
    const subject = jobFunctionMeta?.subject ?? buildSubject(companyKey, roleKey);
    return {
      email,
      type: 'client_team',
      company_name: companyKey,
      client_id: teamMember.clientId,
      role: roleKey,
      job_function_id: teamMember.jobFunctionId,
      job_function_name: jobFunctionMeta?.functionName,
      subject,
      user_id: userId,
    };
  }

  const [expert] = await ExpertsDAO.list({
    filters: { user_id: userId, is_active: true },
    limit: 1,
  });
  if (expert) {
    return {
      email,
      type: 'expert',
      company_name: 'global',
      role: 'expert',
      expert_id: expert.expertId,
      subject: 'global:expert',
      user_id: userId,
    };
  }

  return { email, ...guestProfile };
}
