import styled from "styled-components";
import Hero from "./components/Hero";
import Footer from "./components/Footer"
import Gateway from "./components/CoreRecovery/Gateway";
import Gateway2 from "./components/AiCounsellor/Gateway";
import Gateway3 from "./components/Community/Gateway";
import Gateway4 from "./components/RescourceSkills/Gateway";


const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  color: white;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  scroll-snap-align: start; /* Ensures the section aligns on scroll */
`;

const App = () => {
  return (
    <Container>
      
      <Section id="home">
        <Hero />
      </Section>

      <Section>
        <Gateway />
      </Section>

      <Section>
        <Gateway2 />
      </Section>

      <Section>
        <Gateway3/>
      </Section>

      <Section>
        <Gateway4 />
      </Section>
     


      <Section id="footer">
        <Footer />
      </Section>  

      
 

    </Container>
  );
};

export default App;
    