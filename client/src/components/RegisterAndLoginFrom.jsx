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
    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center ">
      
      <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12 bg-white p-4 rounded-md shadow-lg shadow-pink-500">
        <div className="Darkchat text-center font-bold ">Dark Chat</div>
        <br></br>
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