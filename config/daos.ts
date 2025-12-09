export type DAOCategory = 'DeFi' | 'Public Goods' | 'Token Engineering';

export interface DAOConfig {
  id: string;
  name: string;
  displayName: string;
  baseUrl: string;
  logoUrl?: string;
  description?: string;
  category: DAOCategory;
}

/**
 * Get environment variable with fallback to default value
 */
function getEnvVar(key: string, defaultValue: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_ prefixed vars
    return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  }
  // Server-side: can use both prefixed and non-prefixed
  return process.env[`NEXT_PUBLIC_${key}`] || process.env[key] || defaultValue;
}

/**
 * Configuration for available DAOs
 * URLs can be overridden via environment variables
 * Add new DAOs here to extend functionality
 */
export const DAOS: DAOConfig[] = [
  {
    id: 'uniswap',
    name: 'Uniswap',
    displayName: 'Uniswap',
    baseUrl: getEnvVar('UNISWAP_URL', 'https://gov.uniswap.org/'),
    description: 'Uniswap Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'makerdao/sky',
    name: 'MakerDAO/Sky',
    displayName: 'MakerDAO',
    baseUrl: getEnvVar('MAKERDAO_SNAPSHOT_URL', 'https://forum.sky.money/'),
    description: 'MakerDAO Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'aave',
    name: 'Aave',
    displayName: 'Aave',
    baseUrl: getEnvVar('AAVE_URL', 'https://governance.aave.com/'),
    description: 'Aave Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    displayName: 'Arbitrum',
    baseUrl: getEnvVar('ARB_URL', 'https://forum.arbitrum.foundation/'),
    description: 'Arbitrum Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'optimism',
    name: 'Optimism',
    displayName: 'Optimism',
    baseUrl: getEnvVar('OP_URL', 'https://gov.optimism.io/'),
    description: 'Optimism Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'curve DAO',
    name: 'Curve DAO',
    displayName: 'Curve DAO',
    baseUrl: getEnvVar('CURVE_DAO_URL', 'https://gov.curve.finance/'),
    description: 'Curve DAO Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'lido',
    name: 'Lido',
    displayName: 'Lido',
    baseUrl: getEnvVar('LIDO_URL', 'https://research.lido.fi/'),
    description: '',
    category: 'DeFi',
  },
  {
    id: 'justlend dao',
    name: 'JustLend DAO',
    displayName: 'JustLend DAO',
    baseUrl: getEnvVar('JUSTLEND_DAO_URL', 'https://forum.justlend.org/'),
    description: 'JustLend DAO Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'rocket pool dao',
    name: 'Rocket Pool DAO',
    displayName: 'Rocket Pool DAO',
    baseUrl: getEnvVar('ROCKET_POOL_DAO_URL', 'https://dao.rocketpool.net/'),
    description: 'Rocket Pool DAO Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'ssv-network',
    name: 'SSV Network',
    displayName: 'SSV Network',
    baseUrl: getEnvVar('SSV_NETWORK_URL', 'https://forum.ssv.network'),
    description: 'SSV Network Governance Forum',
    category: 'DeFi',
  },
  {
    id: 'gitcoin',
    name: 'Gitcoin',
    displayName: 'Gitcoin',
    baseUrl: getEnvVar('GITCOIN_URL', 'https://gov.gitcoin.co/'),
    description: 'Gitcoin Governance Forum',
    category: 'Public Goods',
  },
  {
    id: 'tec',
    name: 'Token Engineering Commons',
    displayName: 'TEC',
    baseUrl: getEnvVar('TEC_URL', 'https://forum.tecommons.org'),
    description: 'Token Engineering Commons Discourse Forum',
    category: 'Token Engineering',
  },
];

/**
 * Get DAO configuration by ID
 */
export function getDAOById(id: string): DAOConfig | undefined {
  return DAOS.find((dao) => dao.id === id);
}

/**
 * Get DAO configuration by base URL
 */
export function getDAOByBaseUrl(baseUrl: string): DAOConfig | undefined {
  return DAOS.find((dao) => dao.baseUrl === baseUrl);
}

/**
 * Get default number of days from environment variable
 */
export function getDefaultDays(): number {
  const days = getEnvVar('DEFAULT_DAYS', '7');
  const parsed = parseInt(days, 10);
  return isNaN(parsed) || parsed < 1 ? 7 : parsed;
}

