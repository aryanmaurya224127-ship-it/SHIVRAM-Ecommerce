
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shivram_user");
    const token = localStorage.getItem("shivram_token");

    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("shivram_user");
        localStorage.removeItem("shivram_token");
        return null;
      }
    }

    return null;
  });

  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("shivram_user", JSON.stringify(userData));
    localStorage.setItem("shivram_token", token);

    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("shivram_user");
    localStorage.removeItem("shivram_token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        token: localStorage.getItem("shivram_token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

