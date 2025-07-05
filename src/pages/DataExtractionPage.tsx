import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FirebaseUser, PredefinedModelType, ExtractionResult, ExtractedField } from '../types';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { extractDataFromDocument } from '../services/geminiService';
import { useDropzone } from 'react-dropzone-esm';

export default function DataExtractionPage({ currentUser }: { currentUser: FirebaseUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Extraction</h1>
      <p>Data extraction functionality coming soon...</p>
    </div>
  );
}