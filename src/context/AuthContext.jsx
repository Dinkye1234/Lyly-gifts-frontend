import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage-аас хэрэглэгчийн мэдээлэл авах
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Нэвтрэх функц
  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password) {
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // Бүртгүүлэх функц
  const register = async (email, password, name) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password && name) {
      const mockUser = {
        id: "1",
        email,
        name,
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // Гарах функц
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
