import React, { useState } from 'react';
import { FirebaseUser, ResumeOptimizationResult } from '../types';
import { Icon, IconType } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { optimizeResumeAndGenerateCoverLetter } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

export default function ResumeBuilderPage({ currentUser }: { currentUser: FirebaseUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
      <p>Resume builder functionality coming soon...</p>
    </div>
  );
}