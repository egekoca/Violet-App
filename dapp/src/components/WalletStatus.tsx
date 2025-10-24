import React from 'react';
import { useLogin } from '../contexts/LoginContext';
import {
  Box,
  Flex,
  Text,
  Button,
  Badge
} from '@radix-ui/themes';
import {
  CheckIcon,
  CopyIcon
} from '@radix-ui/react-icons';

const WalletStatus: React.FC = () => {
  const { isConnected, userAddress } = useLogin();

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Box style={{
      position: 'fixed',
      top: '80px',
      right: '1rem',
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <Flex align="center" gap="3">
        <Badge
          size="2"
          variant="soft"
          style={{
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            fontWeight: '600'
          }}
        >
          <CheckIcon width="12" height="12" />
          Connected
        </Badge>

        <Flex align="center" gap="2">
          <Text size="2" style={{
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
            style={{
              color: '#64748b',
              padding: '0.25rem'
            }}
          >
            <CopyIcon width="12" height="12" />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default WalletStatus;
