const authService = require('../../../src/services/authService');
const { User } = require('../../../src/models');
const { sequelize } = require('../../../src/config/database');
const jwt = require('jsonwebtoken');

describe('Auth Service', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'STUDENT'
      };

      const result = await authService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.user.role).toBe(userData.role);
    });

    it('should not register user with existing email', async () => {
      const userData = {
        email: 'existing@test.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User'
      };

      await authService.register(userData);

      await expect(authService.register(userData))
        .rejects.toThrow('User with this email already exists');
    });

    it('should generate valid JWT token', async () => {
      const userData = {
        email: 'token@test.com',
        password: 'password123',
        firstName: 'Token',
        lastName: 'Test'
      };

      const result = await authService.register(userData);
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(result.user.id);
      expect(decoded.email).toBe(result.user.email);
      expect(decoded.role).toBe(result.user.role);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register({
        email: 'login@test.com',
        password: 'correctpassword',
        firstName: 'Login',
        lastName: 'Test'
      });
    });

    it('should login with valid credentials', async () => {
      const result = await authService.login('login@test.com', 'correctpassword');

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('login@test.com');
    });

    it('should not login with invalid password', async () => {
      await expect(authService.login('login@test.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      await expect(authService.login('nonexistent@test.com', 'password'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should not login inactive users', async () => {
      const user = await User.findOne({ where: { email: 'login@test.com' } });
      await user.update({ isActive: false });

      await expect(authService.login('login@test.com', 'correctpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});