import * as React from 'react';

interface AffiliateWelcomeEmailProps {
  userFullName: string | null;
  inviteLink: string;
}

export const AffiliateWelcomeEmail: React.FC<Readonly<AffiliateWelcomeEmailProps>> = ({
  userFullName,
  inviteLink,
}) => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '640px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
    color: '#ffffff',
    padding: '50px 40px',
    textAlign: 'center',
    position: 'relative'
  };

  const contentStyle: React.CSSProperties = {
    padding: '50px 40px'
  };

  const inviteBoxStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    margin: '40px 0',
    position: 'relative'
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    fontSize: '15px',
    color: '#475569',
    backgroundColor: '#ffffff',
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    margin: '15px 0',
    wordBreak: 'break-all',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.2s ease'
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingLeft: '0'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '12px',
    marginTop: '2px',
    flexShrink: 0
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    padding: '30px 40px',
    textAlign: 'center'
  };

  // SVG Icons
  const CheckIcon = () => (
    <svg style={iconStyle} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#10b981"/>
      <path d="M6 10l2 2 6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const RocketIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#fbbf24"/>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="6" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="2"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const LinkIcon = () => (
    <svg style={iconStyle} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f1f5f9',
      margin: 0,
      padding: '40px 20px',
      lineHeight: '1.6'
    }}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ marginBottom: '16px' }}>
            <AwardIcon />
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Welcome to Wish Consult Partners
          </h1>
          <p style={{
            margin: '12px 0 0 0',
            fontSize: '18px',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            Your journey to earning starts now
          </p>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#1e293b',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Hello {userFullName || 'Partner'},
            </h2>
            
            <p style={{ 
              color: '#475569', 
              fontSize: '16px',
              marginBottom: '24px' 
            }}>
              Congratulations! You&apos;re now an official <strong>Wish Consult Partner</strong>. Your account is fully set up and ready to start earning commissions.
            </p>
          </div>

          {/* Invite Box */}
          <div style={inviteBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <LinkIcon />
              <h3 style={{
                fontSize: '20px',
                color: '#1e293b',
                margin: '0 0 0 8px',
                fontWeight: '600'
              }}>
                Your Personal Invite Link
              </h3>
            </div>
            <div style={linkStyle}>
              {inviteLink}
            </div>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: '16px 0 0 0',
              fontStyle: 'italic'
            }}>
              Share this link to start earning commissions
            </p>
          </div>

          {/* What's Next Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <RocketIcon />
              <h3 style={{
                fontSize: '22px',
                color: '#1e293b',
                margin: '0 0 0 12px',
                fontWeight: '600'
              }}>
                What&apos;s Next?
              </h3>
            </div>
            
            <div style={{ marginLeft: '0' }}>
              <div style={featureItemStyle}>
                <CheckIcon />
                <span style={{ color: '#475569', fontSize: '16px' }}>
                  <strong>Share your invite link</strong> with your audience
                </span>
              </div>
              <div style={featureItemStyle}>
                <CheckIcon />
                <span style={{ color: '#475569', fontSize: '16px' }}>
                  <strong>Earn 30% commission</strong> on every course purchase
                </span>
              </div>
              <div style={featureItemStyle}>
                <CheckIcon />
                <span style={{ color: '#475569', fontSize: '16px' }}>
                  <strong>Track your performance</strong> in real-time dashboard
                </span>
              </div>
              <div style={featureItemStyle}>
                <CheckIcon />
                <span style={{ color: '#475569', fontSize: '16px' }}>
                  <strong>Get monthly payouts</strong> once you reach $50
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <a href="https://wishconsult.app/affiliate/dashboard" style={buttonStyle}>
              Access Your Dashboard →
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            © {new Date().getFullYear()} Wish Consult. All rights reserved.
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: '13px',
            margin: 0
          }}>
            Questions? Reply to this email or contact us at{' '}
            <a href="mailto:partners@mail.wishconsult.app" style={{
              color: '#6366f1',
              textDecoration: 'none'
            }}>
              partners@mail.wishconsult.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}; 