'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Lock,
	Menu,
	X,
} from 'lucide-react';
import { useGetIsLoggedIn, useGetAccount } from '@multiversx/sdk-dapp/hooks';

import { Button } from '@/components/ui/button';
import { WalletHeader } from '@/components/wallet-header';

interface SiteHeaderProps {
	mobileMenuOpen: boolean;
	setMobileMenuOpen: (open: boolean) => void;
}

export function SiteHeader({
	mobileMenuOpen,
	setMobileMenuOpen,
}: SiteHeaderProps) {
	// Mock authentication state - in a real app, this would come from a context or auth provider
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Get wallet state from MultiversX SDK
	const isLoggedIn = useGetIsLoggedIn();
	const { address } = useGetAccount();

	// Update authentication state based on wallet connection
	useEffect(() => {
		if (isLoggedIn && address) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [isLoggedIn, address]);

	return (
		<header className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
			<div className='flex items-center gap-4'>
				<Link href='/' className='flex items-center gap-2'>
					<Lock className='h-6 w-6 text-purple-500' />
					<span className='text-xl font-bold text-white'>ENVOTE</span>
				</Link>
			</div>

			<nav className='hidden md:flex md:gap-4 lg:gap-6'>
				<Link
					href='/how-it-works'
					className='text-sm font-medium text-slate-300 hover:text-white'
				>
					How It Works
				</Link>
				<Link
					href='/features'
					className='text-sm font-medium text-slate-300 hover:text-white'
				>
					Features
				</Link>
				<Link
					href='/faq'
					className='text-sm font-medium text-slate-300 hover:text-white'
				>
					FAQ
				</Link>
				<Link
					href='/campaigns'
					className='text-sm font-medium text-slate-300 hover:text-white'
				>
					Campaigns
				</Link>
			</nav>

			<div className='hidden md:flex items-center gap-3'>
				<WalletHeader />
			</div>

			<Button
				variant='ghost'
				size='icon'
				className='md:hidden'
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
			>
				{mobileMenuOpen ? (
					<X className='h-6 w-6' />
				) : (
					<Menu className='h-6 w-6' />
				)}
			</Button>
		</header>
	);
}
