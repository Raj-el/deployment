import LoginModel from '../../src/model/login.model.js';

describe('LoginModel', () => {
  // ---------- constructor ----------
  test('constructor sets properties correctly', () => {
    const model = new LoginModel({ email: 'sai@asu.edu', password: 'hashed123' });
    expect(model).toMatchObject({
      email: 'sai@asu.edu',
      password: 'hashed123',
    });
    expect(model.createdAt).toBeInstanceOf(Date);
  });

  test('constructor accepts createdAt parameter', () => {
    const date = new Date('2025-01-01T00:00:00Z');
    const model = new LoginModel({ email: 'sai@asu.edu', password: 'test123', createdAt: date });
    expect(model.createdAt).toBeInstanceOf(Date);
  });

  // ---------- fromRow ----------
  test('fromRow creates instance from valid row', () => {
    const row = { email: 'sai@asu.edu', password: 'hash' };
    const model = LoginModel.fromRow(row);

    expect(model).toBeInstanceOf(LoginModel);
    expect(model).toMatchObject({
      email: 'sai@asu.edu',
      password: 'hash',
    });
  });

  test('fromRow returns null when input is null or undefined', () => {
    expect(LoginModel.fromRow(null)).toBeNull();
    expect(LoginModel.fromRow(undefined)).toBeNull();
  });

  test('fromRow correctly parses created_at when present', () => {
    const row = {
      email: 'sai@asu.edu',
      password: 'hash321',
      created_at: '2025-01-01T00:00:00Z',
    };

    const model = LoginModel.fromRow(row);

    expect(model).toBeInstanceOf(LoginModel);
    expect(model.createdAt).toBeInstanceOf(Date);
    expect(model.createdAt.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });

  // ---------- toJSON ----------
  test('toJSON excludes password by default', () => {
    const model = new LoginModel({ email: 'sai@asu.edu', password: 'hidden' });
    const json = model.toJSON();

    expect(json).toMatchObject({ email: 'sai@asu.edu' });
    expect(json.password).toBeUndefined();
  });

  test('toJSON includes password when includePassword = true', () => {
    const model = new LoginModel({ email: 'sai@asu.edu', password: 'hash123' });
    const json = model.toJSON({ includePassword: true });

    expect(json).toMatchObject({
      email: 'sai@asu.edu',
      password: 'hash123',
    });
  });

  test('toJSON handles missing options gracefully', () => {
    const model = new LoginModel({ email: 'sai@asu.edu', password: 'hash' });
    const json = model.toJSON(undefined);
    expect(json).toMatchObject({ email: 'sai@asu.edu' });
  });
});
