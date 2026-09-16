import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Vidyasys"
                width={36}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              One platform where students Learn, Share, Build &amp; Grow.
              College-verified marketplace for notes, projects, tutors, and essentials.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explore" className="hover:text-brand-600 transition">Explore Marketplace</Link></li>
              <li><Link href="/tutors" className="hover:text-brand-600 transition">Find Tutors</Link></li>
              <li><Link href="/about" className="hover:text-brand-600 transition">About Vidyasys</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-600 transition">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              For Students
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/signup" className="hover:text-brand-600 transition">Create Account</Link></li>
              <li><Link href="/explore" className="hover:text-brand-600 transition">Buy Notes</Link></li>
              <li><Link href="/explore" className="hover:text-brand-600 transition">Rent Hardware</Link></li>
              <li><Link href="/tutors" className="hover:text-brand-600 transition">Book Tutors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/contact" className="hover:text-brand-600 transition">Contact Us</Link></li>
              <li><span className="text-slate-400">help@vidyasys.com</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Vidyasys. All rights reserved.</span>
          <a
            href="https://arssystem.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-600 hover:text-brand-600 transition"
          >
            Designed &amp; Developed by Aryan Sonsurkar
          </a>
        </div>
      </div>
    </footer>
  );
}
