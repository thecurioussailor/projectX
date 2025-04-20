import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
// import '../styles/landingPage2.css';

const LandingPage2 = () => {
  const [showNewsletter, setShowNewsletter] = useState(true);
  
  useEffect(() => {
    // Initialize animations or any required scripts
    const timer = setTimeout(() => {
      setShowNewsletter(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Newsletter modal */}
      {showNewsletter && (
        <div className="newsletter-modal">
          <div className="newsletter-content">
            <button className="close-btn" onClick={() => setShowNewsletter(false)}>×</button>
            <h4>Subscribe to Our Newsletter</h4>
            <p>Get the latest updates & offers.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>The next generation<br/>mobile application</h1>
            <p>Lorem Ipsum is simply dummy text of the printing indus orem Ipsum has been the standard dummy.</p>
            
            <div className="app-buttons">
              <button className="app-store-btn">
                <i className="fab fa-apple"></i> App Store
              </button>
              <button className="play-store-btn">
                <i className="fab fa-google-play"></i> Google Play
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/hero-image.png" alt="App Interface" />
          </motion.div>
        </div>

        <div className="trust-banner">
          <p>Join the 50m+ people trusting our application</p>
          <div className="trust-logos">
            <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/client-logo-1.png" alt="Client Logo" />
            <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/client-logo-2.png" alt="Client Logo" />
            <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/client-logo-3.png" alt="Client Logo" />
            <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/client-logo-4.png" alt="Client Logo" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-title">
            <span>Best features</span>
            <h2>Best features of app that makes customers life easy</h2>
            <p>Lorem Ipsum is simply dummy text of the print ing andtyptting.</p>
          </div>

          <div className="features-grid">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon purple">
                <i className="fas fa-cog"></i>
              </div>
              <h6>Fully functional</h6>
              <p>Lorem Ipsum is simply dummy text of the printing andtyptting industry andtyptting industry lorem.</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon pink">
                <i className="fas fa-lock"></i>
              </div>
              <h6>Secure & Reliable</h6>
              <p>Lorem Ipsum is simply dummy text of the printing andtyptting industry andtyptting industry lorem.</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon blue">
                <i className="fas fa-headset"></i>
              </div>
              <h6>24/7 Support</h6>
              <p>Lorem Ipsum is simply dummy text of the printing andtyptting industry andtyptting industry lorem.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Workflow Section */}
      <section className="workflow-section">
        <div className="container">
          <motion.div 
            className="workflow-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2>Streamline your workflow with our smart, user-friendly app - effortless management, seamless accounting, and productivity boosted.</h2>
          </motion.div>
        </div>
      </section>

      {/* Connect with Customers Section */}
      <section className="connect-section">
        <div className="container">
          <div className="connect-wrapper">
            <motion.div 
              className="connect-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle">comunicate</span>
              <h2>Easily connect with your customers</h2>
              <p>Lorem Ipsum is simply dummy text of the printing and typt ting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>
              <ul className="feature-list">
                <li>Lorem Ipsum is simply dummy text</li>
                <li>The printing and typesetting industry lorem</li>
                <li>Has been the industrys dummy</li>
              </ul>
              <button className="get-started-btn">Get Started</button>
            </motion.div>

            <motion.div 
              className="connect-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/feature-image-1.png" alt="Connect with customers" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Communication Section */}
      <section className="client-section">
        <div className="container">
          <div className="client-wrapper">
            <motion.div 
              className="client-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/feature-image-2.png" alt="Client communication" />
            </motion.div>

            <motion.div 
              className="client-text"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle">Unique Features</span>
              <h2>Client comunication for best results</h2>
              <p>Lorem Ipsum is simply dummy text of the printing and typtting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>
              <ul className="feature-list">
                <li>Lorem Ipsum is simply dummy text</li>
                <li>The printing and typesetting industry lorem</li>
                <li>Has been the industrys dummy</li>
              </ul>
              <button className="get-started-btn">Get Started</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Call Section */}
      <section className="video-call-section">
        <div className="container">
          <div className="video-call-wrapper">
            <motion.div 
              className="video-call-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle">Unique Features</span>
              <h2>Live chat with Video Call</h2>
              <p>Lorem Ipsum is simply dummy text of the printing and typtting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>
              <ul className="feature-list">
                <li>Lorem Ipsum is simply dummy text</li>
                <li>The printing and typesetting industry lorem</li>
                <li>Has been the industrys dummy</li>
              </ul>
              <button className="get-started-btn">Get Started</button>
            </motion.div>

            <motion.div 
              className="video-call-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/feature-image-3.png" alt="Video call" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-title">
            <span>how it works</span>
            <h2>Simple easy 3 steps</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typtting.</p>
          </div>

          <div className="steps-container">
            <motion.div 
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="step-icon">
                <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/step-icon-1.svg" alt="Download App" />
              </div>
              <h6>Download App & Register</h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typtting industry lorem.</p>
              <div className="step-number">01</div>
            </motion.div>

            <motion.div 
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-icon">
                <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/step-icon-2.svg" alt="Verify Account" />
              </div>
              <h6>Verify your Account</h6>
              <p>Dummy text of the printing and typesetting industry lorem Ipsum has been.</p>
              <div className="step-number">02</div>
            </motion.div>

            <motion.div 
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="step-icon">
                <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/step-icon-3.svg" alt="Use App" />
              </div>
              <h6>Start Using smart app</h6>
              <p>Printing and typesetting industry lorem Ipsum has been indus trys standard.</p>
              <div className="step-number">03</div>
            </motion.div>
          </div>

          <div className="download-prompt">
            <h6>Download app to get started</h6>
            <div className="app-buttons">
              <button className="app-store-btn">
                <i className="fab fa-apple"></i> App Store
              </button>
              <button className="play-store-btn">
                <i className="fab fa-google-play"></i> Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About App Section */}
      <section className="about-app-section">
        <div className="container">
          <div className="about-app-wrapper">
            <motion.div 
              className="about-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle">about app</span>
              <h2>Your all-in-one solution app for easy management.</h2>
              <p>Lorem Ipsum is simply dummy text of the printing and typting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>
              
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">4.95</div>
                  <div className="stat-label">User Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">15m+</div>
                  <div className="stat-label">Installations</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="about-image"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/about-image.png" alt="About App" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-title">
            <span>Pricing</span>
            <h2>Best packages</h2>
          </div>

          <div className="pricing-tabs">
            <button className="pricing-tab active">Monthly</button>
            <button className="pricing-tab">Yearly 50% off</button>
          </div>

          <div className="pricing-grid">
            <motion.div 
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="pricing-header">
                <div className="pricing-icon">
                  <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/pricing-icon-1.svg" alt="Regular" />
                </div>
                <h6>Regular</h6>
                <div className="price">$199 <span>/ month</span></div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Digital Transactions</li>
                  <li>Send - Receive payment</li>
                  <li>Limited number of users</li>
                  <li>Online Banking</li>
                  <li>Basic reporting and analytics</li>
                </ul>
              </div>
              <button className="buy-now-btn">Buy Now</button>
            </motion.div>

            <motion.div 
              className="pricing-card popular"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="popular-badge">Popular</div>
              <div className="pricing-header">
                <div className="pricing-icon">
                  <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/pricing-icon-2.svg" alt="Special" />
                </div>
                <h6>Special</h6>
                <div className="price">$299 <span>/ month</span></div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Digital Transactions</li>
                  <li>Send - Receive payment</li>
                  <li>Limited number of users</li>
                  <li>Online Banking</li>
                  <li>Basic reporting and analytics</li>
                </ul>
              </div>
              <button className="buy-now-btn">Buy Now</button>
            </motion.div>

            <motion.div 
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="pricing-header">
                <div className="pricing-icon">
                  <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/pricing-icon-3.svg" alt="Premium" />
                </div>
                <h6>Premium</h6>
                <div className="price">$399 <span>/ month</span></div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Digital Transactions</li>
                  <li>Send - Receive payment</li>
                  <li>Limited number of users</li>
                  <li>Online Banking</li>
                  <li>Basic reporting and analytics</li>
                </ul>
              </div>
              <button className="buy-now-btn">Buy Now</button>
            </motion.div>
          </div>

          <div className="pricing-note">
            <p>Not sure what to choose? contact us for custom packages</p>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="download-app-section">
        <div className="container">
          <div className="download-app-wrapper">
            <motion.div 
              className="download-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle">Download app</span>
              <h2>Download app to manage customers</h2>
              <p>Lorem Ipsum is simply dummy text of the printing indus orem Ipsum has been the industrys.</p>
              
              <div className="app-buttons">
                <button className="app-store-btn">
                  <i className="fab fa-apple"></i> App Store
                </button>
                <button className="play-store-btn">
                  <i className="fab fa-google-play"></i> Google Play
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="download-image"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/cta-image.png" alt="Download App" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo">
              <img src="https://kalanidhithemes.com/live-preview/landing-page/appiq/all-demo/multipage/10-defoult-app-landing-page-centre-hero/images/logo-footer.svg" alt="AppIQ" />
            </div>
            <div className="footer-contact">
              <p>Call: +80 123 4567890</p>
              <p>Email: example@email.com</p>
            </div>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          <div className="footer-newsletter">
            <div className="newsletter-heading">
              <h6>Subscribe us</h6>
              <p>Subscribe our newsleter to receive latest updates regularly from us!</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
            <p className="newsletter-terms">By clicking send link you agree to receive message.</p>
          </div>

          <div className="footer-bottom">
            <p>© Copyrights 2024. All rights reserved.</p>
            <p>Design & developed by Kalanidhi Themes</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage2;