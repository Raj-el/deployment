import { jest } from '@jest/globals';

describe('dbConfig.js', () => {
  const originalEnv = { ...process.env };
  let consoleSpy;

  beforeEach(() => {
    jest.resetModules(); // ensures both mocks and modules reload
    process.env = { ...originalEnv };
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('throws an error if DB_URI or DB_API_KEY are missing', async () => {
    // mock Supabase
    jest.unstable_mockModule('@supabase/supabase-js', () => ({
      __esModule: true,
      createClient: jest.fn(),
    }));
    const { createClient } = await import('@supabase/supabase-js');

    delete process.env.DB_URI;
    delete process.env.DB_API_KEY;

    await expect(import('../../src/dbConfig/dbConfig.js')).rejects.toThrow(
      'Missing DB config environment variables. Ensure DB_URI and DB_API_KEY are set.'
    );

    expect(createClient).not.toHaveBeenCalled();
  });

  it('logs the correct host and creates Supabase client when env vars are valid', async () => {
    jest.resetModules();
    jest.unstable_mockModule('@supabase/supabase-js', () => ({
      __esModule: true,
      createClient: jest.fn(() => 'mockClient'),
    }));
    const { createClient } = await import('@supabase/supabase-js');

    process.env.DB_URI = 'https://fake-project.supabase.co';
    process.env.DB_API_KEY = 'fake_key';

    const { supabase } = await import('../../src/dbConfig/dbConfig.js');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Connecting to DB host: fake-project.supabase.co'
    );
    expect(createClient).toHaveBeenCalledWith(
      'https://fake-project.supabase.co',
      'fake_key'
    );
    expect(supabase).toBe('mockClient');
  });

  it('logs fallback message if DB_URI cannot be parsed', async () => {
    jest.resetModules();
    jest.unstable_mockModule('@supabase/supabase-js', () => ({
      __esModule: true,
      createClient: jest.fn(() => 'mockClient'),
    }));
    const { createClient } = await import('@supabase/supabase-js');

    process.env.DB_URI = 'not-a-valid-url';
    process.env.DB_API_KEY = 'fake_key';

    await import('../../src/dbConfig/dbConfig.js');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Connecting to DB (could not parse host from DB_URI)'
    );
    expect(createClient).toHaveBeenCalledTimes(1);
  });
});
