import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from '../../lib/Firebase'; // Import auth from your config file

// +++ START of new, local Navbar for this page +++
const AuthNavContainer = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  box-sizing: border-box;
  z-index: 10;
`;

const AuthLogo = styled(Link)`
  text-decoration: none;
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AuthNavLink = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  &:hover {
    color: #000;
  }
`;

const AuthNavbar = () => (
  <AuthNavContainer>
    <AuthLogo to="/">Unfold</AuthLogo>
    <AuthNavLink to="/">Home</AuthNavLink>
  </AuthNavContainer>
);
// +++ END of new, local Navbar +++

// Layout container
const AuthContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe0f0;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding-top: 80px;
  box-sizing: border-box;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #1a1a1a;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  &:focus {
    outline: none;
    border-color: #90b0c5;
  }
`;

const Button = styled.button`
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #000;
  }
`;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const GoogleButton = styled(Button)`
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #888;
  margin: 1.5rem 0;
  &::before, &::after { content: ''; flex: 1; border-bottom: 1px solid #ccc; }
  &:not(:empty)::before { margin-right: .5em; }
  &:not(:empty)::after { margin-left: .5em; }
`;

const RedirectText = styled.p`
  color: #555;
  font-size: 0.9rem;
  a {
    color: #1a1a1a;
    font-weight: 600;
    text-decoration: none;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      navigate('/'); // Redirect to home page after successful sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AuthNavbar />
      <AuthContainer>
        <FormContainer>
          <Title>Create Account</Title>
          <Form onSubmit={handleSignUp}>
            <GoogleButton type="button" onClick={handleGoogleSignUp}>
              <GoogleIcon /> Sign up with Google
            </GoogleButton>
            <Divider>OR</Divider>
            <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit">Sign Up</Button>
          </Form>
          {error && <ErrorText>{error}</ErrorText>}
          <RedirectText>
            Already have an account? <Link to="/login">Login</Link>
          </RedirectText>
        </FormContainer>
      </AuthContainer>
    </>
  );
};

export default SignUp;
