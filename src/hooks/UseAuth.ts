"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosResponse } from "axios";
import { ResponseData } from "@/types/global.d";
import { setUser } from "@/src/services/UserService";

const useAuth = async () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem("token"); // Or get from cookies

      if (!token) {
        // Redirect to login if there's no token
        setLoading(false);
        router.push("/login");
      } 
      else {
        try {
          const verifyUrl = "/api/v1/user/verify";
          const response: AxiosResponse<ResponseData> = await axios.get(
            verifyUrl,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status !== 200) {
            // Redirect to login if the token is invalid
            setLoading(false);
            router.push("/login");
          } else {
            const { name, email } = response.data.data;
            setUser(name, email);
            setIsAuthenticated(true);
            setLoading(false);
          }
        } 
        catch (err: any) {
          setLoading(false);
          router.push("/login");
        }
      }
}
  }, []);

  return { loading, isAuthenticated };
};

export default useAuth;
