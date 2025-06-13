'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Save, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Default entity data
const defaultEntityData = {
	name: 'Governance DAO',
	description:
		'A decentralized autonomous organization focused on improving governance systems through blockchain technology.',
	website: 'https://governance-dao.example',
	twitter: '@GovernanceDAO',
	type: 'DAO',
	createdAt: 'January 15, 2023',
	votesCreated: 12,
	votesParticipated: 47,
};

export default function ProfilePage() {
	const [entityData, setEntityData] = useState(defaultEntityData);

	// Load entity data from local storage on component mount
	useEffect(() => {
		const savedEntityData = localStorage.getItem('entityData');
		if (savedEntityData) {
			try {
				setEntityData(JSON.parse(savedEntityData));
			} catch (error) {
				console.error('Failed to parse entity data from localStorage:', error);
			}
		}
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEntityData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		// Save to local storage
		localStorage.setItem('entityData', JSON.stringify(entityData));
		alert('Profile updated successfully!');
	};

	return (
		<div className='max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold text-white mb-6'>Entity Profile</h1>

			<Tabs defaultValue='profile' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 bg-slate-800/50 mb-6'>
					<TabsTrigger
						value='profile'
						className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
					>
						Profile
					</TabsTrigger>
					<TabsTrigger
						value='activity'
						className='data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400'
					>
						Activity
					</TabsTrigger>
				</TabsList>

				<TabsContent value='profile'>
					<div className='grid gap-6 md:grid-cols-3'>
						<div className='md:col-span-1'>
							<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
								<CardHeader className='pb-2'>
									<CardTitle className='text-lg text-white'>
										Entity Info
									</CardTitle>
								</CardHeader>
								<CardContent className='flex flex-col items-center text-center'>
									<Avatar className='h-24 w-24 border-2 border-slate-700 mb-4'>
										<AvatarFallback className='bg-purple-900/50 text-purple-300 text-2xl'>
											{entityData.name
												? entityData.name
														.split(' ')
														.map((word) => word[0])
														.join('')
												: ''}
										</AvatarFallback>
									</Avatar>
									<h3 className='text-xl font-bold text-white'>
										{entityData.name}
									</h3>
									<p className='text-sm text-slate-400 mt-1'>
										{entityData.type}
									</p>
									<div className='flex items-center gap-2 mt-2 text-sm text-slate-400'>
										<Building2 className='h-4 w-4 text-purple-400' />
										<span>Member since {entityData.createdAt}</span>
									</div>
								</CardContent>
							</Card>

							<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur mt-4'>
								<CardHeader className='pb-2'>
									<CardTitle className='text-lg text-white'>Stats</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-2'>
										<div className='flex justify-between'>
											<span className='text-slate-400'>Votes Created</span>
											<span className='font-medium text-white'>
												{entityData.votesCreated}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-slate-400'>Votes Participated</span>
											<span className='font-medium text-white'>
												{entityData.votesParticipated}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className='md:col-span-2'>
							<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
								<CardHeader>
									<CardTitle className='text-lg text-white'>
										Edit Profile
									</CardTitle>
									<CardDescription className='text-slate-400'>
										Update your entity information
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='name' className='text-white'>
											Entity Name
										</Label>
										<Input
											id='name'
											name='name'
											value={entityData.name}
											onChange={handleInputChange}
											className='bg-slate-800 border-slate-700 text-white'
										/>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='type' className='text-white'>
											Entity Type
										</Label>
										<Input
											id='type'
											name='type'
											value={entityData.type}
											onChange={handleInputChange}
											className='bg-slate-800 border-slate-700 text-white'
										/>
										<p className='text-xs text-slate-400'>
											E.g., DAO, Corporation, Non-profit, etc.
										</p>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='description' className='text-white'>
											Description
										</Label>
										<Textarea
											id='description'
											name='description'
											value={entityData.description}
											onChange={handleInputChange}
											className='bg-slate-800 border-slate-700 text-white min-h-[100px]'
										/>
									</div>

									<div className='grid gap-4 md:grid-cols-2'>
										<div className='space-y-2'>
											<Label htmlFor='website' className='text-white'>
												Website
											</Label>
											<Input
												id='website'
												name='website'
												value={entityData.website}
												onChange={handleInputChange}
												className='bg-slate-800 border-slate-700 text-white'
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='twitter' className='text-white'>
												Twitter
											</Label>
											<Input
												id='twitter'
												name='twitter'
												value={entityData.twitter}
												onChange={handleInputChange}
												className='bg-slate-800 border-slate-700 text-white'
											/>
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
										onClick={handleSave}
									>
										<Save className='mr-2 h-4 w-4' />
										Save Changes
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</TabsContent>

				<TabsContent value='activity'>
					<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
						<CardHeader>
							<CardTitle className='text-lg text-white'>
								Recent Activity
							</CardTitle>
							<CardDescription className='text-slate-400'>
								Your recent votes and proposals
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{/* Activity items */}
								<div className='rounded-lg border border-slate-800 p-4'>
									<div className='flex items-start gap-3'>
										<div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400'>
											<User className='h-4 w-4' />
										</div>
										<div>
											<h3 className='font-medium text-white'>
												Created a new vote
											</h3>
											<p className='text-sm text-slate-400'>
												Treasury Allocation Q2
											</p>
											<p className='text-xs text-slate-500 mt-1'>3 days ago</p>
										</div>
									</div>
								</div>

								<div className='rounded-lg border border-slate-800 p-4'>
									<div className='flex items-start gap-3'>
										<div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400'>
											<User className='h-4 w-4' />
										</div>
										<div>
											<h3 className='font-medium text-white'>
												Voted on proposal
											</h3>
											<p className='text-sm text-slate-400'>
												Protocol Upgrade Proposal
											</p>
											<p className='text-xs text-slate-500 mt-1'>1 week ago</p>
										</div>
									</div>
								</div>

								<div className='rounded-lg border border-slate-800 p-4'>
									<div className='flex items-start gap-3'>
										<div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400'>
											<User className='h-4 w-4' />
										</div>
										<div>
											<h3 className='font-medium text-white'>
												Created a new vote
											</h3>
											<p className='text-sm text-slate-400'>
												New Governance Structure
											</p>
											<p className='text-xs text-slate-500 mt-1'>2 weeks ago</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant='outline'
								className='w-full border-slate-700 text-slate-400 hover:bg-slate-800'
							>
								View All Activity
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
