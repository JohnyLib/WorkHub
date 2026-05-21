import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Read env variables from .env.local manually
const envPath = '.env.local';
const envConfig = fs.readFileSync(envPath, 'utf8');
const lines = envConfig.split('\n');
for (const line of lines) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    process.env[key] = value.trim();
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl);
console.log("Anon key exists:", !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const id = 'ff0c87f8-d58c-4910-b2ee-589464df8cd8';
  
  const { data, error } = await supabase
    .from('job_listings')
    .select(`
      *,
      author:profiles (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching job:", error);
  } else {
    console.log("Fetched successfully:", data);
  }
}

test();
