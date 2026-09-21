import type { Database } from "./database";

export type { Database } from "./database";

export type College = Database["public"]["Tables"]["colleges"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingImage = Database["public"]["Tables"]["listing_images"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type TutorProfile = Database["public"]["Tables"]["tutor_profiles"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type ConversationParticipant = Database["public"]["Tables"]["conversation_participants"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type UserReport = Database["public"]["Tables"]["user_reports"]["Row"];
export type Payout = Database["public"]["Tables"]["payouts"]["Row"];

export type ListingCategory = Database["public"]["Enums"]["listing_category"];
export type ListingType = Database["public"]["Enums"]["listing_type"];
export type ListingStatus = Database["public"]["Enums"]["listing_status"];
export type InventoryStatus = Database["public"]["Enums"]["inventory_status"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type VerificationStatus = Database["public"]["Enums"]["verification_status"];

export interface ListingWithImages extends Listing {
  listing_images: ListingImage[];
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "verification_status">;
}

export interface OrderWithDetails extends Order {
  listing: Pick<Listing, "id" | "title" | "category">;
  buyer: Pick<Profile, "id" | "full_name" | "avatar_url">;
  seller: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

export interface BookingWithDetails extends Booking {
  tutor: Pick<Profile, "id" | "full_name" | "avatar_url"> & {
    tutor_profiles: Pick<TutorProfile, "subjects" | "one_on_one_price" | "group_price">;
  };
  student: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

export interface TutorProfileWithUser extends TutorProfile {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "college_id" | "branch" | "semester" | "verification_status">;
}

export type NavigationTab = "home" | "explore" | "tutors" | "orders" | "bookings" | "messages" | "notifications" | "profile";

export type AdminTab = "students" | "colleges" | "verifications" | "listings" | "orders" | "bookings" | "inventory" | "payouts" | "reports" | "analytics";
