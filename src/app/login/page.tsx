"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userLogin } from "@/src/services/UserService";
import { ToastContainer } from "react-toastify";
import { showToast } from "@/src/lib/utils";
import { useUser } from "@/src/contexts/UserContext";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email address!").required(),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: {
    email: string;
    password: string;
  }): Promise<void> => {
    const { email, password } = data;
    if (!email || !password) {
      return;
    }

    const result = await userLogin({ email, password });
    if (result.error) {
      showToast(result.error, "error");
      console.log(result.error);
    } else {
      const res = result as { data: { name: string; email: string } };
      setUser(res.data);

      const name = res.data.name;
      showToast(`Welcom ${name} !`, "success");

      const intervalId = setInterval(() => {
        router.push("/");
        clearInterval(intervalId);
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder=""
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
}
