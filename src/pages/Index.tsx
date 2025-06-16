
import { useState } from 'react';
import { Upload, FileText, User, Briefcase, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  name: string;
  skills: string[];
  experience: string[];
  education: string;
  jobRole?: string;
}

interface Question {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'hr';
  category: string;
}

const Index = () => {
  const [step, setStep] = useState<'upload' | 'config' | 'interview' | 'complete'>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [interviewType, setInterviewType] = useState<string>('mixed');
  const [experienceLevel, setExperienceLevel] = useState<string>('mid');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate resume parsing
      setTimeout(() => {
        const mockResumeData: ResumeData = {
          name: "Alex Johnson",
          skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"],
          experience: [
            "Senior Frontend Developer at TechCorp (2021-2024)",
            "Full Stack Developer at StartupXYZ (2019-2021)",
            "Junior Developer at WebAgency (2018-2019)"
          ],
          education: "Bachelor of Science in Computer Science, Tech University (2018)"
        };
        setResumeData(mockResumeData);
        setStep('config');
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been analyzed and parsed.",
        });
      }, 2000);
    }
  };

  const generateQuestions = () => {
    if (!resumeData) return;

    const questionBank: Question[] = [
      {
        id: 1,
        question: `I see you have experience with ${resumeData.skills.slice(0, 3).join(', ')}. Can you walk me through a challenging project where you used these technologies?`,
        type: 'technical',
        category: 'Experience'
      },
      {
        id: 2,
        question: "Tell me about yourself and what motivated you to pursue a career in technology.",
        type: 'behavioral',
        category: 'Introduction'
      },
      {
        id: 3,
        question: `You've been working as a ${resumeData.experience[0]?.split(' at ')[0] || 'developer'}. What do you consider your greatest professional achievement?`,
        type: 'behavioral',
        category: 'Achievement'
      },
      {
        id: 4,
        question: `How do you stay updated with new technologies, especially in ${resumeData.skills[0]} and ${resumeData.skills[1]}?`,
        type: 'technical',
        category: 'Learning'
      },
      {
        id: 5,
        question: "Describe a time when you had to work with a difficult team member. How did you handle it?",
        type: 'behavioral',
        category: 'Teamwork'
      },
      {
        id: 6,
        question: `What interests you most about this role, and how does it align with your career goals?`,
        type: 'hr',
        category: 'Motivation'
      },
      {
        id: 7,
        question: `Can you explain the difference between ${resumeData.skills[0]} and ${resumeData.skills[1]}? When would you choose one over the other?`,
        type: 'technical',
        category: 'Technical Knowledge'
      }
    ];

    const filteredQuestions = interviewType === 'mixed' 
      ? questionBank.slice(0, 7)
      : questionBank.filter(q => q.type === interviewType).slice(0, 5);

    setQuestions(filteredQuestions);
    setStep('interview');
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    // Generate mock feedback
    const mockFeedback = generateFeedback(currentAnswer, questions[currentQuestionIndex]);
    setFeedback([...feedback, mockFeedback]);

    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('complete');
    }

    toast({
      title: "Answer submitted!",
      description: "Moving to the next question.",
    });
  };

  const generateFeedback = (answer: string, question: Question): string => {
    const feedbacks = [
      "Great answer! You provided specific examples and showed good technical knowledge.",
      "Good response. Consider adding more concrete examples to strengthen your answer.",
      "Well articulated. Your experience really shows through in this response.",
      "Nice answer. You could elaborate more on the impact of your actions.",
      "Excellent! You demonstrated both technical skills and soft skills effectively."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Interview Coach</h1>
            <p className="text-xl text-gray-600">Personalized mock interviews based on your resume</p>
          </div>

          {step === 'upload' && (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume to get started with a personalized interview experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Choose your resume file</h3>
                  <p className="text-gray-500 mb-4">PDF, DOC, or DOCX files supported</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button asChild>
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Select File
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'config' && resumeData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Resume Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{resumeData.name}</h3>
                      <p className="text-gray-600">{resumeData.education}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Experience:</h4>
                      <ul className="space-y-1">
                        {resumeData.experience.map((exp, index) => (
                          <li key={index} className="text-gray-600">• {exp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    Interview Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Interview Type</label>
                      <Select value={interviewType} onValueChange={setInterviewType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixed">Mixed (Technical + Behavioral + HR)</SelectItem>
                          <SelectItem value="technical">Technical Only</SelectItem>
                          <SelectItem value="behavioral">Behavioral Only</SelectItem>
                          <SelectItem value="hr">HR Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience Level</label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateQuestions} className="w-full">
                      Start Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'interview' && questions.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6" />
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <Badge variant="outline">{questions[currentQuestionIndex].category}</Badge>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Interview Question:</h3>
                      <p className="text-gray-800">{questions[currentQuestionIndex].question}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Answer:</label>
                      <Textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="min-h-32"
                      />
                    </div>
                    <Button 
                      onClick={submitAnswer} 
                      disabled={!currentAnswer.trim()}
                      className="w-full"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {feedback.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feedback.map((fb, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Question {index + 1} Feedback:</p>
                          <p className="text-green-700">{fb}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {step === 'complete' && (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Interview Complete!
                </CardTitle>
                <CardDescription>
                  Great job! Here's a summary of your interview performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.floor(Math.random() * 15) + 80}%
                    </div>
                    <p className="text-gray-600">Overall Performance Score</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Detailed Feedback:</h3>
                    <div className="space-y-3">
                      {feedback.map((fb, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Q{index + 1}: {questions[index]?.category}
                          </p>
                          <p className="text-gray-700">{fb}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setStep('upload');
                        setResumeData(null);
                        setQuestions([]);
                        setAnswers([]);
                        setFeedback([]);
                        setCurrentQuestionIndex(0);
                        setCurrentAnswer('');
                      }}
                      className="w-full"
                    >
                      Start New Interview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
