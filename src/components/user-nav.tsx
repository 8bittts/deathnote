"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName?.[0] || "U";
  
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/contacts")}>
            Contacts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 