import axios from "axios";
import { useUserToken } from "../token/userToken";

export const refreshApi = async () => {
  try {
    const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/refresh/", {}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            timeout: 10000,
        }
    );

    useUserToken.setAccessToken(response.data.access);
    return true

  } catch  {
    throw new Error("Refresh token failed");
  }
}