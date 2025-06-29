@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import SectionTitle from '../components/SectionTitle';
 import ServiceCard from '../components/cards/ServiceCard';
 import ProjectCard from '../components/cards/ProjectCard';
 import ModelCard from '../components/cards/ModelCard';
 import { USER_INTERESTS_SERVICES, INSPIRED_PROJECTS_DATA, BEST_AI_MODELS_DATA, DEFAULT_USER } from '../constants';
 import { getAiRecommendations, getInspiredProjects, getBestAiModels } from '../services/geminiService'; // Simulated
 import { Recommendation, Project, AiModel, FirebaseUser } from '../types';
 import { Icon } from '../components/Icons';