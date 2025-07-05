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

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to {APP_NAME}</h1>
      <p>Landing page functionality coming soon...</p>
    </div>
  );
}