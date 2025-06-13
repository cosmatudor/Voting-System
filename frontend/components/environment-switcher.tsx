'use client';

import { useEnvironmentInfo } from '@/lib/environment-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EnvironmentSwitcher() {
	const { environment, contractAddress, rpcUrl, switchEnvironment } =
		useEnvironmentInfo();

	return (
		<Card className='w-full max-w-md mx-auto mb-4'>
			<CardHeader>
				<CardTitle>Environment: {environment}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-2 mb-4'>
					<p>
						<strong>Contract Address:</strong> {contractAddress}
					</p>
					<p>
						<strong>RPC URL:</strong> {rpcUrl}
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button
						size='sm'
						variant={environment === 'local' ? 'default' : 'outline'}
						onClick={() => switchEnvironment('local')}
					>
						Local
					</Button>
					<Button
						size='sm'
						variant={environment === 'development' ? 'default' : 'outline'}
						onClick={() => switchEnvironment('development')}
					>
						Development
					</Button>
					<Button
						size='sm'
						variant={environment === 'test' ? 'default' : 'outline'}
						onClick={() => switchEnvironment('test')}
					>
						Test
					</Button>
					<Button
						size='sm'
						variant={environment === 'production' ? 'default' : 'outline'}
						onClick={() => switchEnvironment('production')}
					>
						Production
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
