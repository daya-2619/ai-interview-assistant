import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './AuthForm.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'interviewer' | 'interviewee' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      const success = await register(name, email, password, role);
      if (!success) {
        setError('Email already exists. Please use a different email.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <UserPlus size={48} />
        <h2>Create Account</h2>
        <p>Join us and start your interview journey!</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <User size={20} />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Mail size={20} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Lock size={20} />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Lock size={20} />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="role-selection">
          <h3>Choose your role:</h3>
          <div className="role-options">
            <div 
              className={`role-option ${role === 'interviewee' ? 'selected' : ''}`}
              onClick={() => setRole('interviewee')}
            >
              <UserCheck size={24} />
              <div>
                <h4>Interviewee</h4>
                <p>Take interviews and showcase your skills</p>
              </div>
            </div>

            <div 
              className={`role-option ${role === 'interviewer' ? 'selected' : ''}`}
              onClick={() => setRole('interviewer')}
            >
              <Users size={24} />
              <div>
                <h4>Interviewer</h4>
                <p>Review candidates and manage interviews</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary auth-submit"
          disabled={loading || !role}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
