import axiosInstance from "../axios/axiosInstance";
import { setAccessToken, clearAccessToken } from "../axios/tokenCRUD";

interface LoginParams {
  email: string;
  password: string;
}

interface SignUpParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", { email, password });

    const access_token  = response.data.accessToken;

    if (!access_token) {
      throw new Error("No access token received");
    }

    // Store token
    setAccessToken(access_token);

    // Return dummy user info (can be replaced with API call later)
    return {
      user: {
        id: response.data.user.sub,
        email: response.data.user.email,
        nickname: response.data.user.nickname,
        picture: response.data.user.picture,
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signUp = async ({ email, password }: SignUpParams) => {
  try {
    const response = await axiosInstance.post("/api/auth/signup", { email, password });

    if(response.status === 201) {
      return true;
    }

  } catch (error) {
    console.error("Sign Up error:", error);
    throw error;
  }
};


export const logout = async() => {
  await clearAccessToken();
};
