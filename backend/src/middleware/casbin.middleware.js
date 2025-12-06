import { getEnforcer } from "../casbin/casbinLoader.js";

export function authorize(action, method) {
  return async (req, res, next) => {
    try {
      const enforcer = getEnforcer();
      const user = req.user; // from verifyAuth
      const company = user.company_name?.toLowerCase() || "unknown";
      const role = user.role?.toLowerCase() || "guest";

      const subject = user.subject || `${company}:${role}`;
      const resource = (req.baseUrl + req.route.path)
        .replace(/:\w+/g, "")
        .replace(/\/+/g, "/")
        .replace(/\/+$/, "")
        .toLowerCase();

      const allowed = await enforcer.enforce(subject, resource, action);

      if (!allowed) {
        console.warn(`[Casbin] ❌ Denied ${subject} → ${resource} [${action}]`);
        return res.status(403).json({ message: "Access denied" });
      }

      console.log(`[Casbin] ✅ Allowed ${subject} → ${resource} [${action}]`);
      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(500).json({ message: "Internal authorization error" });
    }
  };
}
