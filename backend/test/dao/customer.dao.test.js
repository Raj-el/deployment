import { jest } from '@jest/globals';

// --- Mock modules before importing DAO (ESM-safe) ---
jest.unstable_mockModule('../../src/dbConfig/dbConfig.js', () => ({
  __esModule: true,
  supabase: { from: jest.fn() },
}));

jest.unstable_mockModule('../../src/model/customer.model.js', () => ({
  __esModule: true,
  default: { 
    fromRow: jest.fn((row) => row),
    toJSON: jest.fn(function() { return { ...this }; })
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
      limit: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    jest.clearAllMocks();
    supabase.from.mockReturnValue(mockFrom);
  });

  // ---------------------------------------------------
  // FIND BY ACCOUNT ID
  // ---------------------------------------------------
  describe('findByAccountId', () => {
    it('returns null if accountId not provided', async () => {
      const result = await CustomerDAO.findByAccountId(null);
      expect(result).toBeNull();
    });

    it('returns CustomerModel.fromRow(data) when customer exists', async () => {
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

      await expect(CustomerDAO.findByAccountId('321'))
        .rejects.toThrow(`Error querying account_id '321': Supabase error`);
    });

    it('throws if unexpected error occurs', async () => {
      mockFrom.maybeSingle.mockRejectedValueOnce(new Error('Network fail'));

      await expect(CustomerDAO.findByAccountId('500'))
        .rejects.toThrow('Unexpected error in findByAccountId: Network fail');
    });
  });

  // ---------------------------------------------------
  // FIND ALL
  // ---------------------------------------------------
  describe('findAll', () => {
    it('returns array of CustomerModels on success', async () => {
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

      await expect(CustomerDAO.findAll())
        .rejects.toThrow('Error fetching all customers: Query failed');
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

      await expect(CustomerDAO.insert({ account_id: 'err' }))
        .rejects.toThrow('Error inserting customer: Insert failed');
    });
  });

  // ---------------------------------------------------
  // UPDATE BY ID
  // ---------------------------------------------------
  describe('updateById', () => {
    it('throws if accountId missing', async () => {
      await expect(CustomerDAO.updateById(null, {}))
        .rejects.toThrow('Missing account_id for update');
    });

    it('updates and returns CustomerModel.fromRow(data)', async () => {
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

      await expect(CustomerDAO.updateById('321', {}))
        .rejects.toThrow('Error updating customer 321: Update failed');
    });
  });

  // ---------------------------------------------------
  // DELETE BY ID
  // ---------------------------------------------------
  describe('deleteById', () => {
    it('throws if accountId missing', async () => {
      await expect(CustomerDAO.deleteById(null))
        .rejects.toThrow('Missing account_id for delete');
    });

    it('returns true when deletion succeeds', async () => {
      mockFrom.eq.mockResolvedValueOnce({ error: null });

      const result = await CustomerDAO.deleteById('999');
      expect(result).toBe(true);
    });

    it('throws if Supabase delete fails', async () => {
      mockFrom.eq.mockResolvedValueOnce({ error: { message: 'Delete failed' } });

      await expect(CustomerDAO.deleteById('111'))
        .rejects.toThrow('Error deleting customer 111: Delete failed');
    });
  });
});
