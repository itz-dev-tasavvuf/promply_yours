import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import StepCard from '../components/cards/StepCard';
import FeatureCard from '../components/cards/FeatureCard';
import ProjectCard from '../components/cards/ProjectCard';
import { HOW_IT_WORKS_STEPS, WHY_CHOOSE_US_POINTS, TESTIMONIALS_DATA, APP_NAME } from '../constants';
import { Icon } from '../components/Icons';
import { useAuth } from '../App'; 

const LandingPage: React.FC = () => {
  const { isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-orange-100 via-yellow-50 to-sky-100 dark:from-orange-800/30 dark:via-yellow-900/30 dark:to-sky-900/30 text-neutral-800 dark:text-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-2 mb-4 bg-white/50 dark:bg-neutral-700/50 rounded-full shadow-lg backdrop-blur-sm">
            <Icon icon="SparklesIcon" className="w-16 h-16 mx-auto text-orange-500 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-neutral-900 dark:text-white">
            Unlock AI-Powered Efficiency with {APP_NAME}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-neutral-700 dark:text-neutral-300">
            Get tasks done effortlessly with our curated selection of AI tools. Pay per task, not per month.
          </p>
           <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">(Login/Sign Up button is in the header)</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-neutral-950/70">
        <div className="container mx-auto px-4">
          <SectionTitle title="How It Works" subtitle={`A simple 3-step process to get your AI tasks done with ${APP_NAME}.`} />
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us? Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-neutral-900/70">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose Us?" subtitle="Discover the advantages of using our task-based AI service marketplace." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US_POINTS.map((point) => (
              <FeatureCard key={point.id} feature={point} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Success Stories Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-neutral-950/70">
        <div className="container mx-auto px-4">
          <SectionTitle title="Loved by Innovators" subtitle="See how others are leveraging AI to achieve amazing results." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <ProjectCard key={testimonial.id} item={testimonial} type="testimonial" />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-orange-100 dark:text-orange-50">
                Join {APP_NAME} today and tap into the power of AI without the commitment of subscriptions.
            </p>
            <Button onClick={goToLogin} size="lg" variant="light" className="shadow-lg hover:shadow-xl transform hover:scale-105" isLoading={isLoadingAuth} disabled={isLoadingAuth}>
                {isLoadingAuth ? 'Loading...' : `Sign Up & Explore AI Tools`}
            </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;