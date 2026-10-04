import Hero from '../components/Hero';
import Clients from '../components/Clients';
import Services from '../components/Services';
import Work from '../components/Work';
import About from '../components/About';

export default function Welcome() {
  return (
    <>
      <Hero />
      <Clients />
      <Services />
      <Work />
      <About />
    </>
  );
}
