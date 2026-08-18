import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wojrxaavcqvwoytthqzz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("VITE_SUPABASE_ANON_KEY is not defined in env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  const email = 'jeka33253@gmail.com';
  const password = '0993462103Qw';
  console.log(`Trying to sign in as ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed with error:", error.message, error.status);
  } else {
    console.log("Login success! User:", data.user.id);
  }
}

testLogin();
