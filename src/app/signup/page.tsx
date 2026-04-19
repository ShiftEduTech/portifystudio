'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { InputField } from '@/components/auth/InputField';
import { Button } from '@/components/auth/Button';
import { signUpWithEmail, logInWithGoogle } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(name, email, password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await logInWithGoogle();
      toast.success('Successfully registered with Google');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to signup with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Portify Studio and start building"
    >
      <form className="space-y-6" onSubmit={handleEmailSignup}>
        <InputField
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          icon={User}
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          icon={Lock}
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-zinc-900/50 px-2 text-gray-400 backdrop-blur-sm">
              OR continue with Google
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Sign up with Google
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-purple-500 hover:text-purple-400 transition-colors">
            Sign in instead
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
