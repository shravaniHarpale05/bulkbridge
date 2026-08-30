import react from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Services from "../Components/Services";
import About from "../Components/About";
import Categories from "../Components/Categories";
import HowItWorks from "../Components/HowItWorks";
import Contact from "../Components/Contact";


export default function Home() {

  return (
    <>
      <Navbar />
      <Hero />
       <About />
      <Services />
      <Categories/>
      <HowItWorks/>
      <Contact/>
    </>
  );
}