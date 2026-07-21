import type { Eip1193Provider } from "./asset-approval";

type InjectedWallet = Eip1193Provider & Record<string, unknown>;

type WalletWindow = {
  ethereum?: InjectedWallet & { providers?: InjectedWallet[] };
  okxwallet?: { ethereum?: InjectedWallet };
  trustwallet?: InjectedWallet;
  tokenpocket?: { ethereum?: InjectedWallet };
};

export type DetectedWalletProvider = {
  id: string;
  name: string;
  provider: Eip1193Provider;
};

const walletDetectors: Array<{
  id: string;
  name: string;
  matches: (provider: InjectedWallet) => boolean;
}> = [
  { id: "metamask", name: "MetaMask", matches: (provider) => provider.isMetaMask === true },
  { id: "coinbase", name: "Coinbase Wallet", matches: (provider) => provider.isCoinbaseWallet === true },
  { id: "okx", name: "OKX Wallet", matches: (provider) => provider.isOkxWallet === true || provider.isOKExWallet === true },
  { id: "trust", name: "Trust Wallet", matches: (provider) => provider.isTrust === true || provider.isTrustWallet === true },
  { id: "bitget", name: "Bitget Wallet", matches: (provider) => provider.isBitKeep === true || provider.isBitget === true },
  { id: "tokenpocket", name: "TokenPocket", matches: (provider) => provider.isTokenPocket === true },
  { id: "rabby", name: "Rabby Wallet", matches: (provider) => provider.isRabby === true },
  { id: "binance", name: "Binance Wallet", matches: (provider) => provider.isBinance === true || provider.isBinanceChain === true },
];

export function detectEvmWalletProviders(source: unknown): DetectedWalletProvider[] {
  const providers = collectInjectedProviders(source as WalletWindow).filter(hasRequest);
  const detected: DetectedWalletProvider[] = [];
  const used = new Set<InjectedWallet>();

  for (const detector of walletDetectors) {
    const provider = providers.find((item) => !used.has(item) && detector.matches(item));
    if (!provider) continue;
    used.add(provider);
    detected.push({ id: detector.id, name: detector.name, provider });
  }

  for (const provider of providers) {
    if (used.has(provider)) continue;
    if (isUnsupportedInjectedWallet(provider)) continue;
    used.add(provider);
    detected.push({ id: "evm", name: "EVM Wallet", provider });
  }

  return detected;
}

export function getPreferredEvmProvider(source: unknown): DetectedWalletProvider | null {
  return detectEvmWalletProviders(source)[0] || null;
}

function collectInjectedProviders(source: WalletWindow): InjectedWallet[] {
  const direct = source.ethereum;
  const providers = direct?.providers?.length ? direct.providers : direct ? [direct] : [];
  return [
    ...providers,
    source.okxwallet?.ethereum,
    source.trustwallet,
    source.tokenpocket?.ethereum,
  ].filter((provider): provider is InjectedWallet => Boolean(provider));
}

function hasRequest(provider: InjectedWallet): provider is InjectedWallet & Eip1193Provider {
  return typeof provider.request === "function";
}

function isUnsupportedInjectedWallet(_provider: InjectedWallet) {
  return false;
}
