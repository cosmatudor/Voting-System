'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Clock,
	Search,
	Shield,
	Wallet,
	User,
	Users,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetAllCampaigns, FormattedCampaign } from '@/hooks/queries/useGetAllCampaigns';

function matchesStatusFilter(campaign: FormattedCampaign, selectedStatus: string): boolean {
	if (selectedStatus === 'all') return true;
	if (selectedStatus === 'closed') return campaign.status === 'closed' || campaign.is_tallied;
	return campaign.status === selectedStatus && !campaign.is_tallied;
}

function filterCampaigns(campaigns: FormattedCampaign[], searchQuery: string, selectedStatus: string): FormattedCampaign[] {
	return campaigns.filter((campaign) => {
		const matchesSearch =
			campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch && matchesStatusFilter(campaign, selectedStatus);
	});
}

function checkEligible(campaign: FormattedCampaign, address: string): boolean {
	if (!address || !campaign.eligible_voters) return false;
	return campaign.eligible_voters.includes(address);
}

function CampaignCard({ campaign, address }: { campaign: FormattedCampaign; address: string }) {
	return (
		<Link href={`/campaigns/${campaign.id}`} className='group block'>
			<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur hover:border-purple-500/50 transition-colors'>
				<CardHeader>
					<div className='flex items-start justify-between gap-4'>
					<div>
						<h3 className='text-lg font-semibold text-white group-hover:text-purple-400'>
								{campaign.title}
						</h3>
						<p className='mt-2 text-sm text-slate-400 line-clamp-2'>
								{campaign.description}
						</p>
					</div>
					<Badge
						variant='outline'
						className={`${
								campaign.is_tallied
									? 'bg-purple-500/20 text-purple-400 border-purple-500'
									: campaign.status === 'active'
										? 'bg-green-500/20 text-green-400 border-green-500'
										: campaign.status === 'upcoming'
											? 'bg-blue-500/20 text-blue-400 border-blue-500'
											: 'bg-slate-500/20 text-slate-400 border-slate-500'
						}`}
					>
							{campaign.is_tallied
								? 'Tallied'
								: campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
					</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex flex-wrap gap-4 text-sm'>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4 text-slate-500' />
							<span className='text-slate-400'>
								{(campaign.is_tallied || campaign.status === 'closed')
									? 'Ended'
									: campaign.status === 'active'
									? `Ends in ${campaign.endTime}`
									: campaign.status === 'upcoming'
									? `Starts in ${campaign.startTime}`
									: 'Ended'}
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<Users className='h-4 w-4 text-slate-500' />
							<span className='text-slate-400'>
								{`${campaign.participation}% participation`}
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<Shield className='h-4 w-4 text-slate-500' />
							<span className='text-slate-400'>
								{campaign.is_confidential ? 'Confidential' : 'Public'} vote
							</span>
						</div>
						{campaign.is_sponsored && (
							<div className='flex items-center gap-2'>
								<Wallet className='h-4 w-4 text-slate-500' />
								<span className='text-slate-400'>Sponsored</span>
							</div>
						)}
					</div>
					{campaign.status !== 'upcoming' && (
						<div className='mt-2'>
							<div className='flex items-center justify-between text-sm mb-1'>
								<span className='text-slate-400'>Participation</span>
								<span className='font-medium text-white'>{campaign.participation ?? 0}%</span>
							</div>
							<div className='h-1.5 w-full rounded-full bg-slate-800'>
								<div
									className={`h-full rounded-full ${
										campaign.status === 'closed'
											? campaign.result === 'Approved'
												? 'bg-gradient-to-r from-green-600 to-green-500'
												: 'bg-gradient-to-r from-red-600 to-red-500'
											: 'bg-gradient-to-r from-purple-600 to-blue-600'
									}`}
									style={{ width: `${campaign.participation}%` }}
								></div>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<div className='flex items-center gap-2 text-sm text-slate-400'>
					<User className='h-4 w-4' />
					{address && campaign.creator.address === address ? (
						<Badge variant='outline' className='bg-purple-500/20 text-purple-400 border-purple-500'>
							Created by you
						</Badge>
					) : (
						<>
							<span className='font-mono'>
								Created by {campaign.creator.address.slice(0, 6)}...{campaign.creator.address.slice(-4)}
							</span>
							{Array.isArray(campaign.eligible_voters) && address ? (
								<Badge
									variant='outline'
									className={
										checkEligible(campaign, address)
											? 'bg-purple-500/20 text-purple-400 border-purple-500 ml-2'
											: 'bg-slate-500/20 text-slate-400 border-slate-500 ml-2'
									}
								>
									{checkEligible(campaign, address) ? 'Eligible to vote' : 'Not eligible to vote'}
								</Badge>
							) : null}
						</>
					)}
				</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

export default function CampaignsPage() {
	const { campaigns, isLoading, error, refetchAllCampaigns } = useGetAllCampaigns();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const { address } = useGetAccountInfo();

	// Refresh data when the page mounts
	useEffect(() => {
		refetchAllCampaigns();
	}, []);

	const filteredCampaigns = filterCampaigns(campaigns, searchQuery, selectedStatus);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-white">Loading campaigns...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-500">Error loading campaigns: {error}</div>
			</div>
		);
	}

	return (
		<>
			{/* Page Header */}
			<div className='mb-8'>
				<h1 className='text-3xl font-bold tracking-tight md:text-4xl text-white'>
					Campaigns
				</h1>
				<p className='mt-2 text-slate-400'>
					Browse and participate in voting campaigns
				</p>

				{address && (
					<div className='mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg'>
						<div className='flex items-center gap-2'>
							<Wallet className='h-4 w-4 text-purple-400' />
							<p className='text-sm text-slate-300'>
								Connected with{' '}
								<span className='font-mono text-purple-400'>
									{address.slice(0, 6)}...{address.slice(-4)}
								</span>
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Search and Filter */}
			<div className='mb-8 space-y-4'>
				<div className='relative'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-500' />
					<Input
						type='search'
						placeholder='Search campaigns...'
						className='pl-8 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Tabs defaultValue='all' className='w-full' onValueChange={setSelectedStatus}>
					<TabsList className='grid w-full grid-cols-4 bg-slate-800/50'>
						<TabsTrigger
							value='all'
							className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
						>
							All
						</TabsTrigger>
						<TabsTrigger
							value='active'
							className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
						>
							Active
						</TabsTrigger>
						<TabsTrigger
							value='upcoming'
							className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
						>
							Upcoming
						</TabsTrigger>
						<TabsTrigger
							value='closed'
							className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
						>
							Closed
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Campaign Cards */}
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{filteredCampaigns.map((campaign) => (
					<CampaignCard key={campaign.id} campaign={campaign} address={address} />
				))}
			</div>
		</>
	);
}
