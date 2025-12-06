import { createClient } from '@supabase/supabase-js';

const { DB_URI, DB_API_KEY } = process.env;

// Basic validation: fail fast with a clear message if required env vars are missing
if (!DB_URI || !DB_API_KEY) {
	throw new Error('Missing DB config environment variables. Ensure DB_URI and DB_API_KEY are set.');
}

// Avoid printing full secrets in logs; print only the host for debugging
try {
	const host = new URL(DB_URI).host;
	console.log(`Connecting to DB host: ${host}`);
} catch (e) {
	console.log('Connecting to DB (could not parse host from DB_URI)');
}

const supabase = createClient(DB_URI, DB_API_KEY);

export { supabase };