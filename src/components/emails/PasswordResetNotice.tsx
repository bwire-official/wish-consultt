import React from 'react';

interface PasswordResetNoticeEmailProps {
  userFullName: string;
  resetTime: string;
}

// This is a React component that renders a professional HTML email template.
export const PasswordResetNoticeEmail: React.FC<PasswordResetNoticeEmailProps> = ({
  userFullName,
  resetTime,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Security Alert - Password Changed</title>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
          }
          .alert-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #6b7280;
            margin-bottom: 30px;
          }
          .content {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-item {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #6366f1;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .info-value {
            font-weight: 600;
            color: #1f2937;
          }
          .recommendations {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .recommendations h3 {
            color: #0369a1;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .recommendations ul {
            margin: 0;
            padding-left: 20px;
          }
          .recommendations li {
            margin-bottom: 8px;
            color: #0c4a6e;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .contact {
            color: #6366f1;
            text-decoration: none;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">Wish Consult</div>
            <div className="alert-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h1 className="title">Security Alert</h1>
            <p className="subtitle">Your password was recently changed</p>
          </div>

          <div className="content">
            <p>Hello {userFullName},</p>
            <p>We detected that your Wish Consult account password was changed on <strong>{resetTime}</strong>.</p>
            <p>If you made this change, you can safely ignore this email. If you didn&apos;t change your password, please contact our support team immediately.</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Account</div>
              <div className="info-value">{userFullName}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Time</div>
              <div className="info-value">{resetTime}</div>
            </div>
          </div>

          <div className="recommendations">
            <h3>Security Recommendations</h3>
            <ul>
              <li>Use a strong, unique password for your account</li>
              <li>Enable two-factor authentication if available</li>
              <li>Never share your password with anyone</li>
              <li>Log out from all devices if you suspect unauthorized access</li>
            </ul>
          </div>

          <div className="footer">
            <p>This is an automated security notification from Wish Consult.</p>
            <p>If you have any questions, contact us at <a href="mailto:support@wishconsult.app" className="contact">support@wishconsult.app</a></p>
          </div>
        </div>
      </body>
    </html>
  );
}; 