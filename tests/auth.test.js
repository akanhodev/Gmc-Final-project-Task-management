const request = require('supertest');
const app = require('../app');

const credentials = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'secret123' };

describe('POST /api/auth/signup', () => {
  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/signup').send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(credentials.email);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects a signup missing required fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email: 'nobody@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a duplicate email', async () => {
    await request(app).post('/api/auth/signup').send(credentials);
    const res = await request(app).post('/api/auth/signup').send(credentials);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(credentials);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toEqual(expect.any(String));
  });

  it('rejects an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
  });

  it('rejects an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: credentials.password });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/signup').send(credentials);
    token = res.body.data.token;
  });

  it('returns the authenticated user profile with a valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(credentials.email);
  });

  it('rejects a request with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a request with an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
