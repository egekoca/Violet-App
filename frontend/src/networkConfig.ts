/**
 * Sui Network Yapılandırması
 * Testnet ve Mainnet ayarları
 */

export type NetworkType = 'testnet' | 'mainnet' | 'devnet' | 'localnet';

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  faucetUrl?: string;
  explorerUrl: string;
}

/**
 * Network yapılandırmaları
 */
export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    name: 'Sui Testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    faucetUrl: 'https://faucet.testnet.sui.io/gas',
    explorerUrl: 'https://suiscan.xyz/testnet',
  },
  mainnet: {
    name: 'Sui Mainnet',
    rpcUrl: 'https://fullnode.mainnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/mainnet',
  },
  devnet: {
    name: 'Sui Devnet',
    rpcUrl: 'https://fullnode.devnet.sui.io:443',
    faucetUrl: 'https://faucet.devnet.sui.io/gas',
    explorerUrl: 'https://suiscan.xyz/devnet',
  },
  localnet: {
    name: 'Local Network',
    rpcUrl: 'http://127.0.0.1:9000',
    explorerUrl: 'http://localhost:9001',
  },
};

/**
 * Aktif network (şu an testnet kullanıyoruz)
 */
export const CURRENT_NETWORK: NetworkType = 'testnet';

/**
 * Aktif network yapılandırmasını al
 */
export function getNetworkConfig(): NetworkConfig {
  return NETWORKS[CURRENT_NETWORK];
}

/**
 * Explorer'da transaction göster
 */
export function getExplorerUrl(txDigest: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/tx/${txDigest}`;
}

/**
 * Explorer'da object göster
 */
export function getObjectExplorerUrl(objectId: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/object/${objectId}`;
}

/**
 * Explorer'da address göster
 */
export function getAddressExplorerUrl(address: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/address/${address}`;
}

