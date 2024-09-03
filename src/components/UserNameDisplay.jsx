import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FaUser } from 'react-icons/fa';

const UserNameDisplay = () => {
  const [userName, setUserName] = useState('');
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return;
    }

    const fetchUserName = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        const { user } = data;
        if (user) {
          const displayName = user.user_metadata?.display_name || user.email.split('@')[0];
          setUserName(displayName);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserName();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const displayName = session.user.user_metadata?.display_name || session.user.email.split('@')[0];
        setUserName(displayName);
      } else {
        setUserName('');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
      <FaUser className="text-gray-400" />
      <span className="text-white text-sm font-bold truncate max-w-[120px]">{userName}</span>
    </div>
  );
};

export default UserNameDisplay;
