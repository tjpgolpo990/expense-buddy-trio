// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://etnrffbweryhhurnrdkc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnJmZmJ3ZXJ5aGh1cm5yZGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjA3NzEsImV4cCI6MjA1ODkzNjc3MX0.qRe0fzKrR3BYfZw8e13mW6k80OHkyvU6x1o9avNZv9c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);