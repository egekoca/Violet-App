import React from 'react';
import { Box, Container, Flex, Heading, Text, Button, Card, Grid } from '@radix-ui/themes';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <Container size="4">
          <Flex justify="between" align="center" py="3">
            <Box>
              <Heading size="6" className="logo">Violent</Heading>
            </Box>
            <Flex gap="4" align="center">
              <Button variant="ghost" size="2">Log in</Button>
              <Button size="2" className="signup-btn">Sign up free</Button>
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <Container size="4">
          <Box className="hero-content">
            <div className="hero-images">
              <div className="floating-emoji">🎉</div>
              <div className="floating-emoji">✨</div>
              <div className="floating-emoji">🚀</div>
              <div className="floating-emoji">💫</div>
            </div>
            <Heading size="9" className="hero-title">
              A link in bio built for you.
            </Heading>
            <Text size="5" className="hero-subtitle">
              Join 70M+ people using Violent for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
            </Text>
            <Button size="4" className="cta-button">
              Get started for free
            </Button>
          </Box>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features">
        <Container size="4">
          <Grid columns={{ initial: '1', md: '3' }} gap="6" py="8">
            <Card className="feature-card">
              <Box p="4">
                <div className="feature-icon">🔗</div>
                <Heading size="5" mb="3">Link in bio + tools</Heading>
                <Text size="3" mb="4">
                  Manage your social media, grow and engage your audience, monetize your following, and measure your success.
                </Text>
                <ul className="feature-list">
                  <li>Customize your Violent</li>
                  <li>Link shortener</li>
                  <li>QR code generator</li>
                  <li>Canva Background Editor</li>
                </ul>
              </Box>
            </Card>

            <Card className="feature-card">
              <Box p="4">
                <div className="feature-icon">📈</div>
                <Heading size="5" mb="3">Grow and engage your audience</Heading>
                <Text size="3" mb="4">
                  Schedule and auto-post, automated replies, AI content generation, and hashtag suggestions for better reach.
                </Text>
                <ul className="feature-list">
                  <li>Schedule and auto-post</li>
                  <li>Instagram auto reply</li>
                  <li>AI content & caption generator</li>
                  <li>Hashtag generator</li>
                </ul>
              </Box>
            </Card>

            <Card className="feature-card">
              <Box p="4">
                <div className="feature-icon">💰</div>
                <Heading size="5" mb="3">Monetize your following</Heading>
                <Text size="3" mb="4">
                  Earn with Violent Shop, sell online courses, host digital products, and get rewarded for growing your Violent.
                </Text>
                <ul className="feature-list">
                  <li>Earn with a Violent Shop</li>
                  <li>Sell an online course</li>
                  <li>Host digital products</li>
                  <li>Earn by hosting sponsored links</li>
                </ul>
              </Box>
            </Card>
          </Grid>
        </Container>
      </section>

      {/* Create and Customize Section */}
      <section className="create-section">
        <Container size="4">
          <Grid columns={{ initial: '1', md: '2' }} gap="8" py="8" align="center">
            <Box>
              <Heading size="7" mb="4">Create and customize your Violent in minutes</Heading>
              <Text size="4" mb="6">
                Connect all your content across social media, websites, stores and more in one link in bio. Customize every detail or let Violent automatically enhance it to match your brand and drive more clicks.
              </Text>
            </Box>
            <Box className="demo-box">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="profile-preview">
                    <div className="avatar">😊</div>
                    <div className="profile-name">@yourname</div>
                    <div className="links-preview">
                      <div className="link-item">🎬 Latest Video</div>
                      <div className="link-item">🛍️ Shop Now</div>
                      <div className="link-item">📞 Contact</div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Grid>
        </Container>
      </section>

      {/* Share Anywhere Section */}
      <section className="share-section">
        <Container size="4">
          <Grid columns={{ initial: '1', md: '2' }} gap="8" py="8" align="center">
            <Box className="demo-box">
              <div className="qr-code-demo">
                <div className="qr-code">📱</div>
                <Text size="2">📲 Scan to visit</Text>
              </div>
            </Box>
            <Box>
              <Heading size="7" mb="4">Share your Violent anywhere you like!</Heading>
              <Text size="4" mb="6">
                Add your unique Violent URL to all the platforms and places you find your audience. Then use your QR code to drive your offline traffic back to your link in bio.
              </Text>
            </Box>
          </Grid>
        </Container>
      </section>

      {/* Analytics Section */}
      <section className="analytics-section">
        <Container size="4">
          <Grid columns={{ initial: '1', md: '2' }} gap="8" py="8" align="center">
            <Box>
              <Heading size="7" mb="4">Analyze your audience and keep them engaged</Heading>
              <Text size="4" mb="6">
                Track your engagement over time, monitor revenue and learn what's converting your audience. Make informed updates on the fly to keep them coming back.
              </Text>
            </Box>
            <Box className="demo-box">
              <div className="analytics-preview">
                <div className="chart-bar" style={{ height: '60%' }}>📊</div>
                <div className="chart-bar" style={{ height: '80%' }}>📈</div>
                <div className="chart-bar" style={{ height: '45%' }}>📉</div>
                <div className="chart-bar" style={{ height: '90%' }}>🎯</div>
                <div className="chart-bar" style={{ height: '70%' }}>💎</div>
              </div>
            </Box>
          </Grid>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <Container size="4">
          <Box style={{ textAlign: 'center' }} py="8">
            <div className="trust-emojis">
              <span className="trust-emoji">👥</span>
              <span className="trust-emoji">🌟</span>
              <span className="trust-emoji">💪</span>
              <span className="trust-emoji">🎨</span>
              <span className="trust-emoji">🎵</span>
            </div>
            <Heading size="7" mb="4">The only link in bio trusted by 70M+</Heading>
            <Text size="4" mb="6">
              creators • influencers • small businesses • athletes • models • monetizers • health educators • streamers • vloggers • fitness coaches • ecommerce sellers • retailers • products • wellness leaders • musicians • bands • podcasters • fashion designers • culture creators • merch sellers • writers • DJs
            </Text>
          </Box>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <Container size="4">
          <Box py="8">
            <Heading size="7" style={{ textAlign: 'center' }} mb="8">❓ Questions? Answered ✅</Heading>
            <Grid columns={{ initial: '1', md: '2' }} gap="6">
              <Box>
                <Heading size="4" mb="3">Why do I need a link in bio tool?</Heading>
                <Text size="3">
                  Right now, every time you've got something new to share, you have to go to every single one of your channels to change the link in each of your bios. It's time-consuming and complicated – making it so much harder to keep everything up to date.
                </Text>
              </Box>
              <Box>
                <Heading size="4" mb="3">Is Violent the original link in bio tool?</Heading>
                <Text size="3">
                  The short answer? Yes! Back in 2016, we created Violent as an easy way to link out to all socials and unify digital ecosystems, pioneering the link-in-bio category.
                </Text>
              </Box>
              <Box>
                <Heading size="4" mb="3">Can you get paid and sell things from a Violent?</Heading>
                <Text size="3">
                  Yes, you can! We offer plenty of ways to sell products and monetize your audience. You can collect revenue from affiliate links, and sell your products right in your Violent.
                </Text>
              </Box>
              <Box>
                <Heading size="4" mb="3">Is Violent safe to use on all of my social media profiles?</Heading>
                <Text size="3">
                  Violent is trusted by all social platforms, and is even used on many of Facebook, Instagram and TikTok's own social media accounts!
                </Text>
              </Box>
            </Grid>
          </Box>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <Container size="4">
          <Box style={{ textAlign: 'center' }} py="8">
            <Heading size="7" mb="4">Jumpstart your corner of the internet today</Heading>
            <Button size="4" className="cta-button">
              Get started for free
            </Button>
          </Box>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container size="4">
          <Grid columns={{ initial: '1', md: '4' }} gap="6" py="8">
            <Box>
              <Heading size="4" mb="3">Company</Heading>
              <Text size="2" className="footer-link">The Violent Blog</Text>
              <Text size="2" className="footer-link">Marketplace</Text>
              <Text size="2" className="footer-link">About</Text>
              <Text size="2" className="footer-link">Press</Text>
              <Text size="2" className="footer-link">Careers</Text>
            </Box>
            <Box>
              <Heading size="4" mb="3">Community</Heading>
              <Text size="2" className="footer-link">Violent for Enterprise</Text>
              <Text size="2" className="footer-link">Creator Report</Text>
              <Text size="2" className="footer-link">Charities</Text>
              <Text size="2" className="footer-link">Creator Profile Directory</Text>
            </Box>
            <Box>
              <Heading size="4" mb="3">Support</Heading>
              <Text size="2" className="footer-link">Help Topics</Text>
              <Text size="2" className="footer-link">Getting Started</Text>
              <Text size="2" className="footer-link">Violent Pro</Text>
              <Text size="2" className="footer-link">Features & How-Tos</Text>
              <Text size="2" className="footer-link">FAQs</Text>
            </Box>
            <Box>
              <Heading size="4" mb="3">Trust & Legal</Heading>
              <Text size="2" className="footer-link">Terms & Conditions</Text>
              <Text size="2" className="footer-link">Privacy Notice</Text>
              <Text size="2" className="footer-link">Cookie Notice</Text>
              <Text size="2" className="footer-link">Trust Center</Text>
            </Box>
          </Grid>
          <Box style={{ textAlign: 'center', borderTop: '1px solid var(--gray-a3)' }} py="4">
            <Text size="2" className="footer-copyright">
              © 2024 Violent. All rights reserved.
            </Text>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
