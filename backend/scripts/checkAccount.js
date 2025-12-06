import 'dotenv/config';
import CustomerDAO from '../src/dao/customer.dao.js';

const id = process.argv[2];
if (!id) { console.error('Usage: node scripts/checkAccount.js <ACCOUNT_ID>'); process.exit(1); }

(async () => {
  try {
    const c = await CustomerDAO.findByAccountId(id);
    console.log(c ? (c.toJSON ? c.toJSON() : c) : 'NOT FOUND');
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    process.exit(0);
  }
})();