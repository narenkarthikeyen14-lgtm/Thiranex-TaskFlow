
import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("taskflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // REGISTER
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("taskflow_token", token);
      localStorage.setItem("taskflow_user", JSON.stringify(user));

      setUser(user);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("taskflow_token", token);
      localStorage.setItem("taskflow_user", JSON.stringify(user));

      setUser(user);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
