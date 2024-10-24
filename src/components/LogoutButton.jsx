import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { LogOutIcon } from 'lucide-react';

// Component for rendering a logout button
const LogoutButton = ({ className }) => {
  const navigate = useNavigate();

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login'); // Go to login page after logging out
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Render the logout button
  return (
    <button 
      onClick={handleLogout}
      className={`py-2 px-4 mb-32 text-slate-400 rounded hover:bg-slate-700 text-sm font-semibold hover:text-white transition-colors ${className} flex items-center`}
    >
      <p className='text-sm font-semibold'> Logout </p> <LogOutIcon className='ml-2 w-4 h-4' />
    </button>
  );
};

export default LogoutButton;