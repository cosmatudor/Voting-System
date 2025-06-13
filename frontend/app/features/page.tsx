import Link from 'next/link';
import {
	ArrowRight,
	Lock,
	Shield,
	Wallet,
	Check,
	EyeOff,
	FileCheck,
	Users,
	Key,
	Fingerprint,
	Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FeaturesPage() {
	return (
		<>
			<main className='container mx-auto px-4 py-8 md:px-6'>
				{/* Hero Section */}
				<section className='py-12 md:py-16'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
							Platform{' '}
							<span className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent'>
								Features
							</span>
						</h1>
						<p className='mt-6 text-xl text-slate-400'>
							Discover the powerful features that make ENVOTE the most transparent, secure, and user-friendly voting platform. Empower your community with tamper-proof, accessible, and easy-to-use digital voting on MultiversX.
						</p>
					</div>
				</section>

				{/* Feature Categories */}
				<section className='py-12'>
					<div className='mx-auto max-w-5xl'>
						<Tabs defaultValue='community' className='w-full'>
							<div className='flex justify-center'>
								<TabsList className='grid w-full max-w-md grid-cols-3 bg-slate-800/50'>
									<TabsTrigger
										value='community'
										className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
									>
										Community
									</TabsTrigger>
									<TabsTrigger
										value='security'
										className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
									>
										Security
									</TabsTrigger>
									<TabsTrigger
										value='usability'
										className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
									>
										Usability
									</TabsTrigger>
								</TabsList>
							</div>

							{/* Community Features (replaces Privacy) */}
							<TabsContent value='community' className='mt-8'>
								<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Users className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>Collective Decision-Making</CardTitle>
											<CardDescription className='text-slate-400'>Empower your group to make important decisions together, transparently and fairly.</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Inclusive voting for all members</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Custom eligibility rules</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Open participation or invite-only</span></li>
											</ul>
										</CardContent>
									</Card>
									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Wallet className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>Sponsored Transactions</CardTitle>
											<CardDescription className='text-slate-400'>Encourage participation by covering gas fees for your voters—perfect for DAOs and communities.</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Lower participation barriers</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Flexible campaign funding</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Easy relayer setup</span></li>
											</ul>
										</CardContent>
									</Card>
									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Shield className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>Community Engagement</CardTitle>
											<CardDescription className='text-slate-400'>Boost engagement with transparent, on-chain voting and real-time results for your group.</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Live feedback and statistics</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Open results for all members</span></li>
												<li className='flex items-start gap-2'><Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' /><span>Strengthen trust and participation</span></li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Security Features */}
							<TabsContent value='security' className='mt-8'>
								<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400'>
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
											<CardTitle className='mt-4 text-white'>
												Tamper-Proof Ballot Box
											</CardTitle>
											<CardDescription className='text-slate-400'>
												Blockchain-based storage ensures votes cannot be altered
												or deleted
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Immutable blockchain record of all votes</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>
														Distributed ledger prevents single point of failure
													</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>
														Cryptographic validation of vote integrity
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400'>
												<Key className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>Open Participation</CardTitle>
											<CardDescription className='text-slate-400'>Allow anyone in your community to join and vote, making decision-making more inclusive and accessible for all.</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>No single entity can decrypt votes alone</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>M-of-N threshold scheme for decryption</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>
														Prevents unauthorized access to voting data
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400'>
												<FileCheck className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>
												Auditable Results
											</CardTitle>
											<CardDescription className='text-slate-400'>
												Cryptographic proofs allow independent verification of
												results
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Public verification of vote tallying</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Mathematical proofs of correct execution</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Open-source code for transparency</span>
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Usability Features */}
							<TabsContent value='usability' className='mt-8'>
								<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Zap className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>
												Simple Voting Interface
											</CardTitle>
											<CardDescription className='text-slate-400'>
												Intuitive design makes voting easy for everyone
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Clean, modern user interface</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Mobile-responsive design</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Accessibility features for all users</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Wallet className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>
												Wallet Integration
											</CardTitle>
											<CardDescription className='text-slate-400'>
												Seamless connection with popular blockchain wallets
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Support for multiple wallet providers</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>One-click authentication</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>No personal data stored on servers</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
										<CardHeader>
											<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
												<Users className='h-6 w-6' />
											</div>
											<CardTitle className='mt-4 text-white'>
												Customizable Polls
											</CardTitle>
											<CardDescription className='text-slate-400'>
												Create and manage various types of voting events
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2 text-sm text-slate-400'>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>
														Multiple voting formats (yes/no, multiple choice)
													</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Configurable voting periods</span>
												</li>
												<li className='flex items-start gap-2'>
													<Check className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
													<span>Custom eligibility requirements</span>
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</section>

				{/* Feature Comparison */}
				<section className='py-12'>
					<div className='mx-auto max-w-5xl'>
						<h2 className='text-center text-3xl font-bold tracking-tight text-white'>
							Compare with Traditional Voting
						</h2>
						<p className='mt-4 text-center text-slate-400'>
							See how ENVOTE compares to traditional voting methods
						</p>

						<div className='mt-12 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
							<div className='overflow-x-auto'>
								<table className='w-full min-w-full'>
									<thead>
										<tr className='border-b border-slate-800 bg-slate-900/80'>
											<th className='px-6 py-4 text-left text-sm font-medium text-slate-300'>
												Feature
											</th>
											<th className='px-6 py-4 text-center text-sm font-medium text-purple-400'>
												ENVOTE
											</th>
											<th className='px-6 py-4 text-center text-sm font-medium text-slate-300'>
												Traditional Voting
											</th>
										</tr>
									</thead>
									<tbody>
										<tr className='border-b border-slate-800 bg-slate-900/30'>
											<td className='px-6 py-4 text-sm text-white'>
												Tamper-Proof Records
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												No
											</td>
										</tr>
										<tr className='border-b border-slate-800'>
											<td className='px-6 py-4 text-sm text-white'>
												Independent Verification
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												Limited
											</td>
										</tr>
										<tr className='border-b border-slate-800 bg-slate-900/30'>
											<td className='px-6 py-4 text-sm text-white'>
												Remote Participation
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												Limited
											</td>
										</tr>
										<tr className='border-b border-slate-800'>
											<td className='px-6 py-4 text-sm text-white'>
												Cost Efficiency
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												Expensive
											</td>
										</tr>
										<tr className='bg-slate-900/30'>
											<td className='px-6 py-4 text-sm text-white'>
												Real-time Results
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												Delayed
											</td>
										</tr>
										<tr className='border-b border-slate-800'>
											<td className='px-6 py-4 text-sm text-white'>
												Election Integrity
											</td>
											<td className='px-6 py-4 text-center text-sm text-green-500'>
												<Check className='mx-auto h-5 w-5' />
											</td>
											<td className='px-6 py-4 text-center text-sm text-slate-400'>
												Vulnerable to Corruption
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
