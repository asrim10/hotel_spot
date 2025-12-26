export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hotel1.jpg')" }}
    >
      <div className="min-h-screen w-full bg-black/30">
        <div className="max-w-7xl mx-auto px-4 py-36 text-center text-white">
          <h1 className="text-4xl font-bold">Welcome to Hotelspot</h1>
          <p className="mt-4 text-lg">
            Find a perfect stay for your next vacation
          </p>
        </div>
      </div>
    </main>
  );
}
