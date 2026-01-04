import Link from "next/link";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hotel4.webp')" }}
    >
      <div className="min-h-screen w-full bg-black/30 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="hidden md:block">
              <div className="max-w-sm rounded-xl bg-black/40 backdrop-blur p-6 text-white shadow-lg">
                <h3 className="text-xl font-semibold">
                  Because Stays Should Feel Like Destinations
                </h3>
                <p className="mt-3 text-sm text-gray-200">
                  Find a perfect stay for your much awaited vacation!
                </p>
                <div className="mt-6 flex gap-3">
                  <div className="h-2 w-16 rounded-full bg-white/80" />
                  <div className="h-2 w-4 rounded-full bg-white/40" />
                  <div className="h-2 w-4 rounded-full bg-white/40" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur p-8 shadow-md">
                {children}
                <div className="mt-6 text-center text-sm text-gray-700">
                  <span>Don't have an account? </span>
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
