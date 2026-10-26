export const ONBOARDING_NETWORKS = [
  { id: "solana", label: "◎ Solana", family: "solana", connected: true },
  { id: "ethereum", label: "Ξ Ethereum", family: "evm", connected: true },
  { id: "base", label: "Base", family: "evm", connected: false },
  { id: "bnb", label: "BNB Smart Chain", family: "evm", connected: false },
  { id: "polygon", label: "Polygon", family: "evm", connected: false },
  { id: "arbitrum", label: "Arbitrum One", family: "evm", connected: false },
  { id: "optimism", label: "Optimism", family: "evm", connected: false },
  { id: "avalanche", label: "Avalanche C-Chain", family: "evm", connected: false },
  { id: "zksync", label: "zkSync Era", family: "evm", connected: false },
  { id: "linea", label: "Linea", family: "evm", connected: false },
  { id: "scroll", label: "Scroll", family: "evm", connected: false },
  { id: "blast", label: "Blast", family: "evm", connected: false },
  { id: "mantle", label: "Mantle", family: "evm", connected: false },
  { id: "gnosis", label: "Gnosis", family: "evm", connected: false },
  { id: "celo", label: "Celo", family: "evm", connected: false },
  { id: "cronos", label: "Cronos", family: "evm", connected: false },
  { id: "opbnb", label: "opBNB", family: "evm", connected: false },
  { id: "sonic", label: "Sonic", family: "evm", connected: false },
  { id: "sei", label: "Sei EVM", family: "evm", connected: false },
  { id: "moonbeam", label: "Moonbeam", family: "evm", connected: false },
] as const;

export type OnboardingNetwork = (typeof ONBOARDING_NETWORKS)[number];
export type OnboardingNetworkId = OnboardingNetwork["id"];
