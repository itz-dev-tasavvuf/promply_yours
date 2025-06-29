@@ .. @@
 import React, { useState, useRef, useEffect } from 'react';
 import { FirebaseUser, ContentPlanStep } from '../types';
 import { Icon } from '../components/Icons';
 import Button from '../components/Button';
 import SectionTitle from '../components/SectionTitle';
 import { generateStructuredContentPlan, generateTextWithGemini } from '../services/geminiService';

export default SectionTitle