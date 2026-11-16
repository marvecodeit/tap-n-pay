import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <HowItWorks />
      <Features />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
