
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Trophy, User } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    toast.success("Successfully logged out!");
    navigate('/login');
  };

  if (!username) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-game-purple/5 p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-game-purple/10">
              <User className="h-12 w-12 text-game-purple" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-gray-500">Player Profile</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div className="flex items-center space-x-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Games Won</p>
                <p className="text-sm text-gray-500">Total victories in Tic Tac Toe</p>
              </div>
            </div>
            <span className="text-2xl font-bold">0</span>
          </div>

          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
