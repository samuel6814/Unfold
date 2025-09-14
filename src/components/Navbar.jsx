import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/Firebase';
import { Menu, X } from 'lucide-react';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem clamp(1.5rem, 5vw, 3rem); /* Responsive padding */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding: 8px 4px;
  transition: color 0.3s ease;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(200, 215, 230, 0.5);
    z-index: -1;
    transform-origin: bottom;
    transform: scaleY(0);
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    color: #000;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButtonBase = styled.button`
  padding: 0.6rem 1.5rem;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: transparent;
  color: #333;
  text-decoration: none;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease-in-out;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #333;
    z-index: -1;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
  }
  
  &:hover { color: #fff; }
  &:hover::after { transform: scaleX(1); }
`;

const LoginButton = styled(AuthButtonBase).attrs({ as: Link })``;
const LogoutButton = styled(AuthButtonBase)``;

const MenuIcon = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  color: #333;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// MODIFIED: MobileNavContainer is now full screen
const MobileNavContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-100%'};
  width: 100%; /* Changed to full width */
  height: 100vh;
  background: linear-gradient(200deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: right 0.4s ease-in-out;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const MobileNavLink = styled(NavLink)`
  font-size: 1.2rem;
`;

// NEW: Second close icon for inside the mobile menu
const CloseIconWrapper = styled.button`
  position: absolute;
  top: 1.5rem;
  right: clamp(1.5rem, 5vw, 3rem);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1002;
  color: #333;
`;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
    navigate('/login');
  };
  
  return (
    <>
      <NavContainer>
        <LogoContainer to="/">Unfold</LogoContainer>
        
        {/* Desktop Navigation */}
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recoverytools">Recovery Tools</NavLink>
          <NavLink to="/testimonials">Testimonials</NavLink>
        </NavLinks>
        <AuthButtons>
          {user ? (
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          ) : (
            <LoginButton to="/login">Login</LoginButton>
          )}
        </AuthButtons>

        {/* Mobile Navigation Icon */}
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </MenuIcon>
      </NavContainer>

      {/* Mobile Navigation Panel */}
      <MobileNavContainer isOpen={isMenuOpen}>
        {/* Added second close icon */}
        <CloseIconWrapper onClick={() => setIsMenuOpen(false)}>
          <X size={32} />
        </CloseIconWrapper>

        <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
        <MobileNavLink to="/recoverytools" onClick={() => setIsMenuOpen(false)}>Recovery Tools</MobileNavLink>
        <MobileNavLink to="/testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</MobileNavLink>
        {user ? (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        ) : (
          <LoginButton to="/login" onClick={() => setIsMenuOpen(false)}>Login</LoginButton>
        )}
      </MobileNavContainer>
    </>
  );
};

export default Navbar;

