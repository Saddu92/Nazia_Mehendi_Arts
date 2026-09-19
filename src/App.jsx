import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Reviews from "./components/Reviews";
import InstagramShowcase from "./components/InstagramShowcase";
import Booking from "./components/Booking";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="h-1 bg-forest" />
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Reviews />
        <InstagramShowcase />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
