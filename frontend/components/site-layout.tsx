'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';
import { MobileMenu } from '@/components/mobile-menu';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface SiteLayoutProps {
	children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50'>
			<SiteHeader
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
			/>
			<MobileMenu
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
			/>

			<main className='container mx-auto px-4 py-8 md:px-6'>{children}</main>

			<footer className='border-t border-slate-800 bg-slate-950 mt-16'>
				<div className='container mx-auto px-4 py-8 md:px-6'>
					<div className='grid gap-8 md:grid-cols-3'>
						<div>
							<div className='flex items-center gap-2'>
								<Lock className='h-6 w-6 text-purple-500' />
								<span className='text-xl font-bold'>ENVOTE</span>
							</div>
							<p className='mt-2 text-sm text-slate-400'>
								A privacy-focused voting platform that ensures your vote remains
								confidential.
							</p>
						</div>
						<div className='grid grid-cols-2 gap-8 md:col-span-2'>
							<div>
								<h3 className='text-sm font-medium uppercase tracking-wider text-slate-300'>
									Resources
								</h3>
								<ul className='mt-4 space-y-2'>
									<li>
										<Link
											href='/how-it-works'
											className='text-sm text-slate-400 hover:text-white'
										>
											How It Works
										</Link>
									</li>
									<li>
										<Link
											href='/features'
											className='text-sm text-slate-400 hover:text-white'
										>
											Features
										</Link>
									</li>
									<li>
										<Link
											href='/faq'
											className='text-sm text-slate-400 hover:text-white'
										>
											FAQ
										</Link>
									</li>
								</ul>
							</div>
							<div>
								<h3 className='text-sm font-medium uppercase tracking-wider text-slate-300'>
									Legal
								</h3>
								<ul className='mt-4 space-y-2'>
									<li>
										<Link
											href='#'
											className='text-sm text-slate-400 hover:text-white'
										>
											Privacy Policy
										</Link>
									</li>
									<li>
										<Link
											href='#'
											className='text-sm text-slate-400 hover:text-white'
										>
											Terms of Service
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<Separator className='my-8 bg-slate-800' />
					<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
						<p className='text-center text-sm text-slate-400'>
							&copy; {new Date().getFullYear()} ENVOTE. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
