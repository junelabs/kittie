'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Upload, Sparkles, ArrowRight } from 'lucide-react';
import { createBrand } from '@/app/actions/brand-actions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type StepKey = 'welcome' | 'brand' | 'success';

export default function OnboardingModal({ openByDefault }: { openByDefault: boolean }) {
  const [open, setOpen] = React.useState(openByDefault);
  const [step, setStep] = React.useState<StepKey>('welcome');
  const [pending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Form state for brand creation
  const [brandName, setBrandName] = React.useState('');
  const [brandDescription, setBrandDescription] = React.useState('');
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  // Support external "Complete setup" chip click
  React.useEffect(() => {
    function handleOpenFromChip(e: Event) {
      if ((e.target as HTMLElement)?.closest('[data-open-onboarding]')) {
        setOpen(true);
      }
    }
    document.addEventListener('click', handleOpenFromChip);
    return () => document.removeEventListener('click', handleOpenFromChip);
  }, []);

  const handleCreateBrand = async () => {
    if (!brandName.trim()) {
      setError('Brand name is required');
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const formData = new FormData();
        formData.append('name', brandName.trim());
        if (brandDescription.trim()) {
          formData.append('description', brandDescription.trim());
        }
        await createBrand(formData);
        setStep('success');
      } catch (err: any) {
        setError(err.message || 'Failed to create brand');
      }
    });
  };

  const handleGoToDashboard = () => {
    setOpen(false);
    router.refresh();
  };

  const getStepNumber = () => {
    if (step === 'welcome') return 1;
    if (step === 'brand') return 2;
    if (step === 'success') return 3;
    return 1;
  };

  const getStepTitle = () => {
    if (step === 'welcome') return 'Welcome to Kittie 👋';
    if (step === 'brand') return 'Create your brand space';
    if (step === 'success') return 'You\'re all set!';
    return 'Welcome';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined} className="max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="sr-only">Onboarding</DialogTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Array.from({ length: 3 }, (_, i) => {
                const stepNumber = i + 1;
                const currentStep = getStepNumber();
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                      ${isCompleted 
                        ? 'bg-green-100 text-green-600 border-2 border-green-200' 
                        : isCurrent 
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' 
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`
                        w-8 h-0.5 transition-all duration-300
                        ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}
                      `} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Step Title */}
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            {getStepTitle()}
          </h2>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Welcome */}
          {step === 'welcome' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
              <p className="text-gray-600">
                Let's set up your brand.
              </p>
              <Button 
                onClick={() => setStep('brand')}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
              <div className="flex justify-center">
                <button 
                  onClick={() => setOpen(false)}
                  className="text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center space-x-1"
                >
                  Skip and setup later
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Create Brand */}
          {step === 'brand' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                    Brand name *
                  </label>
                  <Input
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Short description (optional)
                  </label>
                  <Textarea
                    id="brandDescription"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    placeholder="Tell us about your brand..."
                    className="w-full"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand logo (optional)
                  </label>
                  <div className="space-y-3">
                    {logoPreview ? (
                      <div className="flex items-center space-x-3">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{logoFile?.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-2 pb-2">
                          <Upload className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-sm text-gray-500">Click to upload logo</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLogoFile(file);
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setLogoPreview(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleCreateBrand}
                disabled={pending || !brandName.trim()}
                className="w-full"
                size="lg"
              >
                {pending ? 'Creating...' : 'Create Brand Space'}
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                You're all set! Let's make your first brand, media, or product kit.
              </p>
              <Button 
                onClick={handleGoToDashboard}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}