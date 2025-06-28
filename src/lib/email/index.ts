'use server'

import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import React from 'react';

// Interface for Brevo API errors
interface BrevoError extends Error {
  statusCode?: number;
  body?: unknown;
  response?: {
    body?: unknown;
  };
}

// This is our central email sending function.
export const sendEmail = async ({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) => {
  try {
    const api = new brevo.TransactionalEmailsApi();
    api.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
    
    console.log('📧 Rendering React component to HTML...');
    const htmlContent = await render(react);
    console.log('📊 HTML Content Type:', typeof htmlContent);
    console.log('📊 HTML Content Value:', htmlContent);
    console.log('✅ HTML rendered successfully, length:', htmlContent?.length);
    
    if (typeof htmlContent === 'string' && htmlContent.length > 0) {
      console.log('📄 HTML preview (first 200 chars):', htmlContent.substring(0, 200));
    } else {
      throw new Error(`Rendered HTML content is invalid. Type: ${typeof htmlContent}, Value: ${htmlContent}`);
    }

    await api.sendTransacEmail({
      sender: { email: 'partners@mail.wishconsult.app', name: 'Wish Consult Partners' },
      to: [{ email: to }],
      subject,
      htmlContent,
    });
    
    console.log('✅ Email sent successfully via React component!');
  } catch (error: unknown) {
    console.error("Failed to send email via Brevo:", error);
    if (error && typeof error === 'object' && 'message' in error) {
      const brevoError = error as BrevoError;
      console.error("Error details:", {
        message: brevoError.message,
        statusCode: brevoError.statusCode,
        body: brevoError.body,
        response: brevoError.response?.body || brevoError.response
      });
    }
    // We log the error but don't throw, so it doesn't crash the calling function.
    throw error; // Re-throw so the fallback can catch it
  }
}; 