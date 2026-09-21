INSERT INTO colleges (name, short_name, city, domain, student_count, is_active)
VALUES ('Vidyalankar Polytechnic', 'VPT', 'Mumbai', 'vpt.edu.in', 3800, true)
ON CONFLICT (domain) DO NOTHING;
