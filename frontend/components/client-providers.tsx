'use client';

import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ENVIRONMENT } from '@/config';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList/TransactionsToastList';
import { NotificationModal } from '@multiversx/sdk-dapp/UI/NotificationModal/NotificationModal';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals';

// Create a client
const queryClient = new QueryClient();

// Dynamically import DappProvider with no SSR
const DappProvider = dynamic(
	() => import('@multiversx/sdk-dapp/wrappers').then((mod) => mod.DappProvider),
	{ ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		<DappProvider
			environment={ENVIRONMENT}
			// customNetworkConfig={{
			// 	name: 'customConfig',
			// 	walletConnectV2ProjectId: 'c842a6d0c9eece9497bb3cc9ad9d0ae8',
			//   }}
		>
				<QueryClientProvider client={queryClient}>
					<TransactionsToastList />
					<NotificationModal />
					<SignTransactionsModals />
						{children}
						<Toaster />
				</QueryClientProvider>
		</DappProvider>
	);
}
