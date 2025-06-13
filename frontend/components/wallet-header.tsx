'use client';

import { useEffect } from 'react';
import { Wallet, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useGetIsLoggedIn, useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';

// Dynamically import MultiversX components with no SSR
const WebWalletLoginButton = dynamic(
	() => import('@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton/WebWalletLoginButton').then(
		(mod) => mod.WebWalletLoginButton
	),
	{ ssr: false }
);

const ExtensionLoginButton = dynamic(
	() => import('@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton/ExtensionLoginButton').then(
		(mod) => mod.ExtensionLoginButton
	),
	{ ssr: false }
);

export function WalletHeader() {

	const isLoggedIn = useGetIsLoggedIn();
	const { address: mxAddress } = useGetAccount();
	const { network } = useGetNetworkConfig();

	// Show network warning when not on MultiversX
	useEffect(() => {
		if (isLoggedIn && network.chainId !== 'D') { // 'D' is the chain ID for MultiversX mainnet
			toast({
				title: 'Wrong Network',
				description: 'Please switch to MultiversX network to use this dapp',
				variant: 'destructive',
			});
		}
	}, [isLoggedIn, network]);

	// Format address for display
	const formatAddress = (address: string) => {
		return `${address.slice(0, 18)}...${address.slice(-6)}`;
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<div className='flex items-center gap-3'>
			{isLoggedIn ? (
				<div className='flex items-center gap-2'>
					{mxAddress && (
						<div className='flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-300'>
							<Wallet className='h-4 w-4 text-purple-400' />
							<span className='font-mono'>{formatAddress(mxAddress)}</span>
							{network.chainId !== 'D' && (
								<span className='ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white'>
									Wrong Network
								</span>
							)}
						</div>
					)}
					<Link href='/create-vote'>
						<Button
							variant='outline'
							size='sm'
							className='border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-purple-400'
						>
							<PlusCircle className='mr-2 h-4 w-4' />
							Create Campaign
						</Button>
					</Link>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleLogout}
						className='text-slate-300 hover:text-white'
					>
						Disconnect
					</Button>
				</div>
			) : (
				<ExtensionLoginButton
					loginButtonText='Connect Wallet'
					callbackRoute='/'
					buttonClassName='bg-purple-500 text-white hover:bg-purple-600'

				/>
			)}
		</div>
	);
}
