import { Gem } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="about-page container">
      <div className="about-header">
        <Gem size={32} className="about-icon" />
        <h1>About SPJewel</h1>
        <p className="about-subtitle">Virtual try-on for fine jewelry. See it on you before you buy.</p>
      </div>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          SPJewel was born from a simple idea: buying fine jewelry online shouldn't be a leap of faith.
          We combine cutting-edge augmented reality with curated craftsmanship so you can see exactly
          how every piece looks on you — before you commit.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <p>
          Browse our catalog, select a piece you love, and use our AR try-on feature to see it in
          real-time through your camera. No guesses, no returns — just confidence.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Craft</h2>
        <p>
          Every piece in our collection is sourced from trusted artisans who share our passion for
          quality and design. From classic elegance to modern statements, we believe fine jewelry
          should be accessible, transparent, and personal.
        </p>
      </section>
    </div>
  );
}
