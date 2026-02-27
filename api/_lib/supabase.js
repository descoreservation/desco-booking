import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://omhwgbytfopaamakawqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taHdnYnl0Zm9wYWFtYWthd3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODQ1NTMsImV4cCI6MjA4Nzc2MDU1M30.YhDttiFipEw2-ZXKvxqhrH80VPmVoiSdSPDYltc0xDQ';

export function getSupabase() {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
