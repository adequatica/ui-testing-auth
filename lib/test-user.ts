// Credentials in the format: username@gmail.com
const userLogin = process.env.USER_LOGIN || '';
const userPass = process.env.USER_PASS || '';

type User = {
  login: string;
  password: string;
};

const testUser: User = {
  login: userLogin,
  password: userPass,
};

export { testUser };
