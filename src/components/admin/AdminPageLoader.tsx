'use client'

import NextTopLoader from 'nextjs-toploader';

const AdminPageLoader = () => {
  // We can use the same style for a consistent look and feel.
  return (
    <NextTopLoader
      color="#2299DD"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
};

export default AdminPageLoader; 