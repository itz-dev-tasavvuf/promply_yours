@@ .. @@
 import React, { useState } from 'react';
 import { FirebaseUser, ResumeOptimizationResult } from '../types';
 import { Icon, IconType } from '../components/Icons';
 import Button from '../components/Button';
 import SectionTitle from '../components/SectionTitle';
 import { optimizeResumeAndGenerateCoverLetter } from '../services/geminiService';
 import ReactMarkdown from 'https://esm.sh/react-markdown@9';
 import remarkGfm from 'https://esm.sh/remark-gfm@4'

export default remarkGfm