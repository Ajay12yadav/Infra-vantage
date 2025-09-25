import { useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignUp = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return isLogin ? (
    <LoginModal onClose={onClose} switchToSignUp={switchToSignUp} />
  ) : (
    <SignUpModal onClose={onClose} switchToLogin={switchToLogin} />
  );
};

export default AuthModal;