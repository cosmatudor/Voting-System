'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
	ArrowLeft,
	Check,
	Clock,
	ExternalLink,
	Info,
	Lock,
	Shield,
	Wallet,
	ChevronDown,
	Users,
	BarChart3,
	FileText,
	Calendar,
	User,
	AlertTriangle,
	AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useGetCampaignDetails } from '@/hooks/queries/useGetCampaignDetails';
import { useSimpleVoteTx } from '@/hooks/transactions/useSimpleVoteTx';
import { sendTransactions } from "@multiversx/sdk-dapp/services/transactions/sendTransactions";
import { useGetIsLoggedIn, useGetAccount, useGetPendingTransactions, useTrackTransactionStatus, useGetSignedTransactions } from '@multiversx/sdk-dapp/hooks';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetTalliedVotes } from '@/hooks/queries/useGetTalliedVotes';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useCloseCampaignTx } from '@/hooks/transactions/useCloseCampaignTx';
import { Address, DevnetEntrypoint, Transaction } from '@multiversx/sdk-core/out';

export default function CampaignDetailsPage() {
	const params = useParams();
	const campaignId = Number(params.id);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isVoting, setIsVoting] = useState(false);
	const [voteError, setVoteError] = useState<string | null>(null);
	const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
	const [showTallyWarning, setShowTallyWarning] = useState(false);
	const [isTallying, setIsTallying] = useState(false);
	const [voteResults, setVoteResults] = useState<number[]>([]);
	const [voteSessionId, setVoteSessionId] = useState<string | null>(null);

	const isLoggedIn = useGetIsLoggedIn();
	const { address } = useGetAccount();
	const { campaign, isLoading, error, refetch } = useGetCampaignDetails(campaignId);
	const { signedTransactions } = useGetSignedTransactions();
	const { getSimpleVoteTx } = useSimpleVoteTx();
	const { getTalliedVotes, tallyResults } = useGetTalliedVotes();
	const { getCloseCampaignTx } = useCloseCampaignTx();

	useEffect(() => {
		if (!voteSessionId) return;

		const txInfo = signedTransactions?.[voteSessionId];

		if (txInfo?.status === "signed") {
			const voteTx = txInfo.transactions?.[0];
			console.log("Tranzacție semnată:", voteTx);
		}

	}, [signedTransactions, voteSessionId]);

	// Get vote transaction status
	const voteTxStatus = useTrackTransactionStatus({
		transactionId: voteSessionId,
		onSuccess: () => {
			refetch();
			setIsVoting(false);
			setVoteError(null);
		},
		onFail: (errorMessage) => { // TODO: decode error code
			setVoteError(errorMessage || 'Failed to submit vote. Please try again.');
			setIsVoting(false);
		},
		onCancelled: () => {
			setVoteError('Vote transaction was cancelled.');
			setIsVoting(false);
		}
	});

	// Refresh data when the page mounts
	useEffect(() => {
		refetch();
	}, [refetch]);

	// Check if user is eligible to vote
	const isEligible = () => {
		if (!address || !campaign) return false;
		if (!campaign.eligible_voters) return false;
		return campaign.eligible_voters.includes(address);
	};

	// Check if user is campaign creator
	const isCreator = () => {
		if (!address || !campaign) return false;
		return address === campaign.creator.address;
	};

	// Handle vote submission
	const handleVote = async () => {
		if (!isLoggedIn) {
			setVoteError('Please connect your wallet first');
			return;
		}
		if (!selectedOption) {
			setVoteError('Please select an option to vote');
			return;
		}
		if (campaign?.status !== 'active') {
			setVoteError('This campaign is not active for voting');
			return;
		}
		if (!isEligible()) {
			setVoteError('Your wallet is not eligible to vote in this campaign');
			return;
		}

		setIsVoting(true);
		setVoteError(null);

		try {
			let voteTx;
			if (campaign.is_sponsored) {
				const token = "ZXJkMXMyajhqaGZhYTMzc21lemQwZHd2cGVxbWVkbjR4NzM1aDByZTI0NXM2cjN4anhhNms5YXNmMzlkNHc.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuNjAzYzE5NzBkMDRkZmVjNDEyZTJlN2FlNzI1NzljNmFkODNmNWQxNWQyYzYzYmJjOTRlNmQ0NTcxMzk2N2MxMi43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTkRrNE16ZzJPREI5.87393ea4e3cf9dbc0983f7e62c9fe6bf2c2a4bfc2d5fe11f9478a88825b4a671cd6130ff43afedb0711658b1ec6ca57a9d6922e0a352f4d609f134f9b3976504"
				const response = await fetch('http://localhost:3001/relayer-vote-transaction', {
					method: 'POST',
					headers: { 
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json' 
					},
					body: JSON.stringify({
						ownerAddress: campaign.creator.address,
						campaignId: campaignId,
						option: parseInt(selectedOption) - 1,
					}),
				});
				if (!response.ok) throw new Error('Failed to get relayer vote transaction');
				const { transaction } = await response.json();
				voteTx = transaction;
				console.log('sponsored')
			} else {
				const optionIndex = parseInt(selectedOption) - 1;
				voteTx = await getSimpleVoteTx(campaignId, optionIndex);
				console.log('not sponsored')
			}

			console.log('CE AM PRIMIT:', voteTx);

			const { sessionId: newSessionId } = await sendTransactions({
				transactions: [voteTx],
				transactionsDisplayInfo: {
					processingMessage: 'Submitting vote...',
					errorMessage: 'Failed to submit vote',
					successMessage: 'Vote submitted successfully!',
				},
				// signWithoutSending: true,
			});

			setVoteSessionId(newSessionId);
		} catch (error) {
			console.error('Error submitting vote:', error);
			setVoteError(error instanceof Error ? error.message : 'Failed to submit vote');
			setIsVoting(false);
		}
	};
	// Handle tally votes
	const handleTallyVotes = async () => {
		if (!isCreator()) return;

		setIsTallying(true);
		try {
			// First close the campaign
			const tx = await getCloseCampaignTx(Number(campaignId));
			await sendTransactions({
				transactions: [tx],
				transactionsDisplayInfo: {
					processingMessage: 'Closing campaign...',
					errorMessage: 'Error closing campaign',
					successMessage: 'Campaign closed successfully',
				},
			});

			// Wait for transaction confirmation
			await refreshAccount();
			
			// Then get the tallied votes
			await getTalliedVotes(BigInt(campaignId));
			
			await refetch();
		} catch (error) {
			console.error('Error tallying votes:', error);
			setVoteError(error instanceof Error ? error.message : 'Failed to tally votes');
		} finally {
			setIsTallying(false);
			setShowTallyWarning(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-white">Loading campaign details...</div>
			</div>
		);
	}

	if (error || !campaign) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-white">Campaign Not Found</h1>
					<p className="mt-2 text-slate-400">
						{error || 'The campaign you\'re looking for doesn\'t exist or has been removed.'}
					</p>
					<Link href="/campaigns">
						<Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Campaigns
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Back to Campaigns */}
			<div className="mb-6">
				<Link
					href="/campaigns"
					className="inline-flex items-center text-sm text-slate-400 hover:text-white"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Campaigns
				</Link>
			</div>

			{/* Campaign Header */}
			<div className="mb-8">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-2xl font-bold sm:text-3xl text-white">
						{campaign.title}
					</h1>
					<Badge
						className={
							campaign.is_tallied
								? 'bg-purple-500/20 text-purple-400'
								: campaign.status === 'active'
								? 'bg-green-500/20 text-green-400'
								: campaign.status === 'upcoming'
								? 'bg-blue-500/20 text-blue-400'
								: 'bg-slate-500/20 text-slate-400'
						}
					>
						{campaign.is_tallied
							? 'Tallied'
							: campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
					</Badge>
				</div>

				<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-slate-400">{campaign.description}</p>
					{campaign.status === 'active' && (
						<div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
							<Clock className="h-4 w-4 text-purple-400" />
							<span>Ends in {campaign.endTime}</span>
						</div>
					)}
					{campaign.status === 'upcoming' && (
						<div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
							<Clock className="h-4 w-4 text-blue-400" />
							<span>Starts in {campaign.startTime}</span>
						</div>
					)}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content - Voting Card */}
				<div className="lg:col-span-2">
					<Card className="overflow-hidden border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur">
						<CardHeader className="border-b border-slate-800 bg-slate-900/80 pb-4">
							<CardTitle className="text-xl text-white">
								{campaign.is_tallied ? 'Final Results' : 'Cast Your Vote'}
							</CardTitle>
							{campaign.is_confidential && (
							<CardDescription className="flex items-center gap-1.5 text-slate-400">
								<Lock className="h-4 w-4 text-purple-400" />
								Your vote is encrypted and confidential
							</CardDescription>
							)}
						</CardHeader>
						<CardContent className="p-6">
							{campaign.status === 'upcoming' ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
										<Clock className="h-8 w-8 text-blue-400" />
									</div>
									<h3 className="text-xl font-bold text-white">Voting Not Yet Open</h3>
									<p className="mt-2 text-slate-400">
										This vote will open for participation in {campaign.startTime}.
									</p>
									<div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
										<Info className="h-4 w-4" />
										<span>You can review the proposal details below</span>
									</div>
								</div>
							) : campaign.is_tallied ? (
								<div className="space-y-4">
									{campaign.options.map((option, index) => (
										<div
											key={option.id}
											className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 p-4"
										>
											<div className="flex-1">
												<Label className="text-lg font-medium text-white">
													{option.label}
												</Label>
												<div className="mt-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-slate-400">Votes</span>
														<span className="font-medium text-white">
															{campaign.results?.[index] || 0}
														</span>
													</div>
													<div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
														<div
															className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
															style={{
																width: `${((campaign.results?.[index] || 0) / (campaign.totalVotes || 1)) * 100}%`,
															}}
														></div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<RadioGroup
									value={selectedOption || ''}
									onValueChange={setSelectedOption}
									className="space-y-4"
								>
									{campaign.options.map((option) => (
										<div
											key={option.id}
											className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all duration-200 ${
												selectedOption === option.id
													? 'border-purple-500/50 bg-purple-500/10'
													: 'border-slate-800 bg-slate-800/50 hover:border-purple-500/30 hover:bg-slate-800'
											} ${!isEligible() ? 'opacity-60 cursor-not-allowed' : ''}`}
											onClick={() => isEligible() && setSelectedOption(option.id)}
										>
											<RadioGroupItem
												value={option.id}
												id={option.id}
												className="border-slate-600 text-purple-500"
												disabled={!isEligible()}
											/>
											<div className="flex-1">
												<Label
													htmlFor={option.id}
													className={`text-lg font-medium cursor-pointer text-white ${
														!isEligible() ? 'cursor-not-allowed' : ''
													}`}
												>
													{option.label}
												</Label>
												{/* Only show votes and progress bar if not confidential */}
												{!campaign.is_confidential && campaign.results && (
													<div className="mt-2">
														<div className="flex items-center justify-between text-sm">
															<span className="text-slate-400">Votes</span>
															<span className="font-medium text-white">
																{campaign.results[parseInt(option.id) - 1] || 0}
															</span>
														</div>
														<div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
															<div
																className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
																style={{
																	width: `${((campaign.results[parseInt(option.id) - 1] || 0) / campaign.totalVotes) * 100}%`,
																}}
															></div>
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</RadioGroup>
							)}
						</CardContent>

						<CardFooter className="border-t border-slate-800 bg-slate-900/80 p-4">
							{campaign.status === 'upcoming' ? (
								<Button
									variant="outline"
									className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
									disabled
								>
									Voting Not Yet Open
								</Button>
							) : campaign.is_tallied ? (
								<div className="flex flex-col items-center justify-center w-full py-4 text-center">
									<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 mx-auto">
										<Check className="h-6 w-6 text-green-400" />
									</div>
									<h3 className="text-base font-bold text-white">Voting Period Ended</h3>
									<p className="mt-1 text-sm text-slate-400">
										The voting period has ended and results have been tallied.
									</p>
								</div>
							) : isCreator() ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="w-full">
												<Button
													className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
													disabled={isTallying}
													onClick={() => setShowTallyWarning(true)}
												>
													{isTallying ? (
														<>Tallying Votes...</>
													) : (
														<>Tally Votes</>
													)}
												</Button>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											End voting period and tally results
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : isEligible() ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="w-full">
												<Button
													className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
													disabled={!selectedOption || isVoting || voteTxStatus.isPending}
													onClick={handleVote}
												>
													{isVoting || voteTxStatus.isPending ? 'Submitting Vote...' : 'Submit Vote'}
												</Button>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											{selectedOption
												? 'Submit your vote'
												: 'Select an option to vote'}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<div className="flex flex-col items-center justify-center w-full py-4 text-center">
									<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 mx-auto">
										<AlertTriangle className="h-6 w-6 text-yellow-400" />
									</div>
									<h3 className="text-base font-bold text-white">Not Eligible to Vote</h3>
									<p className="mt-1 text-sm text-slate-400">
										Your wallet address is not on the eligibility list for this vote. Only wallets that have been added to the eligibility list by the campaign creator can participate.
									</p>
								</div>
							)}
						</CardFooter>
					</Card>

					{/* Eligibility List */}
					<div className="mt-4">
						<Collapsible
							open={isEligibilityOpen}
							onOpenChange={setIsEligibilityOpen}
							className="rounded-lg border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur"
						>
							<CollapsibleTrigger asChild>
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-800/50"
								>
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4 text-purple-400" />
										<span className="font-medium text-white">Eligibility List</span>
										<Badge className="ml-2 bg-slate-800 text-slate-400">
											{campaign.eligible_voters.length} wallets
										</Badge>
									</div>
									<ChevronDown
										className={`h-4 w-4 transition-transform duration-200 ${
											isEligibilityOpen ? 'rotate-180' : ''
										}`}
									/>
								</Button>
							</CollapsibleTrigger>

							<CollapsibleContent className="px-4 pb-4">
								<div className="text-sm text-slate-400 mb-3">
									Only wallets on this list are eligible to participate in this vote.
								</div>

								{campaign.eligible_voters.length > 0 ? (
									<div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
										<div className="space-y-2 max-h-[200px] overflow-y-auto">
											{campaign.eligible_voters.map((wallet, index) => (
												<div
													key={index}
													className="flex items-center justify-between bg-slate-800 rounded-md p-2"
												>
													<span className="text-sm text-slate-300 font-mono truncate">
														{wallet}
													</span>
													{address === wallet && (
														<Badge className="bg-green-500/20 text-green-400">
															<Check className="h-3 w-3 mr-1" />
															Your Wallet
														</Badge>
													)}
												</div>
											))}
										</div>
									</div>
								) : (
									<div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-4 text-center">
										<p className="text-sm text-slate-400">
											No eligible wallets found for this vote
										</p>
									</div>
								)}
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>

				{/* Sidebar */}
				<div>
					{/* Vote Information */}
					<Card className="border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur">
						<CardHeader>
							<CardTitle className="text-lg text-white">Vote Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<Shield className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">
										{campaign.is_confidential ? 'Confidential Voting' : 'Public Voting'}
									</h3>
									<p className="text-sm text-slate-400">
										{campaign.is_confidential
											? 'Your vote is encrypted and private'
											: 'Votes are updating live and visible to everyone'}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<Wallet className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">Transaction Type</h3>
									<p className="text-sm text-slate-400">
										{campaign.is_sponsored 
											? 'Sponsored by campaign creator'
											: 'Standard transaction'}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<Users className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">Participation</h3>
									<p className="text-sm text-slate-400">
										{campaign.participation}% of eligible voters
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<User className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">Created By</h3>
									<p className="text-sm text-slate-400">
										{campaign.creator.address.slice(0, 14)}...{campaign.creator.address.slice(-10)}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<Wallet className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">Eligibility</h3>
									<p className="text-sm text-slate-400">
										{isEligible() ? 'Your wallet is eligible to vote' : 'Your wallet is not eligible'}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
									<BarChart3 className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium text-white">Total Votes</h3>
									<p className="text-sm text-slate-400">{campaign.totalVotes} votes cast</p>
								</div>
							</div>

							<Separator className="bg-slate-800" />

							<div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
								<h3 className="font-medium text-white">How voting works</h3>
								<p className="mt-2 text-sm text-slate-400">
									Votes are processed on-chain, ensuring transparency and verifiability of results.
								</p>
								<Link href="/how-it-works">
									<Button
										variant="link"
										className="mt-2 h-auto p-0 text-purple-400 hover:text-purple-300"
									>
										Learn more about our voting system
										<ExternalLink className="ml-1 h-3 w-3" />
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Error Messages */}
			{voteError && (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{voteError}</AlertDescription>
				</Alert>
			)}

			{/* Tally Warning Dialog */}
			<Dialog open={showTallyWarning} onOpenChange={setShowTallyWarning}>
				<DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800">
					<DialogHeader>
						<DialogTitle className="text-white">Tally Votes</DialogTitle>
						<DialogDescription className="text-slate-400">
							Are you sure you want to end the voting period and tally the votes? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowTallyWarning(false)}
							className="border-slate-700 text-slate-300 hover:bg-slate-800"
						>
							Cancel
						</Button>
						<Button
							onClick={handleTallyVotes}
							className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
						>
							Confirm Tally
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
