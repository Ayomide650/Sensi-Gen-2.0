import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msgbmpicrhpximaidgks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZ2JtcGljcmhweGltYWlkZ2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDYwODMsImV4cCI6MjA2MzMyMjA4M30.WUcWEJlGH-ortWo2nRf7cDQEBDlGmtZvwty_8AHumXs';

export const supabase = createClient(supabaseUrl, supabaseKey);