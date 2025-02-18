import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default decodeToken;