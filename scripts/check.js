const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qyktwvuxkryhvfbvxiaw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5a3R3dnV4a3J5aHZmYnZ4aWF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDcyNzE0NywiZXhwIjoyMDUwMzAzMTQ3fQ.iwSkfVnbGGEsR0hNCKKWe7A1K6oOlsrjKGS5wy3MpZM'
);

async function check() {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status');
  
  console.log('Total users:', users?.length || 0);
  if (users && users.length > 0) {
    users.forEach(u => console.log(\- \ (\, \)\));
  }
}
check();
