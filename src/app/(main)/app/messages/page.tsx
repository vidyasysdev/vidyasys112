import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-brand-950 tracking-tight">Messages</h1>
        <p className="text-sm text-slate-600 mt-1">Chat with sellers and tutors</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No conversations yet</h3>
        <p className="text-sm text-slate-500">
          Start a conversation by inquiring about a listing or booking a tutor.
        </p>
      </div>
    </div>
  );
}
