'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Mail, Trash2, Upload, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { updateProfile, uploadAvatar, removeAvatar, deleteAccount } from '@/app/actions/profile-actions';
import Image from 'next/image';

type AccountFormProps = {
  initialData: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
};

export default function AccountForm({ initialData }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(initialData.full_name);
  const [savedName, setSavedName] = useState(initialData.full_name);
  const [nameLoading, setNameLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync name value when initial data changes
  useEffect(() => {
    setNameValue(initialData.full_name);
    setSavedName(initialData.full_name);
  }, [initialData.full_name]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Profile updated successfully');
    }

    setLoading(false);
  };

  const handleNameEdit = () => {
    setNameValue(savedName);
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) {
      setError('Name is required');
      return;
    }

    setNameLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('full_name', nameValue.trim());

    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Name updated successfully');
      setIsEditingName(false);
      // Update the saved name to reflect the new value
      setSavedName(nameValue.trim());
      // Force a page refresh to get fresh data from server
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    setNameLoading(false);
  };

  const handleNameCancel = () => {
    // Reset to the last saved value
    setNameValue(savedName);
    setIsEditingName(false);
    setError('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadAvatar(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setAvatarUrl(result.url);
      setSuccess('Avatar uploaded successfully');
    }

    setAvatarLoading(false);
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    setError('');

    const result = await removeAvatar();

    if (result.error) {
      setError(result.error);
    } else {
      setAvatarUrl('');
      setSuccess('Avatar removed successfully');
    }

    setAvatarLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const result = await deleteAccount();

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Card */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <div className="relative h-20 w-20 rounded-full overflow-hidden">
                <Image 
                  src={avatarUrl} 
                  alt="Avatar" 
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <Avatar className="size-20">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500">
                  <span className="text-white text-2xl font-semibold leading-none select-none">
                    {initialData.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {avatarLoading ? 'Uploading...' : 'Upload'}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={avatarLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
        
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-900">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-2">
              <User className="inline mr-2 h-4 w-4" />
              Full Name
            </label>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="Enter your full name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNameSave}
                    disabled={nameLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleNameCancel}
                    disabled={nameLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={savedName}
                    disabled
                    className="flex-1 bg-gray-50 cursor-not-allowed"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleNameEdit}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {nameLoading && (
              <p className="text-xs text-muted-foreground mt-1">
                Updating name...
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              <Mail className="inline mr-2 h-4 w-4" />
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={initialData.email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Need to update your email? Contact support at hey@kittie.so
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Delete Account Card */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-medium text-red-900 mb-2">Delete Account</h2>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowDeleteModal(true)}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Confirm Account Deletion</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

