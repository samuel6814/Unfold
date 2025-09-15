import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 2rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  color: #555;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05); /* Subtle separator line */
  box-sizing: border-box; /* Ensures padding does not add to the width */
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: #333;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  font-size: 0.85rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <LinksContainer>
        <FooterLink href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</FooterLink>
        <FooterLink href="#" target="_blank" rel="noopener noreferrer">Terms of Service</FooterLink>
      </LinksContainer>
      <CopyrightText>
        &copy; {currentYear} unfold. All Rights Reserved.
      </CopyrightText>
      <p style={{ margin: 0 }}>
        built by <FooterLink href="https://trileon.vercel.app" target="_blank" rel="noopener noreferrer">trileon</FooterLink>™
      </p>
    </FooterContainer>
  );
};

export default Footer;

