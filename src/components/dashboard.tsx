"use client";
import { useState, useEffect} from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, Plus, Copy, Minus } from "lucide-react";
import axios from "axios";
import { ResponseData } from "@/src/types/global";
import { useUser } from "@/src/contexts/UserContext";
import { PasswordDialog } from "./password-dialog";
import { showToast } from "@/src/lib/utils";
import { copyToClipboard } from "@/src/lib/utils";

export type PasswordData = {
  description: string;
  user_name: string;
  password: string;
};

type PasswordWithId = {
  id: number;
  description: string;
  user_name: string;
  password: string;
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordData[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  let timeoutId: NodeJS.Timeout | null = null;

  const getPasswords = async () => {
    const user_email = user?.email;
    if (!user_email) {
      console.log("User email not found!");
      return;
    }
    const url = "/api/v1/password";
    const response: ResponseData = await axios.get(url);

    if ("error" in response) {
    } else {
      const res = response as {data: {data: PasswordWithId[]}};
      if (res.data.data.length > 0) {
        const data = res.data.data as PasswordWithId[];
        const passwords = data.map(({ id, ...rest }) => { if(id) return rest; return rest}); // to pass linting 
        setPasswords(passwords);
      }
    }
  };


  const onSearchChange = (value: string) => {
    
    setSearchTerm(value);
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      filterPasswords(value);
    }, 600);
  }

  const filterPasswords = (searchText: string) =>{
    const fPasswords = passwords.filter((pw) => {
      if (searchText === "") return false;
      return pw.description.toLowerCase().includes(searchText.toLowerCase());
    });

    setFilteredPasswords(fPasswords);
  }

  const onSuccessSavePassword = () => {
    showToast("Password saved successfully!", "success");
  };

  const onAddPassword = async () => {
    console.log("Add password clicked!");
    setOpen(true);
  };

  const onDeletePassword = async (description: string) => {
    const url = `/api/v1/password/`;
    const response: ResponseData = await axios.delete(url, {
      data: { description },
    });
    if ("error" in response) {
      showToast("Failed to delete password!", "error");
    }
    else{
      showToast("Password deleted successfully!", "success");
      setPasswords(passwords.filter((pw) => pw.description !== description));
    }
  }

  useEffect(() => {
    getPasswords();
  }, [user, user?.email]);


  return (
    <div className="max-w-7xl min-w-[410px] sm:min-w-[460px] mx-auto py-6 sm:px-6 lg:px-8">
      <PasswordDialog
        open={open}
        onOpenChange={setOpen}
        passwords={passwords}
        setPasswords={setPasswords}
        onSuccessSavePassword={onSuccessSavePassword}
      />
      <div className="px-4 py-6 sm:px-0">
        <div className="w-full flex justify-between">
          <div className="w-full mb-4 relative">
            <Input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => {onSearchChange(e.target.value)}}
              className="w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button
            variant="ghost"
            className="ml-[2px] font-semibold"
            onClick={onAddPassword}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="px-0 divide-y divide-gray-200">
            {filteredPasswords.map((pw, index) => (
              <li key={index}>
                <div className="py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate font-semibold">
                      {pw.description}
                    </p>
                    <div className="flex justify-end items-center">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => {
                          onDeletePassword(pw.description);
                        }}
                      >
                        <Minus />
                      </Button>

                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => {
                          copyToClipboard(pw.password);
                          showToast("Password copied to clipboard!", "success");
                        }}
                      >
                        <Copy />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col sm:flex-row sm:justify-between sm:items-center sm:space-x-4">
                    <p className="flex items-center text-sm text-gray-500">
                      <span className="font-semibold"> User Name</span>: &nbsp;
                      <span className="text-sky-500">{pw.user_name} </span>
                    </p>

                    <p className="flex items-center text-sm text-gray-500">
                      <span className="font-semibold"> Password</span>: &nbsp;
                      <span className="text-green-500">{pw.password} </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
