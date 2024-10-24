import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { FaUser } from "react-icons/fa";

// Component to display the user's name
const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");

  // Function to fetch the user's name from Supabase
  const fetchUserName = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    if (data?.user?.email) {
      setUserName(data.user.email.split('@')[0]);
    }
  }

  // Effect to fetch the user's name on component mount
  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    fetchUserName();
  }, []);

  // Render the user's name with an icon
  return (
    <div className="flex items-center px-3 py-1 space-x-2 bg-gray-800 rounded-full">
      <FaUser className="text-gray-400" />
      <span className="text-white text-sm font-bold truncate max-w-[120px]">
        {userName}
      </span>
    </div>
  );
};

export default UserNameDisplay;