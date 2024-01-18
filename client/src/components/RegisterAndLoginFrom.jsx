import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const RegisterAndLoginFrom = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  //Rename setUsername
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const url = isLoginOrRegister === "register" ? "register" : "login";
      const response = await axios.post(url, { username, password });
  
      // Check if the response is successful (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        const { data } = response;
  
        // Set the user context data (assuming setId and setUsername are available in the context)
        setId(data.id);
        setUsername(data.username);
  
        // Update any other necessary state or perform additional actions
      } else {
        // Handle unsuccessful response (e.g., display an error message)
        console.error("Unsuccessful response:", response);
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error("Error:", error.message);
    }
  };
  
  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center " style={{ opacity: 0.8 }}>
      
      <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12 bg-white p-4 rounded-md shadow-md shadow-white" style={{ opacity: 0.8 }}>
        <input
          type="text"
          value={username}
          className="block w-full rounded-sm p-2 mb-2 border"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          className="block w-full rounded-sm p-2 mb-2 border"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white block w-full rounded-sm p-2  hover:bg-white hover:text-black">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member ?{" "}
              <button
                className="ml-2 "
                onClick={() => {
                  setIsLoginOrRegister("login");
                }}
              >
                Login here
              </button>{" "}
            </div>
          )}

          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account{" "}
              <button
                className="ml-1"
                onClick={() => {
                  setIsLoginOrRegister("register");
                }}
              >
                Register
              </button>{" "}
            </div>
          )}
        </div>
      </form>
    </div>
  );  
};

export default RegisterAndLoginFrom;