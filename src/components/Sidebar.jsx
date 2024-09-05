import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlinePhotograph, HiOutlineUserGroup, HiOutlineLibrary } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { logo } from '../assets';
import LogoutButton from './LogoutButton';
import UserNameDisplay from './UserNameDisplay';

// List of navigation links
const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome },
  { name: 'Around You', to: '/around-you', icon: HiOutlinePhotograph },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
  { name: 'Library', to: '/library', icon: HiOutlineLibrary }, // Add this line
];

// Component for rendering navigation links
const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-green-300"
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
    <LogoutButton className="flex flex-row justify-start items-start mt-10 my-8  text-sm font-large text-gray-400 hover:text-green-300" />
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };
    checkLoginStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="md:flex hidden flex-col w-[200px] py-10 px-4 bg-gradient-to-tl from-slate-700 via-slate-800 to-slate-900">
        <img src={logo} alt="logo" className="w-full h-24 object-cover" />
        <NavLinks />
      </div>

      {/* Mobile Menu Icon */}
      <div className="absolute top-6 right-3 z-20 md:hidden block">
        {!mobileMenuOpen ? (
          <HiOutlineMenu
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          />
        ) : (
          <RiCloseLine
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 h-screen w-2/4 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 backdrop-blur-lg z-10 p-6 md:hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <img src={logo} alt="logo" className="w-full h-24 object-contain" />
        <UserNameDisplay className="mt-4 mb-6" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
