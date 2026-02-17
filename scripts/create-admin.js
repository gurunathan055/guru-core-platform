const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'admin@guru.com';
  const password = 'password123';
  const fullName = 'System Admin';

  console.log(`Creating user ${email}...`);

  // 1. Create the user in Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (authError) {
    console.error('Error creating user:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`User created with ID: ${userId}`);

  // 2. Insert/Update profile and set role to admin
  // We use upsert to handle cases where the profile might be auto-created by triggers
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email,
      full_name: fullName,
      role: 'admin',
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('Error updating profile role:', profileError.message);
    // Even if profile update fails, auth user exists.
  } else {
    console.log('Successfully assigned admin role to user.');
  }

  console.log('\n-----------------------------------');
  console.log('✅ Admin User Created Successfully');
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log('-----------------------------------');
}

createAdminUser();
