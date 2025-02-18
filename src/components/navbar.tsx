"use client";

import { Menu, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ToastContainer } from "react-toastify";
import { showToast } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useUser } from "@/src/contexts/UserContext";
import { logoutUser } from "@/src/services/UserService";

export default function Navbar() {
    // const [user, setLocalUser] = useState({name: "", email: ""});
    const { user, setUser } = useUser();
    
    const router = useRouter();
    
    async function logout() {
        const result = await logoutUser();
        if ('error' in result) {
            console.error(result.error);
        }
        else{
            showToast("Logout successful", "success");
            setUser({name: "", email: ""});
            const intervalId = setInterval(() => {
            router.push("/login");
            clearInterval(intervalId);
            }, 3000);
        }
    }
  return (
    <div className="mt-4 w-full max-w-xl justify-between ">
      <nav className="bg-green-400 shadow-md items-center rounded-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex justify-between items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open settings menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>General Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {user?.name !== "" && <span className="ml-1 text-sm">{user?.name}</span>}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
}
