import axios from "axios";
import url from "../utils/URL";

async function registerUser({ email, password, username }) {
  const response = await axios
    .post(`${url}/auth/local/regester`, {
      username,
      email,
      password
    })
    .catch(error => console.log(error));
  return response.data;
}

export default registerUser;
