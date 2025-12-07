import Navbar from "@/components/global/Navbar";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import PopularDestinations from "@/components/landing/PopularDestinations";
import GrantFeed from "@/components/landing/GrantFeed";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <Hero />
      <StatsStrip />
      <PopularDestinations />
      <GrantFeed />
      <Footer />
    </main>
  );
}
