import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/cards/ServiceCard';
import ProjectCard from '../components/cards/ProjectCard';
import ModelCard from '../components/cards/ModelCard';
import { USER_INTERESTS_SERVICES, INSPIRED_PROJECTS_DATA, BEST_AI_MODELS_DATA, DEFAULT_USER } from '../constants';
import { getAiRecommendations, getInspiredProjects, getBestAiModels } from '../services/geminiService';
import { Recommendation, Project, AiModel, FirebaseUser } from '../types';
import { Icon } from '../components/Icons';

export default function DashboardPage({ currentUser }: { currentUser: FirebaseUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <p>Dashboard functionality coming soon...</p>
    </div>
  );
}