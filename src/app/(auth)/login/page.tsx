import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Vidyasys student account for notes, projects, peer tutoring and campus services.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
