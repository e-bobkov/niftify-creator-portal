
export const truncateAddress = (address: string | null): string => {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getExplorerUrl = (address: string, chain: string = 'polygon'): string => {
  const explorers = {
    polygon: 'https://polygonscan.com',
    ethereum: 'https://etherscan.io'
  };
  
  return `${explorers[chain as keyof typeof explorers]}/address/${address}`;
};

export const formatPrice = (price: number | null): string => {
  if (price === null) return 'N/A';
  return `${price.toFixed(2)} ETH`;
};
