import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdkryigvnzdbymaxwirxs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhka3J5aWd2bnpkYnltYXdpcnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzIzNTcsImV4cCI6MjA5Mjg0ODM1N30.XJ6tp0BIscdbZCoSlshA7113D11lEqqB-VLV92OpIZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
