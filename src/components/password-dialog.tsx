"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { PasswordForm } from "./password-form"
import { PasswordData } from "./dashboard"
import axios from "axios"

interface PasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passwords: PasswordData[]
  setPasswords: (passwords: PasswordData[]) => void
  onSuccessSavePassword: () => void
}

export function PasswordDialog({ open, onOpenChange, passwords, setPasswords, onSuccessSavePassword }: PasswordDialogProps) {
  
  const addPassword = async (data: PasswordData)  : Promise<Boolean> => {
    const url = "/api/v1/password";
    try{
      const response = await axios.post(url, data);
      console.log("Response:", response);
      if (response.status !== 201){
        console.log("Failed to add password!", response.data.error);
        return false;
      }
      {
        return true;
      }
    }
    catch(err){
      console.log("Failed to add password!", err);
      return false;
    }
  }


  const handleSubmit = async (data: { description: string; user_name: string; password: string }) => {
    console.log("Form submitted:", data)
    const success = await addPassword(data);
    if (success){
      setPasswords([...passwords, data])
      onSuccessSavePassword()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Information</DialogTitle>
        </DialogHeader>
        <PasswordForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

