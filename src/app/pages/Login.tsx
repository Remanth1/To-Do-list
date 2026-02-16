import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckSquare } from 'lucide-react';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-lg bg-primary border-2 border-border p-4 brutal-shadow">
              <CheckSquare className="h-10 w-10 text-primary-foreground" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground font-medium">Sign in to continue to TaskFlow</p>
        </div>

        {/* Login Form Card - Neo-Brutalist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg border-2 border-border p-8 brutal-shadow"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/20 border-2 border-border text-destructive px-4 py-3 rounded-lg text-sm font-bold"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Email Input */}
            <TextInput
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-primary hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-0.5 bg-border"></div>
            <span className="text-xs font-bold text-muted-foreground">OR</span>
            <div className="flex-1 h-0.5 bg-border"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-foreground font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline transition-colors"
            >
              Create account
            </Link>
          </p>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground font-medium">
          By continuing, you agree to TaskFlow's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
