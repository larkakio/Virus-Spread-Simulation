import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { injected, baseAccount, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    baseAccount({ appName: 'Virus Spread Simulation' }),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  ssr: true,
  storage: createStorage({ storage: cookieStorage, key: 'vss:wk' }),
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
