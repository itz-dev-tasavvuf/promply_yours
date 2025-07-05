import React, { useState, useRef, useEffect } from 'react';
import { FirebaseUser, ContentPlanStep } from '../types';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { generateStructuredContentPlan, generateTextWithGemini } from '../services/geminiService';

export default function ContentWriterPage({ currentUser }: { currentUser: FirebaseUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Content Writer</h1>
      <p>Content writer functionality coming soon...</p>
    </div>
  );
}