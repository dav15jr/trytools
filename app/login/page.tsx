'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, signIn, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const handleError = (error: { code: string; message: string }) => {
    if (error.code === 'auth/wrong-password') {
      setError('Wrong Password, please try again.');
    } else if (error.code === 'auth/invalid-credential') {
      setError('Wrong Email or Password.');
    } else if (error.code === 'auth/user-not-found') {
      setError('Wrong Email or you are not Registered.');
    } else if (error.code === 'auth/missing-password') {
      setError('Please Enter your Password.');
    } else if (error.code === 'auth/invalid-email') {
      setError('Please Enter your Email.');
    } else if (error.code === 'auth/weak-password') {
      setError('Password should be at least 6 characters.');
    } else if (error.code === 'auth/email-already-in-use') {
      setError('Account already registered. Please Log In');
    } else if (error.code === 'auth/too-many-requests') {
      setError(
        'Too many attempts, please reset your password - check your email'
      );
      handlePasswordReset();
    }
    setError(`Error message: ${error.message}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      router.push(callbackUrl);
    } catch (error: any) {
      handleError(error);
    }
  };
  const handlePasswordReset = async () => {
    try {
      await resetPassword(email);
      alert('Password reset e-mail sent - check your mailbox');
    } catch (error: any) {
      handleError(error);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push(callbackUrl);
    } catch (error: any) {
      handleError(error);
    }
  };

  if (user) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 px-4 py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login to Access Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                name='email'
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                name='password'
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-purple-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <div className="pt-4">
              <Button
                id="google-btn"
                className="w-full border-2 border-orange-400 bg-white text-black hover:bg-orange-100"
                onClick={handleGoogleSignIn}
              >
              <FcGoogle size="2.0rem" />
                Sign in with Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
