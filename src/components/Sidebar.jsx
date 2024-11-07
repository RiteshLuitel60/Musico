// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlinePhotograph, HiOutlineUserGroup } from 'react-icons/hi';
import { MdLibraryMusic } from "react-icons/md";
import { RiCloseLine } from 'react-icons/ri';
import { supabase } from '../utils/supabaseClient';
import LogoutButton from './LogoutButton';
import UserNameDisplay from './UserNameDisplay';
import { History } from 'lucide-react';
import Logo from './Logo';

// Define navigation links
const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome },
  { name: 'Around You', to: '/around-you', icon: HiOutlinePhotograph },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
  { name: 'Library', to: '/library', icon: MdLibraryMusic }, 
  { name: 'Recognized Songs', to: '/recognized-songs-history', icon: History },
];

// NavLinks component to render navigation links
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
    <LogoutButton className="flex flex-row justify-start items-start mt-5 my-5  text-sm font-large text-gray-400 hover:text-green-300" />
  </div>
);

// Main Sidebar component
const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to check and update login status
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
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="md:flex hidden flex-col w-[200px] py-10 px-4 bg-slate-800 z-20">
        <div className="w-3/4 mt-[-62px]">
          <Logo />
        </div>
        <NavLinks />
      </div>

      {/* Mobile menu button */}
      <div className="absolute md:hidden block top-6 right-3 z-30">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-6 h-6 text-white" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-6 h-6 text-white" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>
        

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-slate-800 backdrop-blur-lg z-20 p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <div className="w-3/4">
          <Logo  />
        </div>
        <div>
          <UserNameDisplay className="mt-4 mb-6 text-white" />
          <NavLinks handleClick={() => setMobileMenuOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
