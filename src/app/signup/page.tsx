"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUserByEmail, createUser } from "@/services/UserService";
import { ToastContainer } from "react-toastify";
import { showToast } from "@/lib/utils";

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email("Invalid email address!").required(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    ),
});

export default function SignUpPage(formData: FormData) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  async function onSignUp(data: any) {
    console.log("Signing up:", data);
    const { name, email, password } = data;
    if (!name || !email || !password) {
      console.log("Name, email, and password are required");
      return;
    }

    const userFound = await getUserByEmail(email);
    console.log('userFound:', userFound);

    if (!userFound.error) {
      showToast("User already exists", "warning");
      return;
    } else {
      const user = await createUser({ name, email, password });
      console.log(user);
      if (user.error) {
        showToast("Failed to create user", "error");
      } else {
        showToast("User created successfully", "success");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSignUp)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="sr-only">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className="w-full"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                type="text"
                {...register("email")}
                className="w-full"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="w-full"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
