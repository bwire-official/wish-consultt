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
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    color: '#ffffff',
    padding: '40px 30px',
    textAlign: 'center'
  };

  const contentStyle: React.CSSProperties = {
    padding: '40px 30px'
  };

  const inviteBoxStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    margin: '30px 0'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontWeight: 'bold'
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    textAlign: 'center'
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      margin: 0,
      padding: '20px'
    }}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            🎉 Welcome to Wish Consult Partners!
          </h1>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <p style={{
            fontSize: '18px',
            color: '#374151',
            marginBottom: '30px'
          }}>
            Hello <strong>{userFullName || 'Partner'}</strong>,
          </p>
          
          <p style={{ color: '#374151', lineHeight: '1.6' }}>
            Congratulations! You&apos;re now an official Wish Consult Partner. Your account is fully set up and ready to start earning commissions.
          </p>

          {/* Invite Box */}
          <div style={inviteBoxStyle}>
            <p style={{
              fontSize: '16px',
              color: '#374151',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Your Invite Link
            </p>
            <p style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '14px',
              color: '#6b7280',
              wordBreak: 'break-all',
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              margin: '10px 0'
            }}>
              {inviteLink}
            </p>
          </div>

          <p style={{ color: '#374151', fontWeight: 'bold' }}>
            🚀 What&apos;s Next?
          </p>
          
          <ul style={{ color: '#374151', lineHeight: '1.6' }}>
            <li>Share your invite link with your audience</li>
            <li>Earn 30% commission on every course purchase</li>
            <li>Track your performance in real-time</li>
            <li>Get monthly payouts once you reach $50</li>
          </ul>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a href="https://wishconsult.app/affiliate/dashboard" style={buttonStyle}>
              Access Your Dashboard
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={{
            color: '#6b7280',
            fontSize: '12px',
            margin: 0
          }}>
            © {new Date().getFullYear()} Wish Consult. All rights reserved.<br/>
            Questions? Reply to this email or contact us at partners@mail.wishconsult.app
          </p>
        </div>
      </div>
    </div>
  );
}; 