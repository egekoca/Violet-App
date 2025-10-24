import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  Separator
} from '@radix-ui/themes';
import {
  Cross2Icon,
  CheckIcon,
  CopyIcon,
  LinkBreak2Icon
} from '@radix-ui/react-icons';
import { useLogin } from '../contexts/LoginContext';
import { useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit';

const LoginPopup: React.FC = () => {
  const { isLoginOpen, closeLogin, isConnected, userAddress } = useLogin();
  const { mutate: connectWallet } = useConnectWallet();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  const handleConnectWallet = () => {
    // This will trigger the wallet selection modal
    connectWallet({} as any);
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    closeLogin();
  };

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isLoginOpen) return null;

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLogin();
        }
      }}
    >
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          animation: 'fadeInUp 0.3s ease-out'
        }}
      >
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Heading size="6" style={{ color: '#1a202c' }}>
              Connect Your Wallet
            </Heading>
            <Button
              variant="ghost"
              size="2"
              onClick={closeLogin}
              style={{
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <Cross2Icon width="16" height="16" />
            </Button>
          </Flex>

          <Separator />

          {/* Content */}
          {!isConnected ? (
            <Flex direction="column" gap="4" align="center" style={{ padding: '2rem 0' }}>
              <Box style={{
                backgroundColor: '#d4a5d4',
                padding: '1.5rem',
                borderRadius: '50%',
                color: 'white',
                marginBottom: '1rem'
              }}>
                <LinkBreak2Icon width="32" height="32" />
              </Box>

              <Heading size="5" style={{ textAlign: 'center', color: '#1a202c' }}>
                Connect Your Wallet
              </Heading>

              <Text size="3" style={{
                textAlign: 'center',
                color: '#4a5568',
                maxWidth: '300px',
                lineHeight: '1.5'
              }}>
                Connect your wallet to access Violent and start creating your bio link page.
              </Text>

              <Button
                size="4"
                variant="solid"
                onClick={handleConnectWallet}
                style={{
                  backgroundColor: '#d4a5d4',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0 2rem',
                  marginTop: '1rem'
                }}
              >
                <LinkBreak2Icon width="16" height="16" />
                Connect Wallet
              </Button>

              <Text size="2" style={{
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '250px'
              }}>
                We support Sui wallets including Sui Wallet, Suiet, and more.
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="4" style={{ padding: '2rem 0' }}>
              <Flex align="center" gap="3" style={{ marginBottom: '1rem' }}>
                <Box style={{
                  backgroundColor: '#16a34a',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  color: 'white'
                }}>
                  <CheckIcon width="16" height="16" />
                </Box>
                <Text size="3" style={{ fontWeight: '600', color: '#1a202c' }}>
                  Wallet Connected Successfully!
                </Text>
              </Flex>

              <Box style={{
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <Text size="2" style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                  Your Wallet Address:
                </Text>
                <Flex align="center" gap="2">
                  <Text size="3" style={{
                    fontFamily: 'monospace',
                    color: '#1a202c',
                    fontWeight: '500'
                  }}>
                    {userAddress ? formatAddress(userAddress) : ''}
                  </Text>
                  <Button
                    variant="ghost"
                    size="1"
                    onClick={copyAddress}
                    style={{ color: '#64748b' }}
                  >
                    <CopyIcon width="12" height="12" />
                  </Button>
                </Flex>
              </Box>

              <Flex gap="3" style={{ marginTop: '1rem' }}>
                <Button
                  size="3"
                  variant="solid"
                  onClick={closeLogin}
                  style={{
                    backgroundColor: '#d4a5d4',
                    color: 'white',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  Continue to Violent
                </Button>
                <Button
                  size="3"
                  variant="outline"
                  onClick={handleDisconnectWallet}
                  style={{
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    flex: 1
                  }}
                >
                  Disconnect
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Card>
    </Box>
  );
};

export default LoginPopup;
