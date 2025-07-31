const { User } = require('../../../src/models');
const { sequelize } = require('../../../src/config/database');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        passwordHash: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'FACILITATOR'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe(userData.role);
      expect(user.isActive).toBe(true);
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'hash@example.com',
        passwordHash: 'plainpassword',
        firstName: 'Jane',
        lastName: 'Doe'
      };

      const user = await User.create(userData);
      
      expect(user.passwordHash).not.toBe('plainpassword');
      expect(user.passwordHash.length).toBeGreaterThan(20);
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        passwordHash: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        passwordHash: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    it('should correctly compare passwords', async () => {
      const user = await User.create({
        email: 'compare@example.com',
        passwordHash: 'mypassword',
        firstName: 'Test',
        lastName: 'User'
      });

      const isValid = await user.comparePassword('mypassword');
      const isInvalid = await user.comparePassword('wrongpassword');

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('User Update', () => {
    it('should update user fields', async () => {
      const user = await User.create({
        email: 'update@example.com',
        passwordHash: 'password123',
        firstName: 'Old',
        lastName: 'Name'
      });

      await user.update({
        firstName: 'New',
        lastName: 'Updated'
      });

      expect(user.firstName).toBe('New');
      expect(user.lastName).toBe('Updated');
    });

    it('should rehash password on update', async () => {
      const user = await User.create({
        email: 'rehash@example.com',
        passwordHash: 'oldpassword',
        firstName: 'Test',
        lastName: 'User'
      });

      const oldHash = user.passwordHash;
      
      await user.update({
        passwordHash: 'newpassword'
      });

      expect(user.passwordHash).not.toBe(oldHash);
      expect(user.passwordHash).not.toBe('newpassword');
    });
  });
});