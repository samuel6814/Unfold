import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Star } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  /* MODIFIED: Gradient flipped to pink on top, blue on bottom */
  background: linear-gradient(5deg, rgba(200, 215, 230, 1) 0%, rgba(255, 224, 240, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const TestimonialsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 6vw, 4.5rem);
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const Quote = styled.p`
  font-style: italic;
  color: #333;
  line-height: 1.7;
  flex-grow: 1;
  margin: 0 0 1.5rem 0;

  &::before {
    content: '"';
    margin-right: 0.25rem;
  }
  &::after {
    content: '"';
    margin-left: 0.25rem;
  }
`;

const Author = styled.p`
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  color: #000;
  margin: 0;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

// Mock data for testimonials
const testimonials = [
  {
    quote: "Unfold gave me a safe space to just be. The AI companion is surprisingly understanding, and the community hub reminded me I'm not alone in this.",
    author: "Anonymous User",
    rating: 5,
  },
  {
    quote: "Tracking my habits and moods seemed small at first, but seeing the progress over a month was a huge motivator. It’s the first tool that’s actually stuck with me.",
    author: "Anonymous User",
    rating: 5,
  },
  {
    quote: "The guided journal prompts are a game-changer. They help me untangle thoughts I didn't even know I had. I feel lighter after using it.",
    author: "Anonymous User",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <TestimonialsWrapper>
          <Title>Stories of Recovery</Title>
          <Subtitle>
            Read what others are saying about their journey with Unfold. Every story is a testament to the power of taking the first step.
          </Subtitle>
          <TestimonialsGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <RatingContainer>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} color="#FFC107" fill="#FFC107" />
                  ))}
                </RatingContainer>
                <Quote>{testimonial.quote}</Quote>
                <Author>- {testimonial.author}</Author>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </TestimonialsWrapper>
      </PageContainer>
    </>
  );
};

export default Testimonials;

