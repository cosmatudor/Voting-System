'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
	CalendarIcon,
	CheckCircle2,
	Info,
	Plus,
	Trash2,
	Vote,
	X,
	AlertCircle,
	Users,
	Lock,
	Wallet,
	Gift,
} from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateCampaignTx } from "@/hooks/transactions/useCreateCampaignTx";
import {sendTransactions} from "@multiversx/sdk-dapp/services/transactions/sendTransactions";
import { useRouter } from 'next/navigation';
import { buildMerkleTree } from '@/lib/utils/merkleTree';
import { useGetLoginInfo, useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Default form data
const defaultFormData = {
	question: '',
	description: '',
	startDate: null as Date | null,
	endDate: null as Date | null,
	options: [
		{ id: '1', label: 'Yes' },
		{ id: '2', label: 'No' },
		{ id: '3', label: 'Abstain' },
	],
	eligibleWallets: [] as string[],
	is_sponsored: false,
};

export default function CreateVotePage() {
	const [formData, setFormData] = useState(defaultFormData);
	const [step, setStep] = useState(1);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [newWallet, setNewWallet] = useState('');
	const [walletError, setWalletError] = useState('');
	const [csvError, setCsvError] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [creationError, setCreationError] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isFunding, setIsFunding] = useState(false);
	const [fundingConfirmed, setFundingConfirmed] = useState(false);
	const [showFundingInfo, setShowFundingInfo] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	// Get transaction functions
	const { getCreateCampaignTx } = useCreateCampaignTx();

	const transactionStatus = useTrackTransactionStatus({
		transactionId: sessionId,
		onSuccess: () => {
			if (fundingConfirmed) {
				setFormData(defaultFormData);
				localStorage.removeItem('draftVote');
				router.push('/campaigns');
			} else {
				setFundingConfirmed(true);
				setIsFunding(false);
				toast.success('Relayer funded successfully! You can now create your campaign.');
			}
		},
		onFail: (errorMessage) => {
			if (fundingConfirmed) {
				setCreationError(errorMessage || 'Transaction failed. Please try again.');
				setIsCreating(false);
			} else {
				setCreationError(errorMessage || 'Funding failed. Please try again.');
				setIsFunding(false);
			}
		},
		onCancelled: () => {
			if (fundingConfirmed) {
				setCreationError('Transaction was cancelled. Please try again.');
				setIsCreating(false);
			} else {
				setCreationError('Funding was cancelled. Please try again.');
				setIsFunding(false);
			}
		}
	});

	// Load any saved draft from local storage
	useEffect(() => {
		const savedVoteData = localStorage.getItem('draftVote');
		const wasFunding = localStorage.getItem('isFunding') === 'true';
		
		if (savedVoteData) {
			try {
				const parsedData = JSON.parse(savedVoteData);
				// Convert string dates back to Date objects
				if (parsedData.startDate)
					parsedData.startDate = new Date(parsedData.startDate);
				if (parsedData.endDate)
					parsedData.endDate = new Date(parsedData.endDate);
				setFormData(parsedData);
				
				// If we were in the funding process, restore that state
				if (wasFunding) {
					setIsFunding(true);
					localStorage.removeItem('isFunding');
				}
			} catch (error) {
				console.error('Failed to parse vote data from localStorage:', error);
			}
		}
	}, []);

	// Save draft to local storage whenever form data changes
	useEffect(() => {
		localStorage.setItem('draftVote', JSON.stringify(formData));
	}, [formData]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleStartDateChange = (date: Date | undefined) => {
		setFormData((prev) => ({ ...prev, startDate: date || null }));
	};

	const handleEndDateChange = (date: Date | undefined) => {
		setFormData((prev) => ({ ...prev, endDate: date || null }));
	};

	const handleOptionChange = (id: string, field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			options: prev.options.map((option) =>
				option.id === id ? { ...option, [field]: value } : option
			),
		}));
	};

	const addOption = () => {
		const newId = (formData.options.length + 1).toString();
		setFormData((prev) => ({
			...prev,
			options: [...prev.options, { id: newId, label: '' }],
		}));
	};

	const removeOption = (id: string) => {
		if (formData.options.length <= 2) {
			alert('You must have at least 2 options');
			return;
		}

		setFormData((prev) => ({
			...prev,
			options: prev.options.filter((option) => option.id !== id),
		}));
	};

	const handleNextStep = () => {
		setStep((prev) => prev + 1);
	};

	const handlePrevStep = () => {
		setStep((prev) => prev - 1);
	};

	const handleShowFundingInfo = (e: React.FormEvent) => {
		e.preventDefault();
		setShowFundingInfo(true);
	};

	const handleFundRelayer = async () => {
		setIsFunding(true);
		setShowFundingInfo(false);
		setCreationError(null);
		try {
			localStorage.setItem('draftVote', JSON.stringify(formData));
			localStorage.setItem('isFunding', 'true');

			const token = "ZXJkMXhnMHA5Z2djY2c2cjZhN2c5ajZ0Zmw3MDhwNmowNDRkd2c1c2RncmZzNXN3MjRzeGQ0c3E2amRtajI.YUhSMGNITTZMeTkxZEdsc2N5NXRkV3gwYVhabGNuTjRMbU52YlEuOTRhMDU4ZTExMjU2M2MwY2EzOTMxNjQ1ZDBiYjhjYTI0ZjMwOWRkNzE5NGMwN2M1YWQ1MWM1YzJhZjVjZjYxNi43MjAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTkRrNE9UUXlNekI5.f3cf40bf39911ec029a9a48f8c1d95ae5242059d5fc555a433b5da7e5bd7c4cb73c6f80ccd35627b474c1bb076f4cf541673f227ca28ab1ca0ec66415502840e"
			console.log("AICI",token);
			const response = await fetch('http://localhost:3001/login', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  Authorization: `Bearer ${token}`,
				},
			  });
			  
			  const data = await response.json();
			  console.log(data);
			
			const fundResponse = await fetch('http://localhost:3001/fund-relayer', {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!fundResponse.ok) throw new Error('Failed to get funding transaction');
			const { transaction: fundTxn } = await fundResponse.json();
			const { sessionId } = await sendTransactions({
				transactions: [fundTxn],
				transactionsDisplayInfo: {
					processingMessage: 'Funding relayer...',
					errorMessage: 'Failed to fund relayer',
					successMessage: 'Relayer funded successfully!',
				},
				redirectAfterSign: false,
			});
			setSessionId(sessionId);
		} catch (error) {
			setCreationError('Funding failed. Please try again.');
			setIsFunding(false);
		}
	};

	const handleCreateCampaign = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsCreating(true);
		setCreationError(null);
		try {
			if (
				!formData.question ||
				!formData.description ||
				!formData.startDate ||
				!formData.endDate ||
				formData.options.length < 2 ||
				!formData.options.every((option) => option.label)
			) {
				alert('Please fill in all required fields');
				setIsCreating(false);
				return;
			}
			const startTimestamp = Math.floor(formData.startDate.getTime() / 1000);
			const endTimestamp = Math.floor(formData.endDate.getTime() / 1000);
			const options = formData.options.map(option => option.label);
			if (formData.is_sponsored && !fundingConfirmed) {
				setCreationError('Please fund your relayer before creating the campaign.');
				setIsCreating(false);
				return;
			}
			const tx = await getCreateCampaignTx(
				formData.question,
				formData.description,
				startTimestamp,
				endTimestamp,
				formData.eligibleWallets,
				options,
				false,
				formData.is_sponsored
			);
			const { sessionId: newSessionId } = await sendTransactions({
				transactions: [tx],
				transactionsDisplayInfo: {
					processingMessage: 'Creating campaign...',
					errorMessage: 'Failed to create campaign',
					successMessage: 'Campaign created successfully!',
				},
				redirectAfterSign: false,
			});
			setSessionId(newSessionId);
		} catch (error) {
			setCreationError(
				error instanceof Error ? error.message : 'Failed to create vote'
			);
			setIsCreating(false);
		}
	};

	const addWallet = () => {
		if (!newWallet) {
			setWalletError('Please enter a wallet address');
			return;
		}

		// MultiversX address validation
		if (!/^erd1[a-zA-Z0-9]{58}$/.test(newWallet)) {
			setWalletError('Please enter a valid MultiversX address (erd1...)');
			return;
		}

		if (formData.eligibleWallets.includes(newWallet)) {
			setWalletError('This wallet is already in the list');
			return;
		}

		setFormData((prev) => ({
			...prev,
			eligibleWallets: [...prev.eligibleWallets, newWallet],
		}));

		setNewWallet('');
		setWalletError('');
	};

	const removeWallet = (wallet: string) => {
		setFormData((prev) => ({
			...prev,
			eligibleWallets: prev.eligibleWallets.filter((w) => w !== wallet),
		}));
	};

	const isStep1Valid =
		formData.question &&
		formData.description &&
		formData.startDate &&
		formData.endDate;
	const isStep2Valid =
		formData.options.every((option) => option.label) &&
		formData.options.length >= 2;

	const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		setCsvError('');

		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const content = event.target?.result as string;
				if (!content) {
					throw new Error('Failed to read file content');
				}
				const lines = content.split(/\r\n|\n/).filter((line) => line.trim());

				// Validate addresses
				const validAddresses: string[] = [];
				const invalidAddresses: string[] = [];

				lines.forEach((line) => {
					const address = line.trim();
					if (/^erd1[a-zA-Z0-9]{58}$/.test(address)) {
						if (
							!formData.eligibleWallets.includes(address) &&
							!validAddresses.includes(address)
						) {
							validAddresses.push(address);
						}
					} else {
						invalidAddresses.push(address);
					}
				});

				if (invalidAddresses.length > 0) {
					setCsvError(
						`Found ${invalidAddresses.length} invalid addresses. Please ensure all addresses are in the format erd1... (62 characters)`
					);
				}

				if (validAddresses.length > 0) {
					setFormData((prev) => ({
						...prev,
						eligibleWallets: [...prev.eligibleWallets, ...validAddresses],
					}));
				}

				setIsUploading(false);
				// Reset file input
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			} catch (error) {
				setCsvError(
					'Failed to parse CSV file. Please ensure it contains one MultiversX address per line.'
				);
				setIsUploading(false);
			}
		};

		reader.onerror = () => {
			setCsvError('Failed to read the file. Please try again.');
			setIsUploading(false);
		};

		reader.readAsText(file);
	};

	// Update the button text based on transaction status
	const getButtonText = () => {
		if (transactionStatus.isPending) return 'Creating Campaign...';
		if (isCreating) return 'Preparing Transaction...';
		return 'Create Campaign';
	};

	// Add this new function to get funding button text
	const getFundingButtonText = () => {
		if (transactionStatus.isPending) return 'Funding Relayer...';
		if (isFunding) return 'Preparing Funding Transaction...';
		return 'Fund Relayer';
	};

	return (
		<>
			<div className='container mx-auto py-8 px-4'>
				<h1 className='text-3xl font-bold text-white mb-6'>
					Create a New Campaign
				</h1>

				{!isSubmitted ? (
					<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<div>
									<CardTitle className='text-xl text-white'>
										New Campaign
									</CardTitle>
									<CardDescription className='text-slate-400'>
										Create a new voting campaign for your community
									</CardDescription>
								</div>
								<div className='flex items-center gap-2'>
									<span
										className={`w-3 h-3 rounded-full ${
											step >= 1 ? 'bg-purple-500' : 'bg-slate-700'
										}`}
									></span>
									<span
										className={`w-3 h-3 rounded-full ${
											step >= 2 ? 'bg-purple-500' : 'bg-slate-700'
										}`}
									></span>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{step === 1 && (
								<div className='space-y-6'>
									<div className='space-y-2'>
										<Label htmlFor='question' className='text-white'>
											Question
										</Label>
										<Input
											id='question'
											name='question'
											value={formData.question}
											onChange={handleInputChange}
											className='bg-slate-800 border-slate-700 text-white'
											placeholder='What is the question you want to ask?'
											required
										/>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='description' className='text-white'>
											Description
										</Label>
										<Textarea
											id='description'
											name='description'
											value={formData.description}
											onChange={handleInputChange}
											className='bg-slate-800 border-slate-700 text-white min-h-[100px]'
											placeholder='Provide a clear description of what this vote is about'
											required
										/>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label className='text-white'>Start Date</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={`w-full justify-start text-left font-normal ${
															!formData.startDate ? 'text-slate-400' : 'text-white'
														} bg-slate-800 border-slate-700 hover:bg-slate-700`}
													>
														<CalendarIcon className='mr-2 h-4 w-4' />
														{formData.startDate ? (
															format(formData.startDate, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0 bg-slate-900 border-slate-700'>
													<Calendar
														mode='single'
														selected={formData.startDate || undefined}
														onSelect={handleStartDateChange}
														initialFocus
														className='bg-slate-900'
													/>
												</PopoverContent>
											</Popover>
										</div>

										<div className='space-y-2'>
											<Label className='text-white'>End Date</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={`w-full justify-start text-left font-normal ${
															!formData.endDate ? 'text-slate-400' : 'text-white'
														} bg-slate-800 border-slate-700 hover:bg-slate-700`}
													>
														<CalendarIcon className='mr-2 h-4 w-4' />
														{formData.endDate ? (
															format(formData.endDate, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0 bg-slate-900 border-slate-700'>
													<Calendar
														mode='single'
														selected={formData.endDate || undefined}
														onSelect={handleEndDateChange}
														initialFocus
														className='bg-slate-900'
													/>
												</PopoverContent>
											</Popover>
										</div>
									</div>
								</div>
							)}

							{step === 2 && (
								<div className="space-y-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-medium text-white">Voting Options</h3>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addOption}
												className="border-slate-700 text-slate-300 hover:bg-slate-800"
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Option
											</Button>
										</div>

										{formData.options.map((option) => (
											<div key={option.id} className="flex items-center gap-4">
												<Input
													value={option.label}
													onChange={(e) => handleOptionChange(option.id, 'label', e.target.value)}
													placeholder={`Option ${option.id}`}
													className="flex-1 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
												/>
												{formData.options.length > 2 && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removeOption(option.id)}
														className="text-slate-400 hover:text-red-400"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												)}
											</div>
										))}
									</div>

									<div className="space-y-4">
										<h3 className="text-lg font-medium text-white">Transaction Type</h3>
										<RadioGroup
											value={formData.is_sponsored ? 'sponsored' : 'standard'}
											onValueChange={(value) => setFormData({ ...formData, is_sponsored: value === 'sponsored' })}
											className="grid grid-cols-2 gap-4"
										>
											<div>
												<RadioGroupItem
													value="standard"
													id="standard"
													className="peer sr-only"
												/>
												<Label
													htmlFor="standard"
													className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800 p-4 hover:bg-slate-700 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
												>
													<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
														<Wallet className="h-6 w-6 text-purple-500" />
													</div>
													<span className="text-white">Standard</span>
													<span className="text-xs text-slate-400 text-center">
														Voters pay their own gas fees
													</span>
												</Label>
											</div>
											<div>
												<RadioGroupItem
													value="sponsored"
													id="sponsored"
													className="peer sr-only"
												/>
												<Label
													htmlFor="sponsored"
													className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800 p-4 hover:bg-slate-700 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
												>
													<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
														<Gift className="h-6 w-6 text-purple-500" />
													</div>
													<span className="text-white">Sponsored</span>
													<span className="text-xs text-slate-400 text-center">
														You pay gas fees for all voters
													</span>
												</Label>
											</div>
										</RadioGroup>

										{formData.is_sponsored && (
											<Alert className="bg-blue-900/40 border-blue-700 text-blue-200">
												<div className="flex items-start gap-2">
													<Info className="h-4 w-4 mt-0.5 text-blue-400" />
													<div>
														<p className="font-medium">Sponsored Transactions</p>
														<p className="text-sm mt-1">
															By choosing sponsored transactions, you'll need to fund a relayer account first. 
															This account will cover the gas fees for all voters, making it easier for them to participate.
														</p>
													</div>
												</div>
											</Alert>
										)}
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-medium text-white">Eligible Voters</h3>
											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => fileInputRef.current?.click()}
													className="border-slate-700 text-slate-300 hover:bg-slate-800"
												>
													<Plus className="mr-2 h-4 w-4" />
													Upload CSV
												</Button>
												<input
													type="file"
													ref={fileInputRef}
													onChange={handleCsvUpload}
													accept=".csv"
													className="hidden"
												/>
											</div>
										</div>

										<div className="space-y-4">
											<div className="flex items-center gap-4">
												<Input
													value={newWallet}
													onChange={(e) => setNewWallet(e.target.value)}
													placeholder="Enter MultiversX address (erd1...)"
													className="flex-1 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
												/>
												<Button
													type="button"
													onClick={addWallet}
													className="bg-purple-600 text-white hover:bg-purple-700"
												>
													Add
												</Button>
											</div>

											{walletError && (
												<Alert variant="destructive" className="bg-red-500/10 text-red-400">
													<AlertCircle className="h-4 w-4" />
													<AlertDescription>{walletError}</AlertDescription>
												</Alert>
											)}

											{csvError && (
												<Alert variant="destructive" className="bg-red-500/10 text-red-400">
													<AlertCircle className="h-4 w-4" />
													<AlertDescription>{csvError}</AlertDescription>
												</Alert>
											)}

											<div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
												<div className="mb-4 flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Users className="h-4 w-4 text-slate-400" />
														<span className="text-sm text-slate-300">
															{formData.eligibleWallets.length} eligible voters
														</span>
													</div>
												</div>

												{formData.eligibleWallets.length > 0 ? (
													<div className="max-h-60 space-y-2 overflow-y-auto">
														{formData.eligibleWallets.map((wallet, index) => (
															<div
																key={index}
																className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/50 p-2"
															>
																<span className="font-mono text-sm text-slate-300">
																	{wallet}
																</span>
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() => removeWallet(wallet)}
																	className="h-6 w-6 text-slate-400 hover:text-red-400"
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														))}
													</div>
												) : (
													<div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-4 text-center">
														<p className="text-sm text-slate-400">
															No eligible voters added yet. Add individual addresses or upload a CSV file.
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter>
							{step === 1 ? (
								<Button
									className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
									onClick={handleNextStep}
									disabled={!isStep1Valid}
								>
									Continue
								</Button>
							) : (
								<div className='flex w-full gap-4 flex-col'>
									{/* Show stepper/alert for sponsored flow */}
									{formData.is_sponsored && (
										<Alert className='mb-2 bg-blue-900/40 border-blue-700 text-blue-200 flex items-center gap-2'>
											<Info className='h-4 w-4 text-blue-400' />
											{!fundingConfirmed ? (
												<span>
													<b>Step 1:</b> Fund your relayer before creating the campaign.
												</span>
											) : (
												<span>
													<b>Step 1 complete:</b> Relayer funded! You can now create your campaign.
												</span>
											)}
										</Alert>
									)}
									<div className='flex gap-4'>
										<Button
											variant='outline'
											className='flex-1 border-slate-700 text-slate-400 hover:bg-slate-800'
											onClick={handlePrevStep}
										>
											Back
										</Button>
										{/* Sponsored flow: show Fund Relayer or Create Campaign */}
										{formData.is_sponsored ? (
											!fundingConfirmed ? (
												<Button
													className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
													onClick={handleShowFundingInfo}
													disabled={isFunding || !isStep2Valid}
												>
													{getFundingButtonText()}
												</Button>
											) : (
												<Button
													className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
													onClick={handleCreateCampaign}
													disabled={isCreating || transactionStatus.isPending || !isStep2Valid}
												>
													{getButtonText()}
												</Button>
											)
										) : (
											<Button
												className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
												onClick={handleCreateCampaign}
												disabled={isCreating || transactionStatus.isPending || !isStep2Valid}
											>
												{getButtonText()}
											</Button>
										)}
									</div>
								</div>
							)}
						</CardFooter>
					</Card>
				) : (
					<Card className='border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur'>
						<CardContent className='pt-6 pb-6 flex flex-col items-center text-center'>
							<div className='w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4'>
								<CheckCircle2 className='h-8 w-8 text-green-500' />
							</div>
							<h2 className='text-2xl font-bold text-white mb-2'>
								Campaign Created Successfully!
							</h2>
							<p className='text-slate-400 mb-6'>
								Your campaign has been created and is now available for voting.
							</p>
							<div className='flex flex-col sm:flex-row gap-4'>
								<Link href='/campaigns'>
									<Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'>
										<Vote className='mr-2 h-4 w-4' />
										View All Campaigns
									</Button>
								</Link>
								<Link href='/campaigns/1'>
									<Button
										variant='outline'
										className='border-slate-700 text-purple-500 hover:bg-slate-800 hover:text-purple-400'
									>
										View Your Campaign
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			{creationError && (
				<Alert variant='destructive' className='mb-4'>
					<AlertDescription>{creationError}</AlertDescription>
				</Alert>
			)}
			{/* Funding Info Modal */}
			{showFundingInfo && (
				<Dialog open={showFundingInfo} onOpenChange={setShowFundingInfo}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Fund Relayer</DialogTitle>
							<DialogDescription className="pt-2">
								Because you selected a sponsored campaign, you must first fund your relayer account. This is a separate transaction and must be confirmed before you can create your campaign.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button 
								onClick={handleFundRelayer} 
								disabled={isFunding}
								className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
							>
								{isFunding ? 'Funding...' : 'Continue'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
