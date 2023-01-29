// In the format: username@gmail.com
const userLogin = process.env.USER_LOGIN || '';
const userPass = process.env.USER_PASS || '';

const testUser = {
  login: userLogin,
  password: userPass,
};

export { testUser };
