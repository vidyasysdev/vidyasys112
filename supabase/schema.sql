-- Vidyasys Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Colleges table
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  student_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  college_id TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT '',
  semester INTEGER NOT NULL DEFAULT 1,
  year_of_study INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_seller_verified BOOLEAN DEFAULT false,
  is_tutor_verified BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  onboarding_completed BOOLEAN DEFAULT false
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('notes', 'academic_projects', 'hardware_projects', 'student_essentials')),
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  branch TEXT NOT NULL,
  listing_type TEXT NOT NULL DEFAULT 'sell' CHECK (listing_type IN ('sell', 'rent', 'both')),
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  rent_price NUMERIC(10,2),
  quantity INTEGER NOT NULL DEFAULT 1,
  available_quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold_out', 'archived')),
  is_digital BOOLEAN DEFAULT false,
  digital_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Listing images
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory table (for physical items)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  item_code TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'ready_for_pickup', 'picked_up', 'borrowed', 'return_pending', 'returned', 'inspection', 'damaged', 'unavailable')),
  current_holder_id UUID REFERENCES auth.users(id),
  condition TEXT NOT NULL DEFAULT 'excellent' CHECK (condition IN ('excellent', 'good', 'fair', 'damaged')),
  rental_due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  inventory_item_id UUID REFERENCES inventory(id),
  type TEXT NOT NULL CHECK (type IN ('purchase', 'rental')),
  amount NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ready_for_pickup', 'picked_up', 'active', 'completed', 'returned', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  rental_start TIMESTAMPTZ,
  rental_end TIMESTAMPTZ,
  pickup_verified BOOLEAN DEFAULT false,
  return_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tutor profiles
CREATE TABLE tutor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subjects TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  one_on_one_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  group_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  session_mode TEXT NOT NULL DEFAULT 'both' CHECK (session_mode IN ('online', 'offline', 'both')),
  availability JSONB DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rating NUMERIC(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id),
  tutor_id UUID NOT NULL REFERENCES auth.users(id),
  session_type TEXT NOT NULL CHECK (session_type IN ('1_on_1', 'group')),
  session_mode TEXT NOT NULL CHECK (session_mode IN ('online', 'offline')),
  subject TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_link TEXT,
  amount NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  student_confirmed BOOLEAN DEFAULT false,
  tutor_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewee_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID REFERENCES bookings(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id),
  order_id UUID REFERENCES orders(id),
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User reports
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  reported_user_id UUID REFERENCES auth.users(id),
  listing_id UUID REFERENCES listings(id),
  review_id UUID REFERENCES reviews(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  commission_deducted NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT NOT NULL,
  payment_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_listings_college ON listings(college_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Listings: Everyone can view approved listings, sellers manage their own
CREATE POLICY "Approved listings are viewable by everyone" ON listings FOR SELECT USING (status = 'approved' OR seller_id = auth.uid());
CREATE POLICY "Sellers can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON listings FOR UPDATE USING (auth.uid() = seller_id);

-- Listing images: Viewable with listing, manageable by seller
CREATE POLICY "Listing images viewable with listing" ON listing_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage listing images" ON listing_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid()));
CREATE POLICY "Sellers can delete own listing images" ON listing_images FOR DELETE USING (EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid()));

-- Orders: Buyers and sellers can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "System can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Tutor profiles: Viewable by everyone, manageable by owner
CREATE POLICY "Tutor profiles viewable by everyone" ON tutor_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own tutor profile" ON tutor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tutor profile" ON tutor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Bookings: Student and tutor can view their own
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = student_id OR auth.uid() = tutor_id);
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Reviews: Viewable by everyone, insertable by reviewer
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Conversations: Participants can view
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));

-- Conversation participants: Participants can view
CREATE POLICY "Participants can view co-participants" ON conversation_participants FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversation_participants.conversation_id AND user_id = auth.uid()));

-- Messages: Conversation participants can view and send
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- Notifications: Users can view their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User reports: Users can view their own, admin can view all (via service role)
CREATE POLICY "Users can view own reports" ON user_reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create reports" ON user_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Payouts: Users can view their own
CREATE POLICY "Users can view own payouts" ON payouts FOR SELECT USING (auth.uid() = user_id);

-- Admin helper (SECURITY DEFINER avoids recursion with profiles RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Admin moderation policies
CREATE POLICY "Admins can view all listings" ON listings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update listings" ON listings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can update tutor profiles" ON tutor_profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all reviews" ON reviews FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all reports" ON user_reports FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all payouts" ON payouts FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all conversations" ON conversations FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all notifications" ON notifications FOR SELECT USING (public.is_admin());

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_domain TEXT;
  found_college_id UUID;
BEGIN
  user_domain := split_part(NEW.email, '@', 2);

  SELECT id INTO found_college_id
  FROM colleges
  WHERE domain = user_domain AND is_active = true
  LIMIT 1;

  INSERT INTO public.profiles (user_id, email, full_name, college_id, verification_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(found_college_id::text, user_domain),
    CASE WHEN found_college_id IS NOT NULL THEN 'verified' ELSE 'pending' END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user error for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutor_profiles_updated_at BEFORE UPDATE ON tutor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data: Default college
INSERT INTO colleges (name, short_name, city, domain, student_count, is_active) VALUES
('Vidyalankar Institute of Technology', 'VIT', 'Mumbai', 'vit.edu.in', 7500, true),
('Vidyalankar Polytechnic', 'VP', 'Mumbai', 'vp.edu.in', 3800, true),
('Indian Institute of Technology Bombay', 'IIT Bombay', 'Mumbai', 'iitb.ac.in', 11500, true),
('BITS Pilani', 'BITS Pilani', 'Pilani & Goa', 'bits-pilani.ac.in', 9800, true),
('Delhi Technological University', 'DTU', 'New Delhi', 'dtu.ac.in', 12000, true),
('College of Engineering Guindy', 'CEG', 'Chennai', 'annauniv.edu', 14000, true),
('R.V. College of Engineering', 'RVCE', 'Bengaluru', 'rvce.edu.in', 7500, true);
