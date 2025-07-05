import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone-esm';
import { FirebaseUser, WebAppConfig, MiniGameType, CrashConfig, MinesConfig, Slot777Config, BalloonPumpConfig } from '../types';
import { Icon, IconType } from '../components/Icons';
import Button from '../components/Button';
import { generateLogoPromptForGemini } from '../services/geminiService';
import { saveArcadeConfig } from '../services/configService';

export default function ChatbotBuilderPage({ currentUser }: { currentUser: FirebaseUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Chatbot Builder</h1>
      <p>Chatbot builder functionality coming soon...</p>
    </div>
  );
}