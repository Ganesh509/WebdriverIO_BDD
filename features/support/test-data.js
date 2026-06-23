/**
 * Test Data - Centralized test data management
 */

const testUsers = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problemUser: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password'
  }
};

const credentials = {
  empty: {
    username: '',
    password: ''
  },
  emptyPassword: {
    username: 'standard_user',
    password: ''
  },
  emptyUsername: {
    username: '',
    password: 'secret_sauce'
  }
};

const errorMessages = {
  invalidCredentials: 'Username and password do not match',
  requiredUsername: 'Username is required',
  requiredPassword: 'Password is required',
  userLocked: 'Sorry, this user has been locked out.'
};

const testDataValidation = [
  { field: 'email', value: 'valid@example.com', valid: true },
  { field: 'email', value: 'invalid-email', valid: false },
  { field: 'password', value: 'short', valid: false },
  { field: 'password', value: 'ValidPassword123!', valid: true }
];

module.exports = {
  testUsers,
  credentials,
  errorMessages,
  testDataValidation
};
