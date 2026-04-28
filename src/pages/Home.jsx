import Hero from "../components/home/Hero";
import Tasks from "../components/home/Tasks";
import Animals from "../components/home/Animals";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";

function Home() {
  return (
    <main className="bg-gray-50">
      <Hero />
      <Tasks />
      <Animals />
      <HowItWorks />
      <CTA />
    </main>
  );
}

export default Home;