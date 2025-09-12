import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
`;

// MODIFIED: Logo font changed for a stronger look
const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-family: 'Montserrat', sans-serif; /* New font for boldness */
  font-size: 1.9rem;
  font-weight: 800; /* Heavier weight for strength */
  text-transform: uppercase; /* Uppercase adds impact */
  letter-spacing: 1px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05); /* Subtle scale-up on hover */
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
`;

// MODIFIED: NavLink hover effect changed to an unfolding background
const NavLink = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding: 8px 4px; /* Added padding for background to fill */
  transition: color 0.3s ease;
  z-index: 1; /* Ensure text is above the pseudo-element */

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(200, 215, 230, 0.5); /* Semi-transparent background */
    z-index: -1;
    transform-origin: bottom;
    transform: scaleY(0); /* Start "folded" at the bottom */
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    color: #000;
  }

  &:hover::before {
    transform: scaleY(1); /* "Unfold" to full height on hover */
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

// MODIFIED: LoginButton hover effect changed to an unfolding wipe
const LoginButton = styled(Link)`
  padding: 0.6rem 1.5rem;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: transparent;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative; /* Required for pseudo-element and z-index */
  overflow: hidden; /* Hide the pseudo-element overflow */
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
    transform: scaleX(0); /* Start "folded" on the left */
    transition: transform 0.3s ease-in-out;
  }
  
  &:hover {
    color: #fff; /* Text color changes when background fills */
  }
  
  &:hover::after {
    transform: scaleX(1); /* "Unfold" from left to right on hover */
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <LogoContainer to="/">
        Unfold
      </LogoContainer>
      
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recovery-tools">Recovery Tools</NavLink>
        <NavLink to="/testimonials">Testimonials</NavLink>
      </NavLinks>

      <AuthButtons>
        <LoginButton to="/login">Login</LoginButton>
      </AuthButtons>
    </NavContainer>
  );
};

export default Navbar;