import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FileText, PlayCircle, Music } from 'lucide-react';
import Navbar from '../Navbar';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const LibraryWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 6vw, 2.5rem);
  color: #1a1a1a;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  background-color: ${props => props.active ? '#333' : 'rgba(255, 255, 255, 0.5)'};
  color: ${props => props.active ? '#fff' : '#333'};
  transition: all 0.2s ease-in-out;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ResourceCard = styled(Link)`
  background: #fff;
  border-radius: 15px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;

  h3 {
    font-family: 'Montserrat', sans-serif;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
`;

// Mock data for the resources. In a real app, this would come from a database.
const resources = [
  { id: 1, type: 'Article', title: 'Understanding Anxiety', description: 'Learn about the common types of anxiety and how to identify them.', icon: FileText, link: '#' },
  { id: 2, type: 'Video', title: '5-Minute Guided Meditation', description: 'A short video to help you find calm and focus your mind.', icon: PlayCircle, link: '#' },
  { id: 3, type: 'Article', title: 'The Power of Self-Compassion', description: 'Explore why being kind to yourself is a crucial part of recovery.', icon: FileText, link: '#' },
  { id: 4, type: 'Audio', title: 'Calming Soundscape', description: 'Listen to this soothing audio track to reduce stress and relax.', icon: Music, link: '#' },
  { id: 5, type: 'Article', title: 'Setting Healthy Boundaries', description: 'A practical guide on how to protect your energy and peace.', icon: FileText, link: '#' },
  { id: 6, type: 'Video', title: 'Yoga for Stress Relief', description: 'Follow along with this gentle yoga routine designed to release tension.', icon: PlayCircle, link: '#' },
];

const ResourceLibrary = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredResources = resources.filter(resource => 
    activeFilter === 'All' || resource.type === activeFilter
  );

  return (
    <>
      <Navbar />
      <PageContainer>
        <LibraryWrapper>
          <Header>
            <Title>Resource Library</Title>
            <FilterTabs>
              <TabButton active={activeFilter === 'All'} onClick={() => setActiveFilter('All')}>All</TabButton>
              <TabButton active={activeFilter === 'Article'} onClick={() => setActiveFilter('Article')}>Articles</TabButton>
              <TabButton active={activeFilter === 'Video'} onClick={() => setActiveFilter('Video')}>Videos</TabButton>
              <TabButton active={activeFilter === 'Audio'} onClick={() => setActiveFilter('Audio')}>Audio</TabButton>
            </FilterTabs>
          </Header>
          <ResourceGrid>
            {filteredResources.map(resource => {
              const Icon = resource.icon;
              return (
                <ResourceCard key={resource.id} to={resource.link}>
                  <CardContent>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Icon size={18} /> {resource.type}
                  </CardFooter>
                </ResourceCard>
              );
            })}
          </ResourceGrid>
        </LibraryWrapper>
      </PageContainer>
    </>
  );
};

export default ResourceLibrary;

