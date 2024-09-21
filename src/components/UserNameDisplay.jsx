import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { FaUser } from "react-icons/fa";

const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");

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
  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    fetchUserName();
  }, []);

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