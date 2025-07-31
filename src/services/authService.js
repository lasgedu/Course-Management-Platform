  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['passwordHash'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateProfile = async (userId, updates) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Only allow certain fields to be updated
  const allowedUpdates = ['firstName', 'lastName', 'email'];
  const filteredUpdates = {};
  
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  await user.update(filteredUpdates);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};