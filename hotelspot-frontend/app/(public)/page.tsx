import AboutSection from "./_components/AboutSection";
import Facilities from "./_components/Facilities";
import Footer from "./_components/Footer";
import Home from "./_components/Home";
import Testimonials from "./_components/Testinomials";

export default function Page() {
  return (
    <div>
      <Home />
      <AboutSection />
      <Facilities />
      <Testimonials />
      <Footer />
    </div>
  );
}
