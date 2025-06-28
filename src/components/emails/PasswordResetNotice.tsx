import * as React from 'react';

interface PasswordResetNoticeEmailProps {
  userFullName: string;
  resetTime: string;
}

export const PasswordResetNoticeEmail: React.FC<Readonly<PasswordResetNoticeEmailProps>> = ({
  userFullName,
  resetTime,
}) => (
  <html lang="en">
    {/* eslint-disable-next-line @next/next/no-head-element */}
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Security Alert - Password Changed</title>
      <style>{`
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333; line-height: 1.5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e6e6e6; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .alert-icon { width: 50px; height: 50px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .content { padding: 32px; text-align: left; }
        .content p { font-size: 16px; margin-bottom: 24px; }
        .alert-box { background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; padding: 20px; border-radius: 6px; margin-bottom: 24px; }
        .alert-box p { margin-bottom: 12px; }
        .info-grid { display: table; width: 100%; margin-bottom: 24px; }
        .info-row { display: table-row; }
        .info-cell { display: table-cell; padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; }
        .info-cell:first-child { font-weight: bold; color: #374151; background-color: #f3f4f6; }
        .security-tips { background-color: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px; margin-bottom: 24px; }
        .security-tips h3 { margin: 0 0 16px 0; font-size: 18px; color: #1e40af; }
        .security-tips ul { margin: 0; padding-left: 20px; }
        .security-tips li { margin-bottom: 8px; color: #1e3a8a; }
        .button { display: inline-block; background-color: #ef4444; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 6px; margin: 16px 0; }
        .footer { background-color: #f4f4f7; padding: 24px; text-align: center; font-size: 12px; color: #888; }
        .footer a { color: #ef4444; text-decoration: none; }
      `}</style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h1>Security Alert</h1>
          <p style={{margin: "8px 0 0 0", opacity: 0.9}}>Password Changed Successfully</p>
        </div>
        
        <div className="content">
          <p>Hello {userFullName},</p>
          
          <div className="alert-box">
            <p><strong>Your password was recently changed</strong></p>
            <p>We detected that your Wish Consult account password was successfully changed on <strong>{resetTime}</strong>.</p>
            <p>If you made this change, you can safely ignore this email. If you didn&apos;t authorize this change, please take immediate action.</p>
          </div>

          <div className="info-grid">
            <div className="info-row">
              <div className="info-cell">Account Holder</div>
              <div className="info-cell">{userFullName}</div>
            </div>
            <div className="info-row">
              <div className="info-cell">Password Changed</div>
              <div className="info-cell">{resetTime}</div>
            </div>
            <div className="info-row">
              <div className="info-cell">Action Required</div>
              <div className="info-cell">None (if you authorized this change)</div>
            </div>
          </div>

          <div className="security-tips">
            <h3>🔒 Security Best Practices</h3>
            <ul>
              <li>Use a strong, unique password that you don&apos;t use elsewhere</li>
              <li>Consider enabling two-factor authentication for extra security</li>
              <li>Never share your password with anyone</li>
              <li>Sign out of all devices if you suspect unauthorized access</li>
              <li>Regularly update your password every 3-6 months</li>
            </ul>
          </div>

          <p style={{textAlign: "center"}}>
            <a href="https://wishconsult.app/login" className="button">Secure My Account</a>
          </p>

                      <p><strong>Didn&apos;t change your password?</strong> Contact our security team immediately at <a href="mailto:security@wishconsult.app" style={{color: "#ef4444"}}>security@wishconsult.app</a></p>
        </div>
        
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} Wish Consult. All rights reserved.</p>
          <p>This is an automated security notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
); 