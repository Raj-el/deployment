import { jest } from '@jest/globals';

// --- Mock modules before importing DAO (ESM-safe) ---
jest.unstable_mockModule('../../src/dbConfig/dbConfig.js', () => ({
  __esModule: true,
  supabase: { from: jest.fn() }, // named export
}));

jest.unstable_mockModule('../../src/model/login.model.js', () => ({
  __esModule: true,
  default: { fromRow: jest.fn((row) => row) }, // default export
}));

// Dynamic imports AFTER mocks
const { default: LoginDAO } = await import('../../src/dao/login.dao.js');
const { supabase } = await import('../../src/dbConfig/dbConfig.js');
const { default: LoginModel } = await import('../../src/model/login.model.js');

describe('LoginDAO', () => {
  let mockFrom;

  beforeEach(() => {
    mockFrom = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    supabase.from.mockReturnValue(mockFrom);
  });

  // ---------------------------------------------------
  // FIND BY EMAIL
  // ---------------------------------------------------
  describe('findByEmail', () => {
    it('returns null if email not provided', async () => {
      const result = await LoginDAO.findByEmail(null);
      expect(result).toBeNull();
    });

    it('returns LoginModel.fromRow(data) when user exists', async () => {
      const mockData = { email: 'user@test.com' };
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await LoginDAO.findByEmail('user@test.com');

      expect(result).toEqual(mockData);
      expect(LoginModel.fromRow).toHaveBeenCalledWith(mockData);
    });

    it('throws if Supabase returns an error', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Supabase error' },
      });

      await expect(LoginDAO.findByEmail('user@test.com'))
        .rejects.toThrow('Failed to fetch login: Supabase error');
    });

    it('returns null if user not found', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      const result = await LoginDAO.findByEmail('no@user.com');
      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------
  // CREATE USER
  // ---------------------------------------------------
  describe('createUser', () => {
    const email = 'team@test.com';
    const passwordHash = 'hashed_pass';

    it('throws if email or passwordHash missing', async () => {
      await expect(LoginDAO.createUser({})).rejects.toThrow(
        'Email and password hash are required'
      );
    });

    it('throws if cs_team check fails', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Team check failed' },
      });

      await expect(LoginDAO.createUser({ email, passwordHash }))
        .rejects.toThrow('Failed to verify cs_team membership: Team check failed');
    });

    it('throws if email not found in cs_team', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(LoginDAO.createUser({ email, passwordHash }))
        .rejects.toThrow(`Cannot create login — email '${email}' not found in cs_team`);
    });

    it('throws if insert fails', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: { email }, error: null });
      mockFrom.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Insert failed' },
      });

      await expect(LoginDAO.createUser({ email, passwordHash }))
        .rejects.toThrow(`Failed to create login for '${email}': Insert failed`);
    });

    it('creates user successfully', async () => {
      const mockRow = { email, password: passwordHash };
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: { email }, error: null });
      mockFrom.single.mockResolvedValueOnce({ data: mockRow, error: null });

      const result = await LoginDAO.createUser({ email, passwordHash });

      expect(result).toEqual(mockRow);
      expect(LoginModel.fromRow).toHaveBeenCalledWith(mockRow);
    });
  });

  // ---------------------------------------------------
  // UPDATE PASSWORD
  // ---------------------------------------------------
  describe('updatePasswordByEmail', () => {
    const email = 'update@test.com';
    const newHash = 'new_hashed';

    it('throws if missing parameters', async () => {
      await expect(LoginDAO.updatePasswordByEmail(null, newHash))
        .rejects.toThrow('Email and new password hash are required');
    });

    it('throws if Supabase update fails', async () => {
      mockFrom.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });

      await expect(LoginDAO.updatePasswordByEmail(email, newHash))
        .rejects.toThrow(`Failed to update password for '${email}': Update failed`);
    });

    it('returns updated user on success', async () => {
      const mockRow = { email, password: newHash };
      mockFrom.single.mockResolvedValueOnce({ data: mockRow, error: null });

      const result = await LoginDAO.updatePasswordByEmail(email, newHash);

      expect(result).toEqual(mockRow);
      expect(LoginModel.fromRow).toHaveBeenCalledWith(mockRow);
    });
  });
});
