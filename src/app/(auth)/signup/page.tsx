import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Vidyasys account with your college email and join your campus ecosystem of notes, projects and peer learning.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupForm />;
}
