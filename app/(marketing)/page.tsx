import Link from "next/link";

function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <div className="font-semibold">Kittie</div>
        <nav className="space-x-6 text-sm">
          <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
          <Link href="/dashboard" className="text-orange-700 font-medium">Go to app</Link>
        </nav>
      </div>
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Beautiful media kits for modern brands</h1>
        <p className="mt-4 text-lg text-amber-700">Create, manage and share media kits with ease.</p>
        <div className="mt-8">
          <Link href="/dashboard" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-lg">Get Started</Link>
        </div>
      </main>
    </div>
  );
}

 
