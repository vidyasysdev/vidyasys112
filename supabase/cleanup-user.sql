-- Delete the failed user so they can sign up fresh
-- Find the user first
SELECT id, email FROM auth.users WHERE email LIKE '%vpt.edu.in%';

-- Then delete (replace the UUID with the actual one from above)
-- DELETE FROM auth.users WHERE id = 'PASTE_UUID_HERE';
