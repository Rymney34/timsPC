import Button from "../Tools/button/button.jsx";
import { Cpu, Zap, Shield } from "lucide-react";
import './landingPage.css'
import Header from "../header/header.jsx";

function LandingPage() {
  return (
    <div className="app">
        {/* Header */}
        <div>
          <Header/>
        </div>
       

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg"></div>

          <div className="container hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Build Your Dream PC</h1>

              <p className="hero-description">
                Expert custom PC builds tailored to your needs. Gaming, professional
                workstations, or everyday computing – we deliver performance and quality.
              </p>

              <div className="hero-actions">
                <Button size="lg" text='Get Started' className="btn-primary">
                 
                </Button>
                <Button size="lg"  text="View Builds" className="btn-outline">
                  
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className="container">
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">
                  <Cpu />
                </div>
                <h3>Premium Components</h3>
                <p>Only the best parts from trusted manufacturers</p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <Zap />
                </div>
                <h3>Expert Assembly</h3>
                <p>Professional cable management and testing</p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <Shield />
                </div>
                <h3>Warranty & Support</h3>
                <p>1-year warranty and lifetime technical support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Builds */}
        <section id="builds" className="builds">
          <div className="container">
            <div className="section-header">
              <h2>Pre-Configured Builds</h2>
              <p>Choose from our expertly designed configurations</p>
            </div>

            <div className="builds-grid">
              {/* {pcBuilds.map((build) => (
                // <PCBuildCard key={build.title} {...build} />
              ))} */}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="calculator">
          <div className="container">
            <div className="section-header">
              <h2>Calculate Your Build</h2>
              <p>Customize every component and see the price in real-time</p>
            </div>

            <div className="calculator-box">
              {/* <PriceCalculator /> */}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Build Your PC?</h2>
              <p>Contact Me Today For A Personalised Consultation</p>
              <Button size="lg" text='Get in Touch' className="btn-light">
                
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
          
          </div>
        </footer>
    </div>
  );
}

export default LandingPage;
