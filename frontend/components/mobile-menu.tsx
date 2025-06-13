'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, LogOut, PlusCircle, User, Wallet } from 'lucide-react';
import { useGetIsLoggedIn, useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { logout } from '@multiversx/sdk-dapp/utils';


interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
	// Mock authentication state
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Get router for navigation
	const router = useRouter();

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

	// Handle disconnection
	const handleDisconnect = async () => {
		try {
			logout();
			setIsAuthenticated(false);
			onClose();
			// Redirect to homepage when disconnecting
			router.push('/');
		} catch (error) {
			console.error('Failed to disconnect:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='md:hidden'>
			<div className='container mx-auto px-4 py-4 bg-slate-900 border-b border-slate-800'>
				<nav className='flex flex-col space-y-4'>
					<Link
						href='/how-it-works'
						className='text-sm font-medium text-slate-300 hover:text-white py-2'
						onClick={onClose}
					>
						How It Works
					</Link>
					<Link
						href='/features'
						className='text-sm font-medium text-slate-300 hover:text-white py-2'
						onClick={onClose}
					>
						Features
					</Link>
					<Link
						href='/faq'
						className='text-sm font-medium text-slate-300 hover:text-white py-2'
						onClick={onClose}
					>
						FAQ
					</Link>
					<Link
						href='/campaigns'
						className='text-sm font-medium text-slate-300 hover:text-white py-2'
						onClick={onClose}
					>
						Votes
					</Link>

					<Separator className='bg-slate-800' />

					{isAuthenticated && (
						<>
							{isLoggedIn && address && (
								<div className='flex items-center gap-2 py-2'>
									<Wallet className='h-4 w-4 text-purple-400' />
									<p className='text-sm font-mono text-slate-300'>
										{address.slice(0, 6)}...{address.slice(-4)}
									</p>
								</div>
							)}

							{isLoggedIn && (
								<>
									<Link
										href='/profile'
										className='flex items-center text-sm font-medium text-slate-300 hover:text-white py-2'
										onClick={onClose}
									>
										<User className='mr-2 h-4 w-4 text-purple-400' />
										Profile
									</Link>
									<Link
										href='/create-vote'
										className='flex items-center text-sm font-medium text-slate-300 hover:text-white py-2'
										onClick={onClose}
									>
										<PlusCircle className='mr-2 h-4 w-4 text-purple-400' />
										Create Vote
									</Link>
								</>
							)}

							{/* Show disconnect button for all authenticated users */}
							<button
								className='flex items-center text-sm font-medium text-red-400 hover:text-red-300 py-2'
								onClick={handleDisconnect}
							>
								<LogOut className='mr-2 h-4 w-4' />
								Disconnect
							</button>
						</>
					)}
				</nav>
			</div>
		</div>
	);
}
