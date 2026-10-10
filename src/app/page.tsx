import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Preloader } from '@/components/ui/Preloader';

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <About />
      <Work />
      <Services />
      <Contact />
    </>
  );
}
