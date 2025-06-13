'use client';

import type React from 'react';
import Link from 'next/link';
import {
	ArrowRight,
	Check,
	Lock,
	Shield,
	Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
} from '@/components/ui/card';

export default function Home() {
	const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const section = document.getElementById('how-it-works');
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<>
			{/* Hero Section */}
			<section className='px-4 py-16 md:px-6 md:py-24 lg:py-32'>
				<div className='mx-auto max-w-3xl text-center'>
					<h1 className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl'>
						Decentralized Voting Made Simple
					</h1>
					<p className='mt-4 text-xl text-slate-400'>
						A modern voting platform built on MultiversX blockchain that makes governance 
						accessible to everyone. Create polls, manage campaigns, and let your community 
						vote with ease. Support participation through sponsored transactions.
					</p>
					<div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
						<Link href='/campaigns'>
							<Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'>
								Browse Campaigns
								<ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</Link>
						<a href='#how-it-works' onClick={scrollToHowItWorks}>
							<Button
								variant='outline'
								className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
							>
								Learn More
							</Button>
						</a>
					</div>
				</div>
			</section>

			{/* User Flow */}
			<section id='how-it-works' className='px-4 py-16 md:px-6 scroll-mt-16'>
				<div className='mx-auto max-w-4xl'>
					<h2 className='text-center text-3xl font-bold tracking-tight text-white'>
						How It Works
					</h2>
					<p className='mt-4 text-center text-slate-400'>
						A streamlined process to create and participate in votes
					</p>

					<div className='mt-12 grid gap-8 md:grid-cols-3'>
						<div className='flex flex-col items-center text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
								<Wallet className='h-8 w-8' />
							</div>
							<h3 className='mt-4 text-xl font-bold text-white'>
								1. Connect Wallet
							</h3>
							<p className='mt-2 text-slate-400'>
								Connect your MultiversX wallet to create or participate in campaigns
							</p>
						</div>
						<div className='flex flex-col items-center text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-400'>
								<Check className='h-8 w-8' />
							</div>
							<h3 className='mt-4 text-xl font-bold text-white'>2. Vote</h3>
							<p className='mt-2 text-slate-400'>
								Cast your vote on any active proposal in your community
							</p>
						</div>
						<div className='flex flex-col items-center text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
								<Shield className='h-8 w-8' />
							</div>
							<h3 className='mt-4 text-xl font-bold text-white'>3. Track Results</h3>
							<p className='mt-2 text-slate-400'>
								Monitor real-time results and campaign statistics
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Key Features */}
			<section className='px-4 py-16 md:px-6'>
				<div className='mx-auto max-w-4xl'>
					<h2 className='text-center text-3xl font-bold tracking-tight text-white'>
						Key Features
					</h2>
					<p className='mt-4 text-center text-slate-400'>
						Everything you need to run successful voting campaigns
					</p>

					<div className='mt-12 grid gap-6 md:grid-cols-2'>
						<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
							<CardContent className='flex gap-4 p-6'>
								<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
									<Wallet className='h-6 w-6' />
								</div>
								<div>
									<h3 className='text-lg font-bold text-white'>
										Sponsored Transactions
									</h3>
									<p className='mt-2 text-slate-400'>
										Increase participation by covering gas fees for your voters
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
							<CardContent className='flex gap-4 p-6'>
								<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400'>
									<Shield className='h-6 w-6' />
								</div>
								<div>
									<h3 className='text-lg font-bold text-white'>
										Transparent Results
									</h3>
									<p className='mt-2 text-slate-400'>
										Real-time vote counting and result verification on the blockchain
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
							<CardContent className='flex gap-4 p-6'>
								<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-6 w-6'
									>
										<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
										<path d='m9 12 2 2 4-4' />
									</svg>
								</div>
								<div>
									<h3 className='text-lg font-bold text-white'>
										Custom Campaigns
									</h3>
									<p className='mt-2 text-slate-400'>
										Create tailored voting campaigns with multiple options and timeframes
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
							<CardContent className='flex gap-4 p-6'>
								<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-6 w-6'
									>
										<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
										<path d='M12 8v4' />
										<path d='M12 16h.01' />
									</svg>
								</div>
								<div>
									<h3 className='text-lg font-bold text-white'>
										Community Focused
									</h3>
									<p className='mt-2 text-slate-400'>
										Built for communities, DAOs, and organizations to make decisions together
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className='mt-8 flex justify-center'>
						<Link href='/features'>
							<Button
								variant='outline'
								className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
							>
								Explore All Features
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
