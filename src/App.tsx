import { BookingProvider } from './lib/booking';
import { useTheme } from './lib/useTheme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Sculpture } from './components/Sculpture';
import { Treatments } from './components/Treatments';
import { Visit } from './components/Visit';
import { Specialists } from './components/Specialists';
import { Journey } from './components/Journey';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Location } from './components/Location';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { BookingDialog } from './components/BookingDialog';

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <BookingProvider>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Sculpture />
        <Treatments />
        <Visit />
        <Specialists />
        <Journey />
        <Testimonials />
        <Faq />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <BookingDialog />
    </BookingProvider>
  );
}
