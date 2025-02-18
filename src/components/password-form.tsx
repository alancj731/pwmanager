"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordFormProps {
  onSubmit: (data: { description: string; user_name: string; password: string }) => void
}

export function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [description, setDescription] = useState("")
  const [user_name, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ description, user_name, password })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">User Name</Label>
        <Input
          id="username"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}

