import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://omhwgbytfopaamakawqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taHdnYnl0Zm9wYWFtYWthd3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODQ1NTMsImV4cCI6MjA4Nzc2MDU1M30.YhDttiFipEw2-ZXKvxqhrH80VPmVoiSdSPDYltc0xDQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);