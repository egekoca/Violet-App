import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  Grid,
  Badge
} from '@radix-ui/themes';
import {
  LinkBreak2Icon,
  GlobeIcon,
  PersonIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon
} from '@radix-ui/react-icons';
import { useLogin } from '../contexts/LoginContext';

const Landing: React.FC = () => {
  const { openLogin, isConnected } = useLogin();

  const handleGetStarted = () => {
    if (isConnected) {
      // User is already connected, redirect to dashboard or next step
      console.log('User is connected, proceeding to next step');
    } else {
      // Open login popup
      openLogin();
    }
  };
  return (
    <Box>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      {/* Floating Header */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '1rem 0'
        }}
      >
        <Container size="4">
          <Flex justify="between" align="center">
            <Heading size="5" style={{ color: '#4a5568', fontWeight: '700' }}>
              Violent
            </Heading>
            <Button size="3" variant="solid" style={{
              backgroundColor: '#d4a5d4',
              color: 'white',
              fontWeight: '600'
            }} onClick={handleGetStarted}>
              Get Started Free
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #a8e6cf 0%, #d4a5d4 50%, #b8d4f0 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px'
        }}
      >
        {/* Animated Background Elements */}
        <Box
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite'
          }}
        />

        {/* Grid Pattern Overlay */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.5
          }}
        />

        <Container size="4" style={{ position: 'relative', zIndex: 1 }}>
          <Flex direction="column" align="center" gap="6" style={{ textAlign: 'center' }}>
            <Box className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Badge size="3" variant="soft" style={{
                marginBottom: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#2d3748',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: '600'
              }}>
                <LinkBreak2Icon width="16" height="16" />
                One Link, Infinite Possibilities
              </Badge>
            </Box>

            <Heading size="9" className="animate-fadeInUp" style={{
              color: '#1a202c',
              fontWeight: '900',
              lineHeight: '1.1',
              maxWidth: '800px',
              animationDelay: '0.4s',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Everything you are.<br />
              <Text style={{
                color: '#4a5568',
                background: 'linear-gradient(45deg, #4a5568, #2d3748)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>In one link.</Text>
            </Heading>

            <Text size="5" className="animate-fadeInUp" style={{
              color: '#2d3748',
              maxWidth: '600px',
              lineHeight: '1.6',
              fontWeight: '500',
              animationDelay: '0.6s'
            }}>
              Violent is the free bio link tool that helps you share everything you create,
              curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
            </Text>

            <Flex gap="4" wrap="wrap" justify="center" className="animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Button size="4" variant="outline" style={{
                borderColor: '#4a5568',
                color: '#4a5568',
                fontWeight: '600',
                padding: '0 2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(74, 85, 104, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                View Example
              </Button>
            </Flex>

            <Text size="2" className="animate-fadeInUp" style={{
              color: '#4a5568',
              animationDelay: '1s',
              fontWeight: '500'
            }}>
              Join 40M+ people who use Violent
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, #f0f8ff 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <Box style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(168, 230, 207, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 165, 212, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(184, 212, 240, 0.1) 0%, transparent 50%)
          `,
          opacity: 0.6
        }} />

        <Container size="4" style={{ position: 'relative', zIndex: 1 }}>
          <Flex direction="column" align="center" gap="6">
            <Heading size="8" style={{
              textAlign: 'center',
              marginBottom: '1rem',
              color: '#1a202c',
              fontWeight: '800'
            }}>
              Why choose Violent?
            </Heading>
            <Text size="4" style={{
              textAlign: 'center',
              color: '#2d3748',
              maxWidth: '600px',
              marginBottom: '3rem',
              fontWeight: '500'
            }}>
              The all-in-one tool that helps you share everything you create,
              curate and sell from your social media profiles.
            </Text>

            <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="6" width="100%">
              <Card style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <Box style={{
                    backgroundColor: '#d4a5d4',
                    padding: '1rem',
                    borderRadius: '50%',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(212, 165, 212, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    <GlobeIcon width="32" height="32" />
                  </Box>
                  <Heading size="5" style={{ color: '#1a202c' }}>One Link</Heading>
                  <Text size="3" style={{ color: '#2d3748' }}>
                    Share everything you create, curate and sell from your social media profiles in one simple link.
                  </Text>
                </Flex>
              </Card>

              <Card style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <Box style={{
                    backgroundColor: '#a8e6cf',
                    padding: '1rem',
                    borderRadius: '50%',
                    color: '#4a5568',
                    boxShadow: '0 4px 16px rgba(168, 230, 207, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    <PersonIcon width="32" height="32" />
                  </Box>
                  <Heading size="5" style={{ color: '#1a202c' }}>Easy to Use</Heading>
                  <Text size="3" style={{ color: '#2d3748' }}>
                    Set up your Violent in minutes. No coding required. Just add your links and customize your page.
                  </Text>
                </Flex>
              </Card>

              <Card style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <Box style={{
                    backgroundColor: '#b8d4f0',
                    padding: '1rem',
                    borderRadius: '50%',
                    color: '#4a5568',
                    boxShadow: '0 4px 16px rgba(184, 212, 240, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    <StarIcon width="32" height="32" />
                  </Box>
                  <Heading size="5" style={{ color: '#1a202c' }}>Customizable</Heading>
                  <Text size="3" style={{ color: '#2d3748' }}>
                    Make it yours with custom themes, colors, and layouts that match your brand and personality.
                  </Text>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* What is Violent Section */}
      <Box style={{ padding: '6rem 0' }}>
        <Container size="4">
          <Grid columns={{ initial: '1', lg: '2' }} gap="8" align="center">
            <Box>
              <Heading size="8" style={{ marginBottom: '1.5rem' }}>
                What is Violent?
              </Heading>
              <Text size="4" style={{ color: '#2d3748', marginBottom: '2rem', lineHeight: '1.6', fontWeight: '500' }}>
                Violent is a free tool that allows you to share multiple links from your social media
                bio. Instead of being limited to just one link, you can share all your important links
                in one place.
              </Text>

              <Flex direction="column" gap="3">
                <Flex align="center" gap="3">
                  <CheckIcon width="20" height="20" style={{ color: '#16a34a' }} />
                  <Text size="3">Share unlimited links from one bio link</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <CheckIcon width="20" height="20" style={{ color: '#16a34a' }} />
                  <Text size="3">Track clicks and engagement analytics</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <CheckIcon width="20" height="20" style={{ color: '#16a34a' }} />
                  <Text size="3">Customize your page to match your brand</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <CheckIcon width="20" height="20" style={{ color: '#16a34a' }} />
                  <Text size="3">Integrate with all major social platforms</Text>
                </Flex>
              </Flex>
            </Box>

            <Box style={{
              backgroundColor: '#e6f3ff',
              padding: '3rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <Heading size="6" style={{ marginBottom: '1rem', color: '#1e293b' }}>
                Perfect for:
              </Heading>
              <Flex direction="column" gap="4">
                <Badge size="3" variant="soft" style={{ backgroundColor: '#d4a5d4', color: '#4a5568' }}>Content Creators</Badge>
                <Badge size="3" variant="soft" style={{ backgroundColor: '#a8e6cf', color: '#4a5568' }}>Small Businesses</Badge>
                <Badge size="3" variant="soft" style={{ backgroundColor: '#b8d4f0', color: '#4a5568' }}>Influencers</Badge>
                <Badge size="3" variant="soft" style={{ backgroundColor: '#d4a5d4', color: '#4a5568' }}>Musicians</Badge>
                <Badge size="3" variant="soft" style={{ backgroundColor: '#a8e6cf', color: '#4a5568' }}>Artists</Badge>
                <Badge size="3" variant="soft" style={{ backgroundColor: '#b8d4f0', color: '#4a5568' }}>Entrepreneurs</Badge>
              </Flex>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box style={{ padding: '6rem 0', backgroundColor: '#f8fafc' }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="6">
            <Heading size="8" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              What our users say
            </Heading>
            <Text size="4" style={{
              textAlign: 'center',
              color: '#2d3748',
              maxWidth: '600px',
              marginBottom: '3rem',
              fontWeight: '500'
            }}>
              Join thousands of creators, businesses, and influencers who trust Violent
            </Text>

            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="6" width="100%">
              <Card style={{ padding: '2rem' }}>
                <Flex direction="column" gap="4">
                  <Text size="3" style={{ color: '#2d3748', fontStyle: 'italic' }}>
                    "Violent has completely transformed how I share my content. I can now direct my followers to all my platforms from one simple link!"
                  </Text>
                  <Flex align="center" gap="3">
                    <Box style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#d4a5d4',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      S
                    </Box>
                    <Box>
                      <Text size="2" style={{ fontWeight: '600' }}>Sarah Johnson</Text>
                      <Text size="1" style={{ color: '#4a5568' }}>Content Creator</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Card>

              <Card style={{ padding: '2rem' }}>
                <Flex direction="column" gap="4">
                  <Text size="3" style={{ color: '#2d3748', fontStyle: 'italic' }}>
                    "As a small business owner, Violent helps me showcase all my products and services in one place. It's been a game-changer for my sales!"
                  </Text>
                  <Flex align="center" gap="3">
                    <Box style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#a8e6cf',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4a5568',
                      fontWeight: 'bold'
                    }}>
                      M
                    </Box>
                    <Box>
                      <Text size="2" style={{ fontWeight: '600' }}>Mike Chen</Text>
                      <Text size="1" style={{ color: '#4a5568' }}>Small Business Owner</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Card>

              <Card style={{ padding: '2rem' }}>
                <Flex direction="column" gap="4">
                  <Text size="3" style={{ color: '#2d3748', fontStyle: 'italic' }}>
                    "The analytics feature is incredible. I can see exactly which links my audience engages with most, helping me optimize my content strategy."
                  </Text>
                  <Flex align="center" gap="3">
                    <Box style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#b8d4f0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4a5568',
                      fontWeight: 'bold'
                    }}>
                      A
                    </Box>
                    <Box>
                      <Text size="2" style={{ fontWeight: '600' }}>Alex Rivera</Text>
                      <Text size="1" style={{ color: '#4a5568' }}>Digital Marketer</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box style={{ padding: '6rem 0', backgroundColor: '#ffffff' }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="6">
            <Heading size="8" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Simple, transparent pricing
            </Heading>
            <Text size="4" style={{
              textAlign: 'center',
              color: '#2d3748',
              maxWidth: '600px',
              marginBottom: '3rem',
              fontWeight: '500'
            }}>
              Choose the plan that's right for you. Start free, upgrade when you're ready.
            </Text>

            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="6" width="100%">
              <Card style={{ padding: '2rem', textAlign: 'center', border: '2px solid #e2e8f0' }}>
                <Flex direction="column" gap="4">
                  <Heading size="6">Free</Heading>
                  <Text size="2" style={{ color: '#4a5568' }}>Perfect for getting started</Text>
                  <Box>
                    <Text size="8" style={{ fontWeight: '800', color: '#2d3748' }}>$0</Text>
                    <Text size="3" style={{ color: '#4a5568' }}>/month</Text>
                  </Box>
                  <Flex direction="column" gap="3" align="start" style={{ textAlign: 'left' }}>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Up to 5 links</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Basic analytics</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Custom themes</Text>
                    </Flex>
                  </Flex>
                  <Button size="3" variant="outline" style={{ width: '100%' }} onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </Flex>
              </Card>

              <Card style={{ padding: '2rem', textAlign: 'center', border: '2px solid #d4a5d4', position: 'relative' }}>
                <Box style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#d4a5d4',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Most Popular
                </Box>
                <Flex direction="column" gap="4">
                  <Heading size="6">Pro</Heading>
                  <Text size="2" style={{ color: '#4a5568' }}>For growing creators</Text>
                  <Box>
                    <Text size="8" style={{ fontWeight: '800', color: '#2d3748' }}>$9</Text>
                    <Text size="3" style={{ color: '#4a5568' }}>/month</Text>
                  </Box>
                  <Flex direction="column" gap="3" align="start" style={{ textAlign: 'left' }}>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Unlimited links</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Advanced analytics</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Priority support</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Custom branding</Text>
                    </Flex>
                  </Flex>
                  <Button size="3" variant="solid" style={{
                    width: '100%',
                    backgroundColor: '#d4a5d4',
                    color: 'white'
                  }} onClick={handleGetStarted}>
                    Start Free Trial
                  </Button>
                </Flex>
              </Card>

              <Card style={{ padding: '2rem', textAlign: 'center', border: '2px solid #e2e8f0' }}>
                <Flex direction="column" gap="4">
                  <Heading size="6">Business</Heading>
                  <Text size="2" style={{ color: '#4a5568' }}>For teams and agencies</Text>
                  <Box>
                    <Text size="8" style={{ fontWeight: '800', color: '#2d3748' }}>$29</Text>
                    <Text size="3" style={{ color: '#4a5568' }}>/month</Text>
                  </Box>
                  <Flex direction="column" gap="3" align="start" style={{ textAlign: 'left' }}>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Everything in Pro</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">Team management</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">White-label options</Text>
                    </Flex>
                    <Flex align="center" gap="3">
                      <CheckIcon width="16" height="16" style={{ color: '#16a34a' }} />
                      <Text size="3">API access</Text>
                    </Flex>
                  </Flex>
                  <Button size="3" variant="outline" style={{ width: '100%' }}>
                    Contact Sales
                  </Button>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Additional Features Section */}
      <Box style={{ padding: '6rem 0', backgroundColor: '#f0f8ff' }}>
        <Container size="4">
          <Grid columns={{ initial: '1', lg: '2' }} gap="8" align="center">
            <Box>
              <Heading size="8" style={{ marginBottom: '1.5rem' }}>
                Built for creators, by creators
              </Heading>
              <Text size="4" style={{ color: '#2d3748', marginBottom: '2rem', lineHeight: '1.6', fontWeight: '500' }}>
                We understand the challenges of managing multiple social media profiles. That's why we built Violent
                with features that actually matter to content creators, influencers, and businesses.
              </Text>

              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box style={{
                    backgroundColor: '#d4a5d4',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}>
                    <CheckIcon width="20" height="20" />
                  </Box>
                  <Box>
                    <Text size="3" style={{ fontWeight: '600' }}>Real-time Analytics</Text>
                    <Text size="2" style={{ color: '#4a5568' }}>Track clicks, views, and engagement</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap="3">
                  <Box style={{
                    backgroundColor: '#a8e6cf',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: '#4a5568'
                  }}>
                    <CheckIcon width="20" height="20" />
                  </Box>
                  <Box>
                    <Text size="3" style={{ fontWeight: '600' }}>Mobile Optimized</Text>
                    <Text size="2" style={{ color: '#4a5568' }}>Perfect experience on all devices</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap="3">
                  <Box style={{
                    backgroundColor: '#b8d4f0',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: '#4a5568'
                  }}>
                    <CheckIcon width="20" height="20" />
                  </Box>
                  <Box>
                    <Text size="3" style={{ fontWeight: '600' }}>Social Media Integration</Text>
                    <Text size="2" style={{ color: '#4a5568' }}>Connect all your platforms seamlessly</Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            <Box style={{
              backgroundColor: '#ffffff',
              padding: '3rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Heading size="6" style={{ marginBottom: '1rem', color: '#2d3748' }}>
                Trusted by industry leaders
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="3" style={{ fontWeight: '600' }}>Fortune 500 Companies</Text>
                  <Badge size="2" variant="soft" style={{ backgroundColor: '#d4a5d4', color: '#4a5568' }}>500+</Badge>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="3" style={{ fontWeight: '600' }}>Content Creators</Text>
                  <Badge size="2" variant="soft" style={{ backgroundColor: '#a8e6cf', color: '#4a5568' }}>2M+</Badge>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="3" style={{ fontWeight: '600' }}>Small Businesses</Text>
                  <Badge size="2" variant="soft" style={{ backgroundColor: '#b8d4f0', color: '#4a5568' }}>50K+</Badge>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="3" style={{ fontWeight: '600' }}>Influencers</Text>
                  <Badge size="2" variant="soft" style={{ backgroundColor: '#d4a5d4', color: '#4a5568' }}>100K+</Badge>
                </Flex>
              </Flex>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
        color: 'white'
      }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="6" style={{ textAlign: 'center' }}>
            <Heading size="8" style={{ color: 'white' }}>
              Ready to get started?
            </Heading>
            <Text size="4" style={{
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '500px'
            }}>
              Join millions of creators, businesses, and influencers who use Violent
              to share everything they create.
            </Text>
            <Button size="4" variant="solid" style={{
              backgroundColor: '#d4a5d4',
              color: 'white',
              fontWeight: '600',
              padding: '0 2rem'
            }} onClick={handleGetStarted}>
              Create Your Violent
              <ArrowRightIcon width="16" height="16" />
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Footer */}
      <Box style={{
        padding: '3rem 0',
        backgroundColor: '#2d3748',
        color: 'white'
      }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="4">
            <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © 2024 Violent. All rights reserved.
            </Text>
            <Flex gap="6" wrap="wrap" justify="center">
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Privacy Policy</Text>
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Terms of Service</Text>
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Help Center</Text>
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Contact</Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
