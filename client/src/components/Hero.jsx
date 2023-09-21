import HeroCard from "./HeroCard"
import SurveyBox from "./SurveyBox"

const Hero = ({ api }) => {
  return (
    <div>
      {/* Display the hero card */}
      <HeroCard api={api} />
      
      {/* Display the survey box */}
      <SurveyBox api={api} />
    </div>
  );
};

export default Hero