const { createAdminClient } = require('./lib/supabase/admin');

async function verifyAdminUser(email) {
  const adminClient = createAdminClient();

  // 1. Get user ID from Auth
  const { data: users, error: listError } = await adminClient.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.users.find((u) => u.email === email);
  if (!user) {
    console.error(`User with email ${email} not found.`);
    return;
  }

  console.log(`Found user: ${user.email} (ID: ${user.id})`);

  // 2. Check if already in admin_users
  const { data: existing, error: checkError } = await adminClient
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking admin_users table:', checkError);
  } else if (existing) {
    console.log(`User ${email} is ALREADY in admin_users table.`);
  } else {
    // 3. Add to admin_users table
    const { error: insertError } = await adminClient
      .from('admin_users')
      .insert({ id: user.id, email: user.email });

    if (insertError) {
      console.error('Error adding user to admin_users:', insertError);
    } else {
      console.log(`Successfully added ${email} to admin_users.`);
    }
  }
}

// Run the function
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address.');
  process.exit(1);
}

verifyAdminUser(email);
