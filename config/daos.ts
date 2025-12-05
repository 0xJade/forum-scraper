export interface DAOConfig {
  id: string;
  name: string;
  displayName: string;
  baseUrl: string;
  logoUrl?: string;
  description?: string;
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
    id: 'ssv-network',
    name: 'SSV Network',
    displayName: 'SSV Network',
    baseUrl: getEnvVar('SSV_NETWORK_URL', 'https://forum.ssv.network'),
    description: 'SSV Network Governance Forum',
  },
  {
    id: 'tec',
    name: 'Token Engineering Commons',
    displayName: 'TEC',
    baseUrl: getEnvVar('TEC_URL', 'https://forum.tecommons.org'),
    description: 'Token Engineering Commons Discourse Forum',
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

