import Link from 'next/link';
import { Lock, Shield, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50'>
			<main className='container mx-auto px-4 py-8 md:px-6'>
				{/* Hero Section */}
				<section className='py-12 md:py-16'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
							Frequently{' '}
							<span className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent'>
								Asked Questions
							</span>
						</h1>
						<p className='mt-6 text-xl text-slate-400'>
							Find answers to common questions about our confidential voting
							platform designed to combat corruption in elections and create
							truly fair voting systems through fully homomorphic encryption.
						</p>
					</div>
				</section>

				{/* FAQ Categories */}
				<section className='py-12'>
					<div className='mx-auto max-w-3xl'>
						<div className='mb-12 grid gap-6 md:grid-cols-3'>
							<div className='rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur'>
								<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
									<Shield className='h-6 w-6' />
								</div>
								<h2 className='mt-4 text-xl font-bold text-white'>
									Security & Privacy
								</h2>
								<p className='mt-2 text-sm text-slate-400'>
									Questions about how we protect your vote and identity
								</p>
							</div>
							<div className='rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur'>
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
								<h2 className='mt-4 text-xl font-bold text-white'>
									Using the Platform
								</h2>
								<p className='mt-2 text-sm text-slate-400'>
									Help with using the voting interface and features
								</p>
							</div>
							<div className='rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur'>
								<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400'>
									<Wallet className='h-6 w-6' />
								</div>
								<h2 className='mt-4 text-xl font-bold text-white'>
									Technical Details
								</h2>
								<p className='mt-2 text-sm text-slate-400'>
									Information about the technology behind ENVOTE
								</p>
							</div>
						</div>

						<Accordion type='single' collapsible className='w-full'>
							<AccordionItem value='item-1' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									How does ENVOTE ensure my vote remains private?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									ENVOTE uses end-to-end encryption to protect your vote from
									the moment you cast it. Your vote is encrypted on your device
									before being transmitted, and it remains encrypted throughout
									the entire process. We use fully homomorphic encryption (FHE)
									to tally votes while they remain encrypted. This revolutionary
									technology allows mathematical operations on encrypted data
									without ever decrypting it. This means that no one, not even
									the system administrators, can see your individual vote,
									eliminating opportunities for corruption or manipulation in
									electoral processes.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-2' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									Can I verify that my vote was counted correctly?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									Yes, ENVOTE provides a cryptographic receipt after you vote.
									This receipt allows you to verify that your vote was included
									in the final tally without revealing what your vote was. You
									can use our verification tool to check that your vote was
									recorded correctly on the blockchain and included in the final
									count.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-3' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									What happens if there's a technical issue while I'm voting?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									ENVOTE is designed to be resilient to technical issues. If
									your connection is interrupted while voting, your vote will
									not be recorded, and you can try again when your connection is
									restored. The system will never record a partial or corrupted
									vote. Additionally, you'll receive a confirmation message
									after your vote is successfully recorded, so you'll know if
									the process completed successfully.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-4' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									How does the blockchain ensure votes can't be tampered with?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									Blockchain technology creates an immutable, distributed ledger
									that records all votes. Once a vote is added to the
									blockchain, it cannot be altered or deleted without consensus
									from the network. Each vote is linked cryptographically to
									previous votes, creating a chain that would be computationally
									impossible to modify. Additionally, the distributed nature of
									the blockchain means there's no single point of failure or
									vulnerability that could be exploited to tamper with votes.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-5' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									What wallets are supported for authentication?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									ENVOTE supports a wide range of popular blockchain wallets for
									authentication, including MetaMask, WalletConnect, Coinbase
									Wallet, and other Ethereum-compatible wallets. We're
									constantly adding support for additional wallets to make the
									platform accessible to more users. The wallet is only used for
									authentication and doesn't require any cryptocurrency
									transactions to vote.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-6' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									How are voting results calculated and when are they revealed?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									Voting results are calculated using homomorphic encryption,
									which allows mathematical operations to be performed on
									encrypted data without decrypting it first. This means we can
									tally the votes while they remain encrypted. Results are only
									revealed after the voting period ends, and this requires a
									threshold of authorized parties to cooperate in decrypting the
									final tally. The exact timing of result revelation is
									specified in each voting event's details.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-7' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									Can I change my vote after submitting it?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									By default, votes cannot be changed after submission to
									maintain the integrity of the voting process. However,
									specific voting events may be configured to allow vote changes
									within a certain timeframe. If vote changing is enabled for a
									particular poll, this will be clearly indicated in the voting
									interface, along with the deadline for making changes.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-8' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									What happens if I lose my verification receipt?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									If you lose your verification receipt, you won't be able to
									independently verify that your specific vote was counted.
									However, this doesn't affect the inclusion of your vote in the
									final tally. We recommend saving your receipt in a secure
									location or taking a screenshot when it's provided. In future
									versions, we plan to implement a feature that allows users to
									retrieve their receipts using their wallet authentication.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-9' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									Is ENVOTE open source?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									Yes, ENVOTE is committed to transparency and security through
									open-source development. Our core cryptographic protocols and
									voting mechanisms are open source and available for public
									review on GitHub. This allows security researchers and the
									community to verify our implementation and suggest
									improvements. We believe that security through obscurity is
									not a reliable approach, and that open-source development
									leads to more secure and trustworthy systems.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='item-10' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									How can I create my own voting event?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									Creating your own voting event will be available in future
									releases of ENVOTE. The feature will allow organizations and
									communities to create customized voting events with
									configurable parameters such as voting period, eligibility
									requirements, and question formats. If you're interested in
									creating a voting event for your organization, please contact
									us through the website to discuss your needs and get early
									access to this feature when it becomes available.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='item-11' className='border-slate-800'>
								<AccordionTrigger className='text-white hover:text-purple-400'>
									How does ENVOTE help combat corruption in elections?
								</AccordionTrigger>
								<AccordionContent className='text-slate-400'>
									ENVOTE's fully homomorphic encryption (FHE) technology
									prevents corruption in elections by ensuring that votes cannot
									be manipulated or tampered with at any stage of the process.
									Since individual votes are never decrypted, there's no
									opportunity for officials to alter or discard specific
									ballots. The system provides cryptographic proofs that verify
									the integrity of the entire election without revealing
									individual votes. This creates a truly fair voting system
									where results accurately reflect the will of the voters,
									regardless of political pressures or attempts at manipulation.
									The immutable blockchain record further ensures that no votes
									can be added, removed, or altered after submission.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</section>

				{/* Contact Section */}
				<section className='py-12'>
					<div className='mx-auto max-w-3xl rounded-lg border border-slate-800 bg-slate-900/50 p-8 shadow-lg backdrop-blur'>
						<div className='text-center'>
							<h2 className='text-2xl font-bold text-white'>
								Still have questions?
							</h2>
							<p className='mt-4 text-slate-400'>
								If you couldn't find the answer to your question, feel free to
								contact our support team.
							</p>
							<div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
								<Link href='/demo'>
									<Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'>
										Try Demo
									</Button>
								</Link>
								<Button
									variant='outline'
									className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
								>
									Contact Support
								</Button>
								<Button
									variant='outline'
									className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
								>
									View Documentation
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
