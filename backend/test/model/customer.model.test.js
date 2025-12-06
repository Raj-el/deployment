import { jest } from '@jest/globals';

// --- Mock Supabase + Model before import (ESM-safe) ---
jest.unstable_mockModule('../../src/dbConfig/dbConfig.js', () => ({
  __esModule: true,
  supabase: { from: jest.fn() },
}));

jest.unstable_mockModule('../../src/model/customer.model.js', () => ({
  __esModule: true,
  default: {
    fromRow: jest.fn((row) => row),
    toJSON: jest.fn(function () {
      return { ...this };
    }),
  },
}));

// Dynamic imports AFTER mocks
const { default: CustomerDAO } = await import('../../src/dao/customer.dao.js');
const { supabase } = await import('../../src/dbConfig/dbConfig.js');
const { default: CustomerModel } = await import('../../src/model/customer.model.js');

describe('CustomerDAO', () => {
  let mockFrom;

  beforeEach(() => {
    mockFrom = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
      limit: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    supabase.from.mockReturnValue(mockFrom);
  });

  // ---------------------------------------------------
  // FIND BY ACCOUNT ID
  // ---------------------------------------------------
  describe('findByAccountId', () => {
    it('returns null if no accountId provided', async () => {
      const result = await CustomerDAO.findByAccountId(null);
      expect(result).toBeNull();
    });

    it('returns CustomerModel.fromRow(data) when found', async () => {
      const mockData = { account_id: '123' };
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await CustomerDAO.findByAccountId('123');

      expect(result).toEqual(mockData);
      expect(CustomerModel.fromRow).toHaveBeenCalledWith(mockData);
    });

    it('returns null if no record found', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      const result = await CustomerDAO.findByAccountId('999');
      expect(result).toBeNull();
    });

    it('throws if Supabase returns error', async () => {
      mockFrom.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Supabase error' },
      });

      // handle both Error or plain object
      await expect(CustomerDAO.findByAccountId('321')).rejects.toMatchObject({
        message: expect.stringMatching(/Supabase error/),
      });
    });

    it('throws if unexpected error occurs', async () => {
      mockFrom.maybeSingle.mockRejectedValueOnce(new Error('Network fail'));
      await expect(CustomerDAO.findByAccountId('500')).rejects.toThrow('Network fail');
    });
  });

  // ---------------------------------------------------
  // FIND ALL
  // ---------------------------------------------------
  describe('findAll', () => {
    it('returns array of CustomerModels', async () => {
      const mockRows = [{ id: 1 }, { id: 2 }];
      mockFrom.limit.mockResolvedValueOnce({ data: mockRows, error: null });

      const result = await CustomerDAO.findAll(2);

      expect(result).toEqual(mockRows);
      expect(CustomerModel.fromRow).toHaveBeenCalledTimes(2);
    });

    it('throws if Supabase returns error', async () => {
      mockFrom.limit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Query failed' },
      });

      await expect(CustomerDAO.findAll()).rejects.toMatchObject({
        message: expect.stringMatching(/Query failed/),
      });
    });
  });

  // ---------------------------------------------------
  // INSERT
  // ---------------------------------------------------
  describe('insert', () => {
    it('inserts plain object successfully', async () => {
      const mockRow = { account_id: 'abc' };
      mockFrom.single.mockResolvedValueOnce({ data: mockRow, error: null });

      const result = await CustomerDAO.insert(mockRow);

      expect(result).toEqual(mockRow);
      expect(CustomerModel.fromRow).toHaveBeenCalledWith(mockRow);
    });

    it('inserts CustomerModel instance successfully', async () => {
      const mockRow = { account_id: 'xyz' };
      const mockInstance = { toJSON: jest.fn(() => ({ account_id: 'xyz' })) };
      mockFrom.single.mockResolvedValueOnce({ data: mockRow, error: null });

      const result = await CustomerDAO.insert(mockInstance);

      expect(result).toEqual(mockRow);
      expect(CustomerModel.fromRow).toHaveBeenCalledWith(mockRow);
    });

    it('throws if Supabase insert fails', async () => {
      mockFrom.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Insert failed' },
      });

      await expect(CustomerDAO.insert({ account_id: 'err' })).rejects.toMatchObject({
        message: expect.stringMatching(/Insert failed/),
      });
    });
  });

  // ---------------------------------------------------
  // UPDATE BY ID
  // ---------------------------------------------------
  describe('updateById', () => {
    it('throws if accountId missing', async () => {
      await expect(CustomerDAO.updateById(null, {})).rejects.toThrow(
        'Missing account_id for update'
      );
    });

    it('updates and returns CustomerModel.fromRow', async () => {
      const mockRow = { account_id: '321', account_name: 'Updated' };
      mockFrom.single.mockResolvedValueOnce({ data: mockRow, error: null });

      const result = await CustomerDAO.updateById('321', { account_name: 'Updated' });

      expect(result).toEqual(mockRow);
      expect(CustomerModel.fromRow).toHaveBeenCalledWith(mockRow);
    });

    it('throws if Supabase update fails', async () => {
      mockFrom.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });

      await expect(CustomerDAO.updateById('321', {})).rejects.toMatchObject({
        message: expect.stringMatching(/Update failed/),
      });
    });
  });

  // ---------------------------------------------------
  // DELETE BY ID
  // ---------------------------------------------------
  describe('deleteById', () => {
    it('throws if accountId missing', async () => {
      await expect(CustomerDAO.deleteById(null)).rejects.toThrow(
        'Missing account_id for delete'
      );
    });

    it('returns true on successful delete', async () => {
      mockFrom.eq.mockResolvedValueOnce({ error: null });
      const result = await CustomerDAO.deleteById('999');
      expect(result).toBe(true);
    });

    it('throws if Supabase delete fails', async () => {
      mockFrom.eq.mockResolvedValueOnce({ error: { message: 'Delete failed' } });

      await expect(CustomerDAO.deleteById('111')).rejects.toMatchObject({
        message: expect.stringMatching(/Delete failed/),
      });
    });
  });
});
