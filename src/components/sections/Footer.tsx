'use client';

export default function Footer() {
  return (
    <footer className="fixed bottom-10 left-0 w-full py-3 text-center text-sm text-gray-400 bg-transparent">
      © {new Date().getFullYear()} Shashvat Garg. All rights reserved.
    </footer>
  );
}