import { Metadata } from 'next';

export const affiliateDashboardMetadata: Metadata = {
  title: 'Affiliate Dashboard | Wish Consult - Healthcare Education & Consultancy',
  description: 'Manage your affiliate partnerships, track earnings, and access marketing materials. Join Wish Consult\'s affiliate program and earn commissions promoting healthcare education and consultancy services.',
  keywords: 'affiliate dashboard, healthcare education, healthcare consultancy, commission tracking, marketing materials, Wish Consult affiliate program',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Affiliate Dashboard | Wish Consult',
    description: 'Manage your affiliate partnerships and track earnings with Wish Consult\'s comprehensive affiliate dashboard.',
    url: 'https://wishconsult.app/affiliate/dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Affiliate Dashboard | Wish Consult',
    description: 'Manage your affiliate partnerships and track earnings with Wish Consult\'s comprehensive affiliate dashboard.',
  },
};

export const getPageMetadata = (page: string): Metadata => {
  const baseUrl = 'https://wishconsult.app/affiliate/dashboard';
  
  const pageConfigs = {
    overview: {
      title: 'Affiliate Dashboard | Wish Consult - Healthcare Education & Consultancy',
      description: 'Your affiliate dashboard overview. Track invites, earnings, conversion rates, and manage your affiliate business with Wish Consult.',
    },
    invites: {
      title: 'My Invites | Affiliate Dashboard - Wish Consult',
      description: 'Manage your affiliate invites, track sign-ups, and monitor your referral performance. View detailed analytics for each invite.',
    },
    earnings: {
      title: 'Earnings | Affiliate Dashboard - Wish Consult',
      description: 'Track your affiliate earnings, view commission history, and monitor your revenue growth. Detailed financial analytics for your affiliate business.',
    },
    links: {
      title: 'My Links | Affiliate Dashboard - Wish Consult',
      description: 'Manage your affiliate links, create new tracking URLs, and monitor link performance. Generate custom affiliate links for different campaigns.',
    },
    analytics: {
      title: 'Analytics | Affiliate Dashboard - Wish Consult',
      description: 'Comprehensive analytics for your affiliate performance. Track conversions, traffic sources, and optimize your marketing strategies.',
    },
    materials: {
      title: 'Marketing Materials | Affiliate Dashboard - Wish Consult',
      description: 'Access promotional materials, banners, and marketing resources. Download high-quality assets to promote Wish Consult effectively.',
    },
    payouts: {
      title: 'Payouts | Affiliate Dashboard - Wish Consult',
      description: 'Manage your payout requests, view payment history, and set up payment methods. Withdraw your affiliate earnings securely.',
    },
    settings: {
      title: 'Settings | Affiliate Dashboard - Wish Consult',
      description: 'Manage your affiliate account settings, update profile information, and configure notification preferences.',
    },
  };

  const config = pageConfigs[page as keyof typeof pageConfigs] || pageConfigs.overview;

  return {
    title: config.title,
    description: config.description,
    keywords: 'affiliate dashboard, healthcare education, healthcare consultancy, commission tracking, marketing materials, Wish Consult affiliate program',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${baseUrl}/${page === 'overview' ? '' : page}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: config.title,
      description: config.description,
    },
  };
}; 