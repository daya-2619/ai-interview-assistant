export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  rawText: string;
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  // For now, we'll return a mock implementation since pdf-parse doesn't work in browsers
  // In a real implementation, you would use a browser-compatible PDF parser like PDF.js
  return new Promise((resolve) => {
    // Simulate PDF parsing delay
    setTimeout(() => {
      // Mock extracted text - in reality, this would come from PDF parsing
      const mockText = `
        John Doe
        Software Engineer
        john.doe@email.com
        (555) 123-4567
        
        Experience:
        - 5 years in React development
        - Full stack developer
        - JavaScript, TypeScript, Node.js
      `;
      resolve(mockText);
    }, 1000);
  });
};

export const extractTextFromDOCX = async (file: File): Promise<string> => {
  // For DOCX files, we'll show a message that it's not fully supported yet
  // In a real implementation, you would use a proper DOCX parsing library
  throw new Error('DOCX parsing is not fully implemented yet. Please use PDF files for now.');
};

export const parseResumeData = async (file: File): Promise<ParsedResumeData> => {
  let text = '';
  
  if (file.type === 'application/pdf') {
    text = await extractTextFromPDF(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  // Extract name, email, and phone using regex patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\([0-9]{3}\)\s[0-9]{3}-[0-9]{4})|(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|([0-9]{3})[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  
  // Extract email
  const emailMatches = text.match(emailRegex);
  const email = emailMatches ? emailMatches[0] : '';
  
  console.log('Email extraction debug:', {
    emailMatches: emailMatches,
    extractedEmail: email
  });
  
  // Extract phone
  const phoneMatches = text.match(phoneRegex);
  const phone = phoneMatches ? phoneMatches[0] : '';
  
  console.log('Phone extraction debug:', {
    text: text,
    phoneRegex: phoneRegex,
    phoneMatches: phoneMatches,
    extractedPhone: phone
  });
  
  // Extract name (first line or first few words)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  let name = '';
  
  // Try to find name in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip lines that look like headers or contain common resume keywords
    if (!line.toLowerCase().includes('resume') && 
        !line.toLowerCase().includes('cv') &&
        !line.toLowerCase().includes('phone') &&
        !line.toLowerCase().includes('email') &&
        !line.toLowerCase().includes('software') &&
        !line.toLowerCase().includes('engineer') &&
        !line.toLowerCase().includes('developer') &&
        line.length > 2 && line.length < 50) {
      name = line;
      break;
    }
  }

  const result = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    rawText: text
  };
  
  console.log('Final extraction result:', result);
  
  return result;
};
