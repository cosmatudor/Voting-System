import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/client-providers';
import { SiteLayout } from '@/components/site-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Envote',
	description:
		'A privacy-focused voting platform using fully homomorphic encryption that ensures your vote remains confidential while maintaining transparency and verifiability.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ClientProviders>
					<SiteLayout>{children}</SiteLayout>
				</ClientProviders>
			</body>
		</html>
	);
}
