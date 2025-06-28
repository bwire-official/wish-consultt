// src/app/onboarding/affiliate/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/service'
import { getProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { type Json } from '@/types/supabase' // Import the Json type
import { sendEmail } from '@/lib/email'
import { AffiliateWelcomeEmail } from '@/components/emails/AffiliateWelcomeEmail'
import React from 'react'

/**
 * Checks if a username is available across all profiles.
 * Returns { available: boolean, message: string }
 */
export async function checkUsernameAvailability(username: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is good.
    console.error('Username check error:', error)
    return { available: false, message: 'Error checking username.' }
  }

  if (data) {
    return { available: false, message: 'Username is already taken.' }
  }

  return { available: true, message: 'Username is available!' }
}

/**
 * Saves all collected onboarding data and generates the first invite code.
 */
export async function completeAffiliateOnboarding(formData: {
  username: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  gender?: string;
  date_of_birth?: string;
  languages?: string[];
  onboarding_data?: Json;
}) {
  const profile = await getProfile()
  if (!profile || profile.role !== 'affiliate') {
    throw new Error('Not authorized or profile not found')
  }

  // 1. Update the main profile with the new data.
  const { error: profileUpdateError } = await supabaseAdmin
    .from('profiles')
    .update({
      username: formData.username,
      avatar_url: formData.avatar_url,
      phone_number: formData.phone_number,
      country: formData.country,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      onboarding_data: formData.onboarding_data,
      onboarding_completed: true,
    })
    .eq('id', profile.id)

  if (profileUpdateError) {
    console.error('Onboarding Profile Update Error:', profileUpdateError)
    return { success: false, message: 'Failed to save profile information.' }
  }

  // 2. Add selected languages to the separate `languages` table.
  if (formData.languages && formData.languages.length > 0) {
    const languageRecords = formData.languages.map(lang => ({
      user_id: profile.id,
      language_name: lang,
    }));
    await supabaseAdmin.from('languages').insert(languageRecords);
  }

  // 3. Silently generate a unique, default invite code.
  // Start with just the username in uppercase
  let defaultInviteCode = formData.username.toUpperCase();
  let isCodeUnique = false;
  let attempts = 0;

  // This loop ensures the generated code is unique.
  while (!isCodeUnique && attempts < 10) {
    const { data: existingCode } = await supabaseAdmin
      .from('invite_codes')
      .select('id')
      .eq('code_text', defaultInviteCode)
      .single();

    if (!existingCode) {
      isCodeUnique = true;
    } else {
      // If the code is taken, append a random 2-digit number and try again.
      defaultInviteCode = `${formData.username.toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
      attempts++;
    }
  }

  // Only insert the code if we found a unique one.
  if (isCodeUnique) {
    await supabaseAdmin
      .from('invite_codes')
      .insert({
        code_text: defaultInviteCode,
        affiliate_id: profile.id,
      })
  } else {
    // If we failed to find a unique code after 5 tries, log an error.
    // The user can generate one manually from their dashboard.
    console.error(`Could not generate a unique invite code for affiliate: ${profile.id}`);
  }

  // Send Welcome Email - Try React component first, fallback to HTML
  try {
    await sendEmail({
      to: profile.email!,
      subject: 'Welcome to the Wish Consult Partner Program! 🎉',
      react: React.createElement(AffiliateWelcomeEmail, {
        userFullName: profile.full_name || formData.username,
        inviteLink: `https://wishconsult.app/?invite=${defaultInviteCode}`
      })
    });
  } catch (error) {
    console.error("React email failed, trying direct HTML approach:", error);
    
    // Fallback: Direct Brevo call with professional HTML
    try {
      const brevo = await import('@getbrevo/brevo');
      const api = new brevo.TransactionalEmailsApi();
      api.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
      
      const userName = profile.full_name || formData.username;
      const inviteLink = `https://wishconsult.app/?invite=${defaultInviteCode}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Wish Consult Partners</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 30px; line-height: 1.7; color: #2d3748; }
            .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #ffffff; padding: 50px 40px; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1), rgba(255,255,255,0.2)); }
            .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header p { margin: 12px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 400; }
            .content { padding: 50px 40px; }
            .greeting { font-size: 20px; color: #1a202c; margin-bottom: 24px; font-weight: 600; }
            .intro { font-size: 16px; color: #4a5568; margin-bottom: 32px; line-height: 1.8; }
            .credentials-section { background: linear-gradient(135deg, #f7fafc, #edf2f7); border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 32px 0; text-align: center; }
            .credentials-title { font-size: 18px; color: #2d3748; margin-bottom: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .credentials-title::before { content: '●'; color: #8b5cf6; font-size: 12px; }
            .invite-code { font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; font-size: 18px; color: #553c9a; background: #ffffff; padding: 16px 20px; border-radius: 8px; border: 2px solid #8b5cf6; margin: 12px 0; font-weight: 700; letter-spacing: 1px; display: inline-block; }
            .invite-url { font-size: 14px; color: #718096; margin-top: 8px; word-break: break-all; }
            .benefits-section { margin: 40px 0; }
            .benefits-title { font-size: 18px; color: #2d3748; margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
            .benefits-title::before { content: '▲'; color: #059669; font-size: 14px; }
            .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
            .benefit-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 16px; text-align: center; }
            .benefit-number { font-size: 24px; font-weight: 800; color: #8b5cf6; margin-bottom: 4px; }
            .benefit-text { font-size: 13px; color: #4a5568; font-weight: 500; line-height: 1.4; }
            .instructions { background: #fefefe; border-left: 4px solid #8b5cf6; padding: 24px; margin: 32px 0; border-radius: 0 8px 8px 0; }
            .instructions-title { font-size: 16px; color: #2d3748; margin-bottom: 12px; font-weight: 700; }
            .instructions-text { font-size: 15px; color: #4a5568; line-height: 1.7; }
            .footer { background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer-content { font-size: 13px; color: #718096; line-height: 1.6; }
            .footer-brand { font-weight: 700; color: #2d3748; margin-bottom: 8px; }
            .divider { height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 32px 0; }
            .dashboard-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); transition: all 0.2s ease; }
            @media (max-width: 600px) {
              .benefits-grid { grid-template-columns: 1fr; }
              .content { padding: 30px 24px; }
              .header { padding: 40px 24px; }
              .footer { padding: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Partner Program</h1>
              <p>Your partnership with Wish Consult begins now</p>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${userName},</div>
              
              <div class="intro">
                We are pleased to confirm that your Wish Consult Partner account has been successfully activated. 
                You now have access to our comprehensive affiliate program designed for healthcare education professionals.
              </div>
              
              <div class="credentials-section">
                <div class="credentials-title">Your Partner Credentials</div>
                <div style="margin: 16px 0; color: #4a5568; font-size: 14px; font-weight: 600;">Invite Code:</div>
                <div class="invite-code">${defaultInviteCode}</div>
                <div style="margin: 16px 0; color: #4a5568; font-size: 14px; font-weight: 600;">Invite Link:</div>
                <div class="invite-url">${inviteLink}</div>
              </div>
              
              <div class="benefits-section">
                <div class="benefits-title">Partnership Benefits</div>
                <div class="benefits-grid">
                  <div class="benefit-item">
                    <div class="benefit-number">30%</div>
                    <div class="benefit-text">Commission Rate</div>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-number">$50</div>
                    <div class="benefit-text">Minimum Payout</div>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-number">30</div>
                    <div class="benefit-text">Day Cookie Life</div>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-number">24/7</div>
                    <div class="benefit-text">Real-time Analytics</div>
                  </div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="instructions">
                <div class="instructions-title">Getting Started</div>
                <div class="instructions-text">
                  Share your unique invite link with your professional network, students, or audience. 
                  For every successful course enrollment through your link, you will receive a 30% commission. 
                  Track your performance and earnings through your partner dashboard with comprehensive real-time analytics.
                </div>
              </div>
              
              <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="https://wishconsult.app/affiliate/dashboard" class="dashboard-button">Access Partner Dashboard</a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Wish Consult</div>
              <div class="footer-content">
                Professional Healthcare Education Platform<br>
                Partner Support: partners@mail.wishconsult.app<br>
                &copy; ${new Date().getFullYear()} Wish Consult. All rights reserved.
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await api.sendTransacEmail({
        sender: { email: 'partners@mail.wishconsult.app', name: 'Wish Consult Partners' },
        to: [{ email: profile.email! }],
        subject: 'Welcome to the Wish Consult Partner Program! 🎉',
        htmlContent: htmlContent.trim(),
      });
      
      console.log('✅ Fallback HTML email sent successfully!');
    } catch (fallbackError) {
      console.error("Both email methods failed:", fallbackError);
    }
  }

  revalidatePath('/affiliate/dashboard')
  redirect('/affiliate/dashboard')
}
