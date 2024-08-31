/* trunk-ignore-all(prettier) */
"use client";

import React, { useState } from "react";

import { Database } from "../types_db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  return null;
};

export default SupabaseProvider;
