export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      colleges: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          city: string;
          domain: string;
          student_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["colleges"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["colleges"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          college_id: string;
          branch: string;
          semester: number;
          year_of_study: number;
          phone: string | null;
          bio: string | null;
          skills: string[];
          verification_status: "pending" | "verified" | "rejected";
          is_seller_verified: boolean;
          is_tutor_verified: boolean;
          is_admin: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          college_id: string;
          title: string;
          description: string;
          category: "notes" | "academic_projects" | "hardware_projects" | "student_essentials";
          subject: string;
          semester: number;
          branch: string;
          listing_type: "sell" | "rent" | "both";
          price: number;
          rent_price: number | null;
          quantity: number;
          available_quantity: number;
          status: "pending" | "approved" | "rejected" | "sold_out" | "archived";
          is_digital: boolean;
          digital_file_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listings"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listing_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["listing_images"]["Insert"]>;
      };
      inventory: {
        Row: {
          id: string;
          listing_id: string;
          item_code: string;
          owner_id: string;
          status: "available" | "reserved" | "ready_for_pickup" | "picked_up" | "borrowed" | "return_pending" | "returned" | "inspection" | "damaged" | "unavailable";
          current_holder_id: string | null;
          condition: "excellent" | "good" | "fair" | "damaged";
          rental_due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_id: string;
          seller_id: string;
          listing_id: string;
          inventory_item_id: string | null;
          type: "purchase" | "rental";
          amount: number;
          commission: number;
          status: "pending" | "confirmed" | "ready_for_pickup" | "picked_up" | "active" | "completed" | "returned" | "cancelled" | "refunded";
          payment_status: "pending" | "paid" | "refunded" | "failed";
          payment_method: string | null;
          rental_start: string | null;
          rental_end: string | null;
          pickup_verified: boolean;
          return_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      tutor_profiles: {
        Row: {
          id: string;
          user_id: string;
          subjects: string[];
          skills: string[];
          one_on_one_price: number;
          group_price: number;
          session_mode: "online" | "offline" | "both";
          availability: Json;
          bio: string;
          experience: string;
          verification_status: "pending" | "verified" | "rejected";
          rating: number;
          total_sessions: number;
          total_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tutor_profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["tutor_profiles"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          student_id: string;
          tutor_id: string;
          session_type: "1_on_1" | "group";
          session_mode: "online" | "offline";
          subject: string;
          scheduled_at: string;
          duration_minutes: number;
          meeting_link: string | null;
          amount: number;
          commission: number;
          status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
          payment_status: "pending" | "paid" | "refunded";
          student_confirmed: boolean;
          tutor_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          booking_id: string | null;
          order_id: string | null;
          rating: number;
          comment: string;
          is_visible: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string | null;
          order_id: string | null;
          booking_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          last_read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversation_participants"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["conversation_participants"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          reference_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      user_reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string | null;
          listing_id: string | null;
          review_id: string | null;
          reason: string;
          description: string;
          status: "pending" | "investigating" | "resolved" | "dismissed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_reports"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["user_reports"]["Insert"]>;
      };
      payouts: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          commission_deducted: number;
          status: "pending" | "processing" | "completed" | "failed";
          payment_method: string;
          payment_details: Json;
          created_at: string;
          processed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["payouts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payouts"]["Insert"]>;
      };
    };
    Enums: {
      listing_category: "notes" | "academic_projects" | "hardware_projects" | "student_essentials";
      listing_type: "sell" | "rent" | "both";
      listing_status: "pending" | "approved" | "rejected" | "sold_out" | "archived";
      inventory_status: "available" | "reserved" | "ready_for_pickup" | "picked_up" | "borrowed" | "return_pending" | "returned" | "inspection" | "damaged" | "unavailable";
      order_status: "pending" | "confirmed" | "ready_for_pickup" | "picked_up" | "active" | "completed" | "returned" | "cancelled" | "refunded";
      verification_status: "pending" | "verified" | "rejected";
    };
  };
}
