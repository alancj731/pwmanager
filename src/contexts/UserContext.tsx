'use client'

import { useState, useEffect } from "react";
import { createContext, useContext, ReactNode } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const url = "/api/v1/user/verify";
      try{
        
        const response = await axios.get(url);
        if ("error" in response) {
          setUser(null);
          console.log("User is not logged in!");
        } else {
          const { name, email } = response.data.data;
          setUser({ name, email });
          console.log("User is logged in:", name, email);
        }
      }
      catch(err){
        setUser(null);
        console.log(`User is not logged in! Error: ${err}`);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
