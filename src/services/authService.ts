import { setAccessToken } from "../axios/tokenCRUD";

const mockUsers = [{ id: 1, email: "user@example.com", password: "password" }];

interface LoginParams {
  email: string;
  password: string;
}

const mockLoginResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // JWT for authorization
  user: {
    username: "john_doe",
    role: "user",
  },
};

export const login = ({ email, password }: LoginParams) => {
  const user = mockUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) throw new Error("Invalid credentials");

  setAccessToken(mockLoginResponse.token);

  return mockLoginResponse.user;
};

export const logout = () => {
  setAccessToken("");
};
