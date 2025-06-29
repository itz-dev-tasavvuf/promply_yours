@@ .. @@
 import React, { useState, useRef, useEffect } from 'react';
 import { FirebaseUser, ProofreadingResult, SuggestionType } from '../types';
 import { Icon } from '../components/Icons';
 import Button from '../components/Button';
 import SectionTitle from '../components/SectionTitle';
 import { proofreadTextWithGemini } from '../services/geminiService';