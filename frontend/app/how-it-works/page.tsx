'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wallet, Check, EyeOff, FileCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
	return (
		<>
			{/* Hero Section */}
			<section className='py-12 md:py-16'>
				<div className='mx-auto max-w-3xl text-center'>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
						How{' '}
						<span className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent'>
							Confidential Voting
						</span>{' '}
						Works
					</h1>
					<p className='mt-6 text-xl text-slate-400'>
						ENVOTE combines end-to-end encryption, fully homomorphic encryption,
						and blockchain technology to create a voting system that is both
						private and verifiable. Designed to combat corruption in elections
						and create truly fair voting systems worldwide.
					</p>
				</div>
			</section>

			{/* Process Overview */}
			<section className='py-12'>
				<div className='mx-auto max-w-5xl'>
					<div className='grid gap-12 md:grid-cols-2 md:items-center'>
						<div>
							<h2 className='text-3xl font-bold tracking-tight'>
								The Confidential Voting Process
							</h2>
							<p className='mt-4 text-slate-400'>
								ENVOTE combines end-to-end encryption, fully homomorphic
								encryption, and blockchain technology to create a voting system
								that is both private and verifiable.
							</p>
							<div className='mt-8 space-y-4'>
								<div className='flex items-start gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
										<span className='font-bold'>1</span>
									</div>
									<div>
										<h3 className='font-bold text-white'>
											Identity Verification
										</h3>
										<p className='text-slate-400'>
											Your identity is verified without revealing personal
											information.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
										<span className='font-bold'>2</span>
									</div>
									<div>
										<h3 className='font-bold text-white'>
											Encrypted Vote Casting
										</h3>
										<p className='text-slate-400'>
											Your vote is encrypted before it leaves your device.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
										<span className='font-bold'>3</span>
									</div>
									<div>
										<h3 className='font-bold text-white'>
											Blockchain Recording
										</h3>
										<p className='text-slate-400'>
											Your encrypted vote is recorded on the blockchain for
											immutability.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
										<span className='font-bold'>4</span>
									</div>
									<div>
										<h3 className='font-bold text-white'>
											Homomorphic Tallying
										</h3>
										<p className='text-slate-400'>
											Votes are counted while remaining encrypted.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400'>
										<span className='font-bold'>5</span>
									</div>
									<div>
										<h3 className='font-bold text-white'>
											Result Verification
										</h3>
										<p className='text-slate-400'>
											Anyone can verify the results without seeing individual
											votes.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className='rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur'>
							<Image
								src='/placeholder.svg?height=400&width=400'
								alt='Confidential Voting Process'
								width={400}
								height={400}
								className='mx-auto rounded-lg'
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Detailed Steps */}
			<section className='py-12'>
				<div className='mx-auto max-w-5xl'>
					<h2 className='text-center text-3xl font-bold tracking-tight'>
						Detailed Walkthrough
					</h2>
					<p className='mt-4 text-center text-slate-400'>
						Let's explore each step of the confidential voting process in detail
					</p>

					<div className='mt-12 space-y-16'>
						{/* Step 1 */}
						<div className='grid gap-8 md:grid-cols-2 md:items-center'>
							<div className='order-2 md:order-1'>
								<h3 className='text-2xl font-bold text-white'>
									1. Identity Verification
								</h3>
								<p className='mt-4 text-slate-400'>
									Before voting, you need to verify your identity and
									eligibility. This is done using secure cryptographic
									techniques that allow you to prove you're eligible to vote
									without revealing your personal information, preventing voter
									fraud while maintaining privacy.
								</p>
								<ul className='mt-4 space-y-2 text-slate-400'>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Connect your wallet to establish a secure connection
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Verify your eligibility without revealing personal data
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Receive a unique, anonymous voting credential</span>
									</li>
								</ul>
							</div>
							<div className='order-1 md:order-2 flex justify-center'>
								<div className='flex h-48 w-48 items-center justify-center rounded-full bg-purple-500/10 text-purple-400'>
									<Wallet className='h-24 w-24' />
								</div>
							</div>
						</div>

						{/* Step 2 */}
						<div className='grid gap-8 md:grid-cols-2 md:items-center'>
							<div className='flex justify-center'>
								<div className='flex h-48 w-48 items-center justify-center rounded-full bg-blue-500/10 text-blue-400'>
									<EyeOff className='h-24 w-24' />
								</div>
							</div>
							<div>
								<h3 className='text-2xl font-bold text-white'>
									2. Encrypted Vote Casting
								</h3>
								<p className='mt-4 text-slate-400'>
									When you cast your vote, it's immediately encrypted on your
									device before being sent to the blockchain. This ensures that
									no one, not even the system administrators, can see your vote.
								</p>
								<ul className='mt-4 space-y-2 text-slate-400'>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Your vote is encrypted with a public key</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Only the decryption key holders can reveal the final tally
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											You receive a receipt that proves your vote was counted
										</span>
									</li>
								</ul>
							</div>
						</div>

						{/* Step 3 */}
						<div className='grid gap-8 md:grid-cols-2 md:items-center'>
							<div className='order-2 md:order-1'>
								<h3 className='text-2xl font-bold text-white'>
									3. Blockchain Recording
								</h3>
								<p className='mt-4 text-slate-400'>
									Your encrypted vote is recorded on a blockchain, creating an
									immutable record that cannot be altered or deleted. This
									ensures the integrity of the voting process.
								</p>
								<ul className='mt-4 space-y-2 text-slate-400'>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Votes are stored in a tamper-proof blockchain</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Each vote has a unique identifier for verification
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>The blockchain is publicly auditable by anyone</span>
									</li>
								</ul>
							</div>
							<div className='order-1 md:order-2 flex justify-center'>
								<div className='flex h-48 w-48 items-center justify-center rounded-full bg-purple-500/10 text-purple-400'>
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
										className='h-24 w-24'
									>
										<rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
										<line x1='3' x2='21' y1='9' y2='9' />
										<line x1='3' x2='21' y1='15' y2='15' />
										<line x1='9' x2='9' y1='3' y2='21' />
										<line x1='15' x2='15' y1='3' y2='21' />
									</svg>
								</div>
							</div>
						</div>

						{/* Step 4 */}
						<div className='grid gap-8 md:grid-cols-2 md:items-center'>
							<div className='flex justify-center'>
								<div className='flex h-48 w-48 items-center justify-center rounded-full bg-blue-500/10 text-blue-400'>
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
										className='h-24 w-24'
									>
										<path d='M3 3v18h18' />
										<path d='m19 9-5 5-4-4-3 3' />
									</svg>
								</div>
							</div>
							<div>
								<h3 className='text-2xl font-bold text-white'>
									4. Fully Homomorphic Encryption (FHE) Tallying
								</h3>
								<p className='mt-4 text-slate-400'>
									Using fully homomorphic encryption, votes can be counted while
									remaining encrypted. This revolutionary technology allows
									mathematical operations on encrypted data, meaning the final
									tally can be calculated without ever decrypting individual
									votes, eliminating opportunities for corruption or
									manipulation.
								</p>
								<ul className='mt-4 space-y-2 text-slate-400'>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Votes are tallied mathematically while still encrypted
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Individual votes remain private throughout the process
										</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>
											Only the final result is decrypted, not individual votes
										</span>
									</li>
								</ul>
							</div>
						</div>

						{/* Step 5 */}
						<div className='grid gap-8 md:grid-cols-2 md:items-center'>
							<div className='order-2 md:order-1'>
								<h3 className='text-2xl font-bold text-white'>
									5. Result Verification
								</h3>
								<p className='mt-4 text-slate-400'>
									Once voting ends, the results are published along with
									cryptographic proofs that allow anyone to verify the accuracy
									of the count without seeing individual votes.
								</p>
								<ul className='mt-4 space-y-2 text-slate-400'>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Results are published with cryptographic proofs</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Anyone can independently verify the tally</span>
									</li>
									<li className='flex items-start gap-2'>
										<Check className='mt-1 h-4 w-4 flex-shrink-0 text-green-500' />
										<span>Individual votes remain confidential forever</span>
									</li>
								</ul>
							</div>
							<div className='order-1 md:order-2 flex justify-center'>
								<div className='flex h-48 w-48 items-center justify-center rounded-full bg-purple-500/10 text-purple-400'>
									<FileCheck className='h-24 w-24' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-12'>
				<div className='mx-auto max-w-3xl rounded-lg border border-slate-800 bg-slate-900/50 p-8 shadow-lg backdrop-blur'>
					<div className='text-center'>
						<h2 className='text-2xl font-bold text-white'>
							Ready to experience confidential voting?
						</h2>
						<p className='mt-4 text-slate-400'>
							Try our demo to see how secure and private voting works in
							practice.
						</p>
						<div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
							<Link href='/demo'>
								<Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'>
									Try Demo
									<ArrowRight className='ml-2 h-4 w-4' />
								</Button>
							</Link>
							<Link href='/features'>
								<Button
									variant='outline'
									className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
								>
									Explore Features
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
