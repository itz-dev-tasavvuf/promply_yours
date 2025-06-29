@@ .. @@
 import React, { useState, useRef, useEffect, useCallback } from 'react';
 import { FirebaseUser, PredefinedModelType, ExtractionResult, ExtractedField } from '../types';
 import { Icon } from '../components/Icons';
 import Button from '../components/Button';
 import SectionTitle from '../components/SectionTitle';
 import { extractDataFromDocument } from '../services/geminiService';
 import { useDropzone } from 'react-dropzone-esm';

export default SectionTitle