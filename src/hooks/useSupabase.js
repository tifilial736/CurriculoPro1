// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import { getSupabase, isSupabaseConfigured, getConfigStatus } from '../lib/supabase';

export const useSupabase = () => {
  const [supabase, setSupabase] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configStatus, setConfigStatus] = useState({});

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    setConfigStatus(getConfigStatus());
    
    if (configured) {
      setSupabase(getSupabase());
    }
  }, []);

  return { supabase, isConfigured, configStatus };
};