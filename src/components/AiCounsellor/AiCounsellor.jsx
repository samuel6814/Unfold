import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../Navbar';
import { Send } from 'lucide-react';

// NEW: Keyframe for the fade-in-up reveal animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  background: #ffe0f0;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const ChatWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 80px 1rem 1rem;
  box-sizing: border-box;
  overflow: hidden;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div`
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  max-width: 75%;
  line-height: 1.5;
  white-space: pre-wrap;
  /* Apply animation to all message bubbles */
  animation: ${fadeInUp} 0.4s ease-out forwards;
`;

const UserMessage = styled(MessageBubble)`
  background-color: #333;
  color: #fff;
  border-bottom-right-radius: 4px;
  align-self: flex-end;
`;

const AiMessage = styled(MessageBubble)`
  background-color: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  align-self: flex-start;
`;

const TypingIndicator = styled(AiMessage)`
  color: #888;
  font-style: italic;
`;

// MODIFIED: Added animation to the input container
const InputContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  /* Add animation with a delay */
  opacity: 0;
  animation: ${fadeInUp} 0.6s 0.5s ease-out forwards;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #90b0c5;
  }

  &:disabled {
    background-color: #f0f0f0;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const AiCounsellor = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to listen. What's on your mind today?", sender: 'ai' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;

    const newUserMessage = { text: inputMessage, sender: 'user' };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const baseUrl = import.meta.env.VITE_GEMINI_API_URL;
      
      const cleanUrl = baseUrl.includes('q=') ? baseUrl.split('q=')[1] : baseUrl;
      const apiUrl = `${cleanUrl}?key=${apiKey}`;

      const systemPrompt = `You are "unfold," a supportive and empathetic AI companion. Your primary role is to be a non-judgmental listener. Use techniques from active listening and motivational interviewing. Ask clarifying questions, validate feelings (e.g., "It sounds like that was really difficult"), and gently guide the user to explore their thoughts. Do not give direct advice unless explicitly asked. Keep responses concise and conversational.`;
      
      const payload = {
        contents: [{ parts: [{ text: inputMessage }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];
      const aiText = candidate?.content?.parts?.[0]?.text || "I'm not sure how to respond to that. Could you try rephrasing?";
      
      const aiResponse = { text: aiText, sender: 'ai' };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <ChatWrapper>
        <MessageList ref={messageListRef}>
          {messages.map((msg, index) => 
            msg.sender === 'user' ? (
              <UserMessage key={index}>{msg.text}</UserMessage>
            ) : (
              <AiMessage key={index}>{msg.text}</AiMessage>
            )
          )}
          {isLoading && <TypingIndicator>typing...</TypingIndicator>}
        </MessageList>
        <InputContainer onSubmit={handleSendMessage}>
          <Input 
            type="text" 
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading}>
            <Send size={20} />
          </SendButton>
        </InputContainer>
      </ChatWrapper>
    </PageContainer>
  );
};

export default AiCounsellor;

