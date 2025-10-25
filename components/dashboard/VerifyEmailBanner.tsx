'use client';

import { Info } from 'lucide-react';

export default function VerifyEmailBanner({
  emailVerified,
}: {
  emailVerified: boolean;
}) {
  if (emailVerified) return null;
  
  const handleResend = () => {
    // TODO: Wire up resend email functionality
    console.log('Resend email clicked');
  };

  return (
    <div className="mb-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-yellow-200">
          <Info className="size-3.5" />
        </span>
        <div className="flex-1">
          <div className="font-medium">Email not verified</div>
          <div className="opacity-90">
            We've sent you an email to verify your address. Please follow the instructions to continue. Your account will be restricted until you verify your email.
            {' '}
            <button onClick={handleResend} className="underline underline-offset-2 hover:opacity-80">
              Resend email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

