import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowHelp(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Please enter your password');
      return false;
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!isLogin && !fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Sign in
        console.log('Attempting sign in for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password
        });

        if (error) {
          console.error('Sign in error:', error);
          
          // Provide specific, helpful error messages
          if (error.message.includes('Invalid login credentials') || 
              error.message.includes('invalid_credentials') ||
              error.message.includes('Invalid email or password')) {
            
            setError('Invalid email or password. Please check your credentials and try again.');
            setShowHelp(true);
            
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please check your email and click the confirmation link before signing in.');
            
          } else if (error.message.includes('Too many requests')) {
            setError('Too many login attempts. Please wait a few minutes before trying again.');
            
          } else if (error.message.includes('signup_disabled')) {
            setError('Account creation is currently disabled. Please contact support.');
            
          } else {
            setError(`Sign in failed: ${error.message}`);
          }
          return;
        }

        if (data.user) {
          console.log('Sign in successful:', data.user.email);
          setSuccess('Successfully signed in! Welcome back.');
          
          // Small delay to show success message
          setTimeout(() => {
            if (onAuthSuccess) {
              onAuthSuccess();
            }
            handleClose();
          }, 1500);
        }
        
      } else {
        // Sign up
        console.log('Attempting sign up for:', email);
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          
          // Provide specific, helpful error messages for signup
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
            setTimeout(() => {
              setIsLogin(true);
              setPassword('');
              setError('');
            }, 2000);
            
          } else if (error.message.includes('Password should be at least')) {
            setError('Password must be at least 6 characters long.');
            
          } else if (error.message.includes('Invalid email')) {
            setError('Please enter a valid email address.');
            
          } else if (error.message.includes('Signup is disabled') || 
                     error.message.includes('signup_disabled')) {
            setError('Account creation is currently disabled. Please contact support.');
            
          } else if (error.message.includes('weak_password')) {
            setError('Password is too weak. Please use a stronger password with at least 6 characters.');
            
          } else {
            setError(`Sign up failed: ${error.message}`);
          }
          return;
        }

        if (data.user) {
          console.log('Sign up successful:', data.user.email);
          
          // Check if email confirmation is required
          if (!data.session && data.user && !data.user.email_confirmed_at) {
            setSuccess('Account created successfully! Please check your email and click the confirmation link to complete your registration.');
            
            // Switch to login mode after successful signup
            setTimeout(() => {
              setIsLogin(true);
              setPassword('');
              setError('');
              setSuccess('Please check your email for the confirmation link, then sign in.');
            }, 4000);
            
          } else {
            // User is immediately signed in (email confirmation disabled)
            setSuccess('Account created and signed in successfully! Welcome to start.dev!');
            
            // Create user profile
            try {
              const { data: userData } = await supabase.auth.getUser();

              if (userData.user) {
                const user = userData.user;
                const { error } = await supabase
                  .from('profiles')
                  .insert({
                    id: user.id,
                    username: user.user_metadata?.username || user.email?.split('@')[0],
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    avatar_url: user.user_metadata?.avatar_url || null,
                    updated_at: new Date().toISOString()
                  });

                if (error) {
                  console.warn('Profile creation warning:', error);
                }
              }
            } catch (profileError) {
              console.warn('Profile creation failed:', profileError);
            }

            setTimeout(() => {
              if (onAuthSuccess) {
                onAuthSuccess();
              }
              handleClose();
            }, 1500);
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setShowHelp(false);
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neo-card bg-white w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border">
          <h2 className="text-xl font-bold text-text-primary">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-light-hover rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-text-primary font-medium mb-1">
                  {isLogin ? 'Signing In' : 'Creating Account'}
                </p>
                <p className="text-text-secondary">
                  {isLogin 
                    ? 'Enter your email and password to access your account.'
                    : 'Join start.dev to protect your IP and discover investment opportunities.'
                  }
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-text-primary">
                  <User size={16} />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary placeholder-text-muted transition-all duration-300"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-text-primary">
                <Mail size={16} />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary placeholder-text-muted transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-text-primary">
                <Lock size={16} />
                <span>Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a password (min. 6 characters)"}
                  className="w-full px-4 py-3 pr-12 bg-white border border-light-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary placeholder-text-muted transition-all duration-300"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-text-muted mt-1">
                  Use at least 6 characters with a mix of letters and numbers
                </p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-start space-x-3">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <p className="text-text-primary text-sm">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start space-x-3">
                <AlertCircle size={16} className="text-error mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-medium">{error}</p>
                  {showHelp && isLogin && (
                    <div className="mt-2 text-xs text-text-secondary">
                      <p>• Make sure you've created an account first</p>
                      <p>• Check your email and password for typos</p>
                      <p>• Confirm your email if required</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="neo-btn w-full py-3 bg-primary text-white font-semibold flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={handleToggleMode}
                disabled={isLoading}
                className="ml-2 text-primary hover:text-primary-dark font-medium transition-colors disabled:opacity-50"
              >
                {isLogin ? 'Create one here' : 'Sign in instead'}
              </button>
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-light-bg border border-light-border rounded-xl">
            <h4 className="font-medium text-text-primary mb-2 text-sm">Need Help?</h4>
            <div className="text-xs text-text-muted space-y-1">
              {isLogin ? (
                <>
                  <p>• <strong>New user?</strong> Click "Create one here" to sign up</p>
                  <p>• <strong>Forgot password?</strong> Contact support for assistance</p>
                  <p>• <strong>Email not confirmed?</strong> Check your inbox and spam folder</p>
                </>
              ) : (
                <>
                  <p>• <strong>Already registered?</strong> Click "Sign in instead"</p>
                  <p>• <strong>Email confirmation:</strong> You may need to verify your email</p>
                  <p>• <strong>Password requirements:</strong> Minimum 6 characters</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;