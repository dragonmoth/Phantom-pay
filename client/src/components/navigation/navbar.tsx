import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, User, Settings, LogOut } from "lucide-react";

export function Navbar() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Ghost Employee Hunter
              </h1>
              <p className="text-sm text-gray-300 font-medium">
                AI-Powered Payroll Security
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-800"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={(user as any).profileImageUrl || undefined} 
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary-900 text-primary-300 font-semibold">
                      {(user as any).firstName && (user as any).lastName 
                        ? `${(user as any).firstName[0]}${(user as any).lastName[0]}`.toUpperCase()
                        : (user as any).firstName 
                          ? (user as any).firstName[0].toUpperCase()
                          : (user as any).lastName 
                            ? (user as any).lastName[0].toUpperCase()
                            : <User className="h-4 w-4" />
                      }
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {(user as any).firstName || (user as any).lastName ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() : 'User'}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {(user as any).email || 'No email provided'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700 text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="hover:bg-gray-700 text-white"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}