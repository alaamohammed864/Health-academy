/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  Bell, 
  User, 
  LayoutDashboard, 
  GraduationCap, 
  Database, 
  HelpCircle, 
  Settings, 
  Bot, 
  Activity, 
  Network, 
  Stethoscope, 
  BrainCircuit,
  ShieldCheck,
  MonitorSmartphone, 
  Video, 
  ChevronLeft, 
  ChevronRight,
  Star,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  Sparkles,
  Loader2,
  X,
  MessageCircle,
  FileText,
  Paperclip,
  Award,
  Download,
  Printer,
  Eye,
  EyeOff,
  Sliders,
  BookOpen,
  Wifi,
  WifiOff,
  CloudDownload,
  CheckCircle,
  FileDown,
  Megaphone,
  Calendar,
  Microscope,
  HeartPulse,
  Microchip,
  Lock,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService, LearningPath } from './services/aiService';

const initialTestimonials = [
  {
    id: 1,
    text: "غيرت المنصة مساري المهني تماماً. الأدوات والتقنيات التي تعلمتها هنا هي ما أستخدمه يومياً في تطوير أنظمة المستشفيات الحديثة.",
    author: "م. سارة أحمد",
    role: "مطورة تقنيات صحية (HealthTech Developer)",
    rating: 5
  },
  {
    id: 2,
    text: "المحتوى التعليمي دقيق ومواكب لأحدث المعايير العالمية في السجلات الصحية الإلكترونية. تجربة تعليمية لا تضاهى.",
    author: "د. خالد منصور",
    role: "عالم بيانات سريرية (Clinical Data Scientist)",
    rating: 5
  },
  {
    id: 3,
    text: "أفضل ما في المنصة هو التركيز على الجانب العملي والذكاء الاصطناعي في التشخيص. هذا هو المستقبل الحقيقي للطب.",
    author: "ليلى يوسف",
    role: "أخصائية ذكاء اصطناعي طبي",
    rating: 5
  }
];

export default function App() {
  const [allTestimonials, setAllTestimonials] = useState(initialTestimonials);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Feedback Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // AI Tutor State
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [docContext, setDocContext] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Learning Path State
  const [interests, setInterests] = useState("");
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<LearningPath | null>(null);

  // Certificate State
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(45);
  
  const [modulesProgress, setModulesProgress] = useState<Record<string, number>>({
    'أساسيات السجلات الصحية': 85,
    'الأمن السيبراني الطبي': 20,
    'تحليل البيانات السريرية': 0,
    'الذكاء الاصطناعي التشخيصي': 10
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'البادئ المتحمس', desc: 'أكملت أول درس لك', icon: Award, unlocked: true },
    { id: 2, title: 'خبير السجلات', desc: 'أكمل موديول السجلات الصحية', icon: ShieldCheck, unlocked: false },
    { id: 3, title: 'المتواصل الدائم', desc: 'سجل دخول لمدة ٧ أيام متتالية', icon: Star, unlocked: true },
    { id: 4, title: 'المنقذ الرقمي', desc: 'أكمل دورة الأمن السيبراني', icon: Lock, unlocked: false },
  ]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>(["أساسيات السجلات الصحية"]);
  const [downloadingProgress, setDownloadingProgress] = useState<Record<string, number>>({});
  const [showConnectivityToast, setShowConnectivityToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowConnectivityToast(true);
      setTimeout(() => setShowConnectivityToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowConnectivityToast(true);
      setTimeout(() => setShowConnectivityToast(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDownload = (title: string) => {
    if (downloadedLessons.includes(title)) {
      setDownloadedLessons(prev => prev.filter(t => t !== title));
      return;
    }

    if (downloadingProgress[title] !== undefined) return;

    // Start simulated download
    setDownloadingProgress(prev => ({ ...prev, [title]: 0 }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadedLessons(prev => [...prev, title]);
        setTimeout(() => {
          setDownloadingProgress(prev => {
            const next = { ...prev };
            delete next[title];
            return next;
          });
        }, 1500);
      }
      setDownloadingProgress(prev => ({ ...prev, [title]: progress }));
    }, 400);
  };

  // Customization State
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    stats: true,
    modules: true,
    aiPath: true,
    course: true,
    feedback: true,
    testimonials: true,
    news: true,
    achievements: true
  });

  const [sidebarItems, setSidebarItems] = useState([
    { id: 'dashboard', iconName: 'LayoutDashboard', label: "لوحة التحكم", active: true },
    { id: 'education', iconName: 'GraduationCap', label: "البرامج التعليمية" },
    { id: 'data', iconName: 'Database', label: "البيانات الطبية" },
    { id: 'tests', iconName: 'HelpCircle', label: "الاختبارات" },
    { id: 'settings', iconName: 'Settings', label: "الإعدادات" },
  ]);

  const availableIcons = {
    LayoutDashboard,
    GraduationCap,
    Database,
    HelpCircle,
    Settings,
    Activity,
    BrainCircuit,
    Stethoscope,
    ShieldCheck,
    Network,
    Bot,
    Star,
    Award,
    BookOpen,
    FileText,
    MessageCircle,
    Bell,
    User,
    Megaphone,
    Calendar,
    Microscope,
    HeartPulse,
    Microchip,
    Lock
  };

  const updateSidebarIcon = (itemId: string, newIconName: string) => {
    setSidebarItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, iconName: newIconName } : item
    ));
  };

  const toggleWidget = (id: keyof typeof visibleWidgets) => {
    setVisibleWidgets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const handleSubmitFeedback = (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("يرجى اختيار التقييم بالنجوم");
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        text: suggestion || "تجربة تعليمية رائعة ومفيدة جداً لنظام مدار الصحة.",
        author: userName || "مستخدم جديد",
        role: userRole || "ممارس صحي",
        rating: rating
      };
      
      setAllTestimonials([newFeedback, ...allTestimonials]);
      setActiveTestimonial(0);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset Form
      setRating(0);
      setSuggestion("");
      setUserName("");
      setUserRole("");
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setIsChatLoading(true);

    try {
      const result = await aiService.chatWithTutor(userMsg, docContext || undefined, chatHistory);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: result || "" }] }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى." }] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocContext(content);
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: `تم رفع المستند: "${file.name}". كيف يمكنني مساعدتك في تحليله أو تلخيصه؟` }] 
      }]);
    };
    reader.readAsText(file);
  };

  const handleGeneratePath = async (e: FormEvent) => {
    e.preventDefault();
    if (!interests.trim() || isGeneratingPath) return;

    setIsGeneratingPath(true);
    try {
      const result = await aiService.generateLearningPath(interests);
      setGeneratedPath(result);
    } catch (error) {
      console.error(error);
      alert("فشل في إنشاء مسار تعليمي. حاول مرة أخرى.");
    } finally {
      setIsGeneratingPath(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-teal/30 selection:text-brand-teal">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-lg px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="text-2xl font-display font-black text-brand-teal tracking-tight">
          مدار الصحة
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-teal transition-colors" 
              size={18} 
            />
            <input 
              type="text" 
              placeholder="ابحث عن دورات، موديولات، أو معلومات..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-12 pl-4 text-sm text-slate-200 focus:outline-none focus:border-brand-teal/50 focus:bg-white/10 transition-all text-right"
            />
          </div>
        </div>
        
        <div className="hidden md:flex gap-8">
          <a href="#" className="text-sm font-medium text-brand-teal border-b-2 border-brand-teal pb-1">الرئيسية</a>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-brand-teal transition-colors">المسارات التعليمية</a>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-brand-teal transition-colors">الامتثال</a>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-brand-teal transition-colors">الذكاء الاصطناعي</a>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-brand-teal transition-colors">خارطة الطريق</a>
        </div>

        <div className="flex items-center gap-4 text-brand-teal">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </nav>

      {/* Sidebar - Visible on Desktop */}
      <aside className="hidden lg:flex fixed right-4 top-24 bottom-4 w-72 glass-panel rounded-2xl flex-col py-8 z-40 overflow-hidden">
        <div className="px-6 mb-10 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-high mx-auto mb-4 border-2 border-brand-teal/20 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop" 
              alt="Doctor Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-brand-teal font-display font-bold text-xl">د. أحمد علي</h3>
          <p className="text-slate-400 text-xs mt-1">أخصائي تقنية المعلومات الصحية</p>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = availableIcons[item.iconName as keyof typeof availableIcons] || LayoutDashboard;
            return (
              <a 
                key={item.id}
                href="#" 
                className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 ${
                  item.active 
                    ? 'bg-brand-teal/10 text-brand-teal border-r-4 border-brand-teal' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="px-6 mt-auto">
          <button className="w-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-brand-teal/20 transition-all font-medium text-sm group">
            <Bot size={18} className="group-hover:scale-110 transition-transform" />
            تواصل مع مساعد AI
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pr-[19.5rem] pt-32 px-6 md:px-12 pb-24">
        <header className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white/95">
              لوحة <span className="text-brand-teal">المواكبة</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
              أهلاً د. {userName || "أحمد"}، رحلتك في التميز التقني الطبي تبدأ من هنا.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
             <button 
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                isCustomizing 
                  ? 'bg-brand-teal text-surface-deep border-brand-teal' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-brand-teal/50'
              }`}
             >
                <Sliders size={18} />
                تخصيص اللوحة
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isCustomizing && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 glass-panel rounded-3xl p-6 border border-brand-teal/30 bg-brand-teal/5 relative z-20"
            >
              <h3 className="text-brand-teal font-display font-black mb-6 flex items-center gap-2">
                <Sliders size={18} />
                تخصيص الواجهة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'stats', label: 'الإحصائيات', icon: Activity },
                  { id: 'modules', label: 'الموديولات', icon: BookOpen },
                  { id: 'aiPath', label: 'مسار الذكاء', icon: Bot },
                  { id: 'news', label: 'أحدث الأخبار', icon: Megaphone },
                  { id: 'achievements', label: 'الإنجازات', icon: Award },
                  { id: 'course', label: 'محتوى الدرس', icon: GraduationCap },
                  { id: 'feedback', label: 'الآراء', icon: MessageSquarePlus },
                  { id: 'testimonials', label: 'قصص النجاح', icon: Star },
                ].map((widget) => (
                  <button 
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                      visibleWidgets[widget.id as keyof typeof visibleWidgets]
                        ? 'bg-brand-teal/20 border-brand-teal/40 text-brand-teal'
                        : 'bg-white/5 border-transparent text-slate-500 opacity-60'
                    }`}
                  >
                    <widget.icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{widget.label}</span>
                    {visibleWidgets[widget.id as keyof typeof visibleWidgets] ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                ))}
              </div>

              {/* Sidebar Icon Customization */}
              <div className="mt-10 pt-10 border-t border-brand-teal/20">
                <h4 className="text-brand-teal font-display font-medium mb-6 text-sm">تخصيص أيقونات القائمة الجانبية</h4>
                <div className="space-y-6">
                  {sidebarItems.map((sItem) => (
                    <div key={sItem.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3 w-48">
                         <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                            {(() => {
                              const Icon = availableIcons[sItem.iconName as keyof typeof availableIcons] || LayoutDashboard;
                              return <Icon size={20} />;
                            })()}
                         </div>
                         <span className="text-sm font-bold text-slate-300">{sItem.label}</span>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {Object.keys(availableIcons).map((iconKey) => {
                          const IconComp = availableIcons[iconKey as keyof typeof availableIcons];
                          return (
                            <button
                              key={iconKey}
                              onClick={() => updateSidebarIcon(sItem.id, iconKey)}
                              className={`p-2 rounded-lg transition-all ${
                                sItem.iconName === iconKey 
                                  ? 'bg-brand-teal text-surface-deep shadow-lg' 
                                  : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                              }`}
                              title={iconKey}
                            >
                              <IconComp size={16} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          <motion.section 
            key="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-20"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-panel rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-teal/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full" />

              <div className="flex flex-col xl:flex-row gap-12 items-center relative z-10">
                <div className="flex-1 space-y-8">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-xs font-semibold border border-brand-teal/20 shadow-[0_0_20px_rgba(67,224,206,0.1)]"
                  >
                    <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
                    منصة تفاعلية
                  </motion.span>
                  
                  <h1 className="text-5xl md:text-6xl font-display font-black leading-tight text-gradient">
                    مستقبل التعليم <br /> الطبي الرقمي
                  </h1>
                  
                  <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                    منصة تعليمية متطورة مصممة للمتخصصين في الرعاية الصحية، تجمع بين التكنولوجيا المتقدمة والمعرفة الطبية العميقة في بيئة تفاعلية آمنة.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="bg-brand-teal text-surface-deep px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(67,224,206,0.4)] transition-all transform hover:-translate-y-1">
                      ابدأ التعلم الآن
                    </button>
                    <button className="border border-white/10 text-slate-200 px-8 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all">
                      استكشف المسارات
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-md">
                  <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h4 className="text-white font-bold mb-1">تقدمك الحالي</h4>
                          <p className="text-slate-400 text-[10px] text-right">استمر، أنت تبلي بلاءً حسناً!</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                          <Activity size={24} />
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-8">
                        <div className="relative w-40 h-40">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle 
                              cx="80" cy="80" r="70" 
                              className="stroke-white/5 fill-none" 
                              strokeWidth="8"
                            />
                            <motion.circle 
                              cx="80" cy="80" r="70" 
                              className="stroke-brand-teal fill-none" 
                              strokeWidth="8"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: "0, 440" }}
                              animate={{ strokeDasharray: `${(completionProgress / 100) * 440}, 440` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-display font-black text-white">%{completionProgress}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">إنجاز كلي</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-brand-teal/20 transition-colors">
                          <div className="text-brand-teal font-black text-lg">٣/١٢</div>
                          <div className="text-slate-500 text-[10px] font-bold">موديولات مكتملة</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-brand-orange/20 transition-colors">
                          <div className="text-brand-orange font-black text-lg">{achievements.filter(a => a.unlocked).length}</div>
                          <div className="text-slate-500 text-[10px] font-bold">أوسمة مكتسبة</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {visibleWidgets.stats && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              >
                {[
                  { val: "+500", label: "برنامج تعليمي معتمد" },
                  { val: "+50,000", label: "ممارس صحي مسجل" },
                  { val: "98%", label: "نسبة الرضا العام" },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-2xl p-8 text-center border border-white/5 group transition-all"
                  >
                    <div className="text-4xl font-display font-black text-brand-teal mb-2 group-hover:text-brand-teal transition-colors">
                      {stat.val}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>

        {/* Achievements Section */}
        {visibleWidgets.achievements && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-24"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-black text-white flex items-center gap-3 text-right">
                <Award className="text-brand-teal" size={28} />
                الأوسمة والإنجازات
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
              {achievements.map((ach) => {
                const Icon = ach.icon;
                return (
                  <motion.div 
                    key={ach.id}
                    whileHover={{ scale: 1.05 }}
                    className={`glass-panel p-6 rounded-3xl border-2 transition-all group ${
                      ach.unlocked 
                        ? 'border-brand-teal/30 bg-brand-teal/5' 
                        : 'border-white/5 opacity-50 grayscale'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:rotate-12 ${
                      ach.unlocked ? 'bg-brand-teal/20 text-brand-teal' : 'bg-white/10 text-slate-500'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                      {ach.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {ach.desc}
                    </p>
                    {ach.unlocked && (
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-brand-teal">
                        <CheckCircle size={10} />
                        تم الاكتساب
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* System Updates / News Section */}
        {visibleWidgets.news && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-24"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-black text-white flex items-center gap-3 text-right">
                <Megaphone className="text-brand-orange" size={28} />
                تحديثات النظام والأخبار
              </h2>
              <button className="text-brand-teal text-sm font-bold hover:underline">مشاهدة الكل</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "إطلاق ميزة التشخيص المعزز بالذكاء الاصطناعي",
                  date: "٥ مايو ٢٠٢٤",
                  tag: "تحديث جديد",
                  color: "brand-teal",
                  desc: "تم دمج محرك التشخيص الجديد الذي يساعد في تحليل صور الأشعة بدقة تصل إلى ٩٩٪."
                },
                {
                  title: "صيانة مجدولة لقاعدة البيانات",
                  date: "٧ مايو ٢٠٢٤",
                  tag: "تنبيه",
                  color: "brand-orange",
                  desc: "سيكون هناك توقف قصير لمدة ١٥ دقيقة لإجراء تحديثات أمنية هامة الساعة ٢ صباحاً."
                },
                {
                  title: "إضافة موديول 'الأخلاقيات الطبية الرقمية'",
                  date: "١ مايو ٢٠٢٤",
                  tag: "دورة جديدة",
                  color: "brand-teal",
                  desc: "تعرف على القوانين الجديدة المنظمة للتعامل مع البيانات الطبية الحساسة في العصر الرقمي."
                }
              ].map((news) => (
                <motion.div 
                  key={news.title}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group text-right"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 blur-[40px] rounded-full`} />
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-brand-teal/10 text-brand-teal text-[10px] font-black px-3 py-1 rounded-full border border-brand-teal/20 uppercase tracking-tighter">
                      {news.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Calendar size={12} />
                      {news.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-black text-white mb-4 group-hover:text-brand-teal transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {news.desc}
                  </p>
                  <button className="flex items-center gap-2 text-brand-teal text-xs font-bold group-hover:gap-3 transition-all">
                    اقرأ المزيد
                    <ChevronLeft size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* AI Learning Path Generator */}
        {visibleWidgets.aiPath && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24"
          >
          <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 border border-brand-teal/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 space-y-6 text-right">
                <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-xs font-bold border border-brand-teal/20">
                  <Sparkles size={14} className="animate-pulse" />
                  اكتشف مسارك المخصص
                </div>
                <h2 className="text-4xl font-display font-black leading-tight text-gradient">
                  صمم رحلتك التعليمية <br /> بالذكاء الاصطناعي
                </h2>
                <p className="text-slate-400 text-lg">
                  أدخل اهتماماتك المهنية أو المواضيع التي ترغب في إتقانها، وسيقوم مساعدنا الذكي بإنشاء مسار تعليمي مخصص لك خلال ثوانٍ.
                </p>
                
                <form onSubmit={handleGeneratePath} className="relative mt-8 group">
                   <input 
                    type="text" 
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="مثال: الذكاء الاصطناعي في جراحة القلب، أو أمن البيانات الصحية..."
                    className="w-full bg-surface-deep/60 border border-white/10 rounded-2xl px-6 py-5 pr-14 text-slate-200 outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                   />
                   <Bot className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-teal/50 group-focus-within:text-brand-teal transition-colors" size={24} />
                   <button 
                    type="submit"
                    disabled={isGeneratingPath || !interests.trim()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-teal text-surface-deep px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                   >
                     {isGeneratingPath ? <Loader2 size={18} className="animate-spin" /> : "إنشاء المسار"}
                   </button>
                </form>
              </div>

              <div className="flex-1 w-full max-w-lg">
                 <AnimatePresence mode="wait">
                    {generatedPath ? (
                      <motion.div 
                        key="path"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-surface-deep/40 rounded-3xl border border-brand-teal/20 p-8 space-y-6"
                      >
                         <div className="flex items-center justify-between border-b border-brand-teal/10 pb-4">
                           <h3 className="font-display font-black text-brand-teal text-xl">{generatedPath.pathTitle}</h3>
                           <Sparkles size={20} className="text-brand-orange" />
                         </div>
                         <p className="text-slate-300 text-sm leading-relaxed">{generatedPath.summary}</p>
                         <div className="space-y-4">
                             {generatedPath.modules.map((m, idx) => (
                               <div key={m.title} className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 flex items-center justify-center shrink-0 font-bold text-xs">
                                  {idx + 1}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-brand-teal font-bold text-sm">{m.title}</h4>
                                  <p className="text-slate-500 text-xs">{m.description} • <span className="text-brand-orange/60">{m.duration}</span></p>
                                </div>
                              </div>
                            ))}
                         </div>
                         <button className="w-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 py-3 rounded-xl text-sm font-bold hover:bg-brand-teal hover:text-surface-deep transition-all mt-4">
                           بدء هذا المسار الآن
                         </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="placeholder"
                        className="h-full min-h-[300px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4"
                      >
                         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                           <Activity size={40} />
                         </div>
                         <p className="text-slate-500 text-sm max-w-[200px]">في انتظار مدخلاتك لإنشاء مسار تعلم ذكي فريد</p>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            </div>
          </div>
          </motion.section>
        )}

        {/* Enhanced Course Content Preview */}
        {visibleWidgets.course && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24"
          >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Lesson Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h4 className="text-brand-teal font-display font-black mb-6 flex items-center gap-2">
                  <GraduationCap size={20} />
                  فهرس المساق
                </h4>
                <div className="space-y-3">
                  {[
                    { title: "مقدمة في التحول الرقمي", completed: true },
                    { title: "أساسيات السجلات الصحية", active: true },
                    { title: "بروتوكولات الأمان السحابي", locked: false },
                    { title: "الذكاء الاصطناعي في الطب", locked: true },
                  ].map((lesson) => (
                    <motion.div 
                      key={lesson.title} 
                      whileHover={{ x: -4 }}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        lesson.active ? 'bg-brand-teal/10 border-brand-teal/30' : 'bg-white/5 border-transparent opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className={`text-sm font-bold truncate ${lesson.active ? 'text-brand-teal' : 'text-slate-300'}`}>{lesson.title}</span>
                        {downloadedLessons.includes(lesson.title) && (
                          <div className="flex items-center gap-1 text-[10px] text-brand-teal font-bold bg-brand-teal/10 px-1.5 py-0.5 rounded shrink-0">
                            <CheckCircle size={8} />
                            جاهز
                          </div>
                        )}
                        {downloadingProgress[lesson.title] !== undefined && (
                          <div className="flex-1 flex flex-col gap-1 items-end">
                             <div className="flex items-center gap-1 text-[8px] text-brand-orange">
                               <Loader2 size={8} className="animate-spin" />
                               {downloadingProgress[lesson.title]}%
                             </div>
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-brand-orange transition-all duration-300" 
                                  style={{ width: `${downloadingProgress[lesson.title]}%` }}
                                />
                             </div>
                          </div>
                        )}
                      </div>
                      {lesson.active && <ChevronLeft size={16} className="text-brand-teal" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Lesson Content Area */}
            <div className="flex-1 glass-panel rounded-[2.5rem] p-8 md:p-12 border border-white/5 space-y-10 text-right">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-orange font-bold text-xs uppercase tracking-widest">
                    <span className="bg-brand-orange/10 px-2 py-0.5 rounded">الوحدة الثانية</span>
                    <span className="w-1 h-1 bg-brand-orange/40 rounded-full" />
                    <span>١٥ دقيقة للقراءة</span>
                    <span className="w-1 h-1 bg-brand-orange/40 rounded-full" />
                    <span className="bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-md text-[10px]">مستوى متقدم</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-[1.2]">إدارة السجلات الصحية <br className="hidden md:block" /> الإلكترونية (EHR)</h2>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-teal font-black">{completionProgress}%</span>
                    <span className="text-[10px] text-slate-500 font-bold">تم الإنجاز</span>
                  </div>
                  <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionProgress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={`h-full transition-colors duration-500 ${completionProgress === 100 ? 'bg-brand-orange shadow-[0_0_15px_rgba(255,181,157,0.8)]' : 'bg-brand-teal shadow-[0_0_10px_rgba(67,224,206,0.5)]'}`}
                    />
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Medical Tech"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/10 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileActive={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-brand-teal text-surface-deep flex items-center justify-center shadow-2xl"
                  >
                    <Video size={32} />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-12 max-w-none text-right">
                <p className="text-slate-200 text-xl md:text-2xl leading-[1.8] font-medium text-pretty">
                  تعتبر السجلات الصحية الإلكترونية (EHR) العمود الفقري لأي نظام صحي حديث. فهي لا تقتصر فقط على رقمنة الملفات الورقية، بل هي نظام شامل لإدارة المعلومات السريرية، التاريخ الطبي، ونتائج المختبرات بطريقة تضمن التكامل والأمان العالي.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-10 bg-brand-teal/5 rounded-[2.5rem] border border-brand-teal/10 relative overflow-hidden group hover:bg-brand-teal/[0.08] transition-colors"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-teal/10 blur-[50px] rounded-full group-hover:bg-brand-teal/20 transition-all duration-500" />
                    <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-6">
                      <Network size={24} />
                    </div>
                    <h4 className="text-brand-teal font-display font-black text-2xl mb-4">التكامل السريري</h4>
                    <p className="text-slate-400 leading-[1.7] text-base">القدرة على مشاركة البيانات بين الأقسام المختلفة بالمستشفى بشكل فوري، مما يقلل من الأخطاء ويحسن جودة الرعاية.</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-10 bg-brand-orange/5 rounded-[2.5rem] border border-brand-orange/10 relative overflow-hidden group hover:bg-brand-orange/[0.08] transition-colors"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-orange/10 blur-[50px] rounded-full group-hover:bg-brand-orange/20 transition-all duration-500" />
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                      <Stethoscope size={24} />
                    </div>
                    <h4 className="text-brand-orange font-display font-black text-2xl mb-4">دقة التشخيص</h4>
                    <p className="text-slate-400 leading-[1.7] text-base">توفير وصول فوري وشامل للتاريخ المرضي يقلل من احتمالية التشخيص الخاطئ ويحسن نتائج الخطط العلاجية.</p>
                  </motion.div>
                </div>

                <div className="space-y-6 pt-6">
                  <h3 className="text-3xl font-display font-black text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-brand-teal rounded-full" />
                    المعايير الدولية (HL7 & FHIR)
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    لضمان تواصل الأنظمة المختلفة، يتم استخدام معايير مثل 
                    <span className="text-brand-teal mx-2 font-mono bg-brand-teal/5 px-2 py-1 rounded border border-brand-teal/10 shadow-sm">FHIR</span> 
                    التي تتيح تبادل البيانات الصحية عبر واجهات برمجة التطبيقات الحديثة. هذا يسهل على المطورين والأطباء بناء تطبيقات طبية متصلة وآمنة تماماً.
                  </p>
                </div>

                <div className="bg-surface-container rounded-3xl p-8 border-r-8 border-brand-teal shadow-inner">
                  <blockquote className="text-slate-200 leading-[1.8] italic text-xl font-medium">
                    "إن الانتقال إلى الأنظمة الرقمية لا يعني فقط استبدال الورق، بل يعني بناء ذكاء اصطناعي قادر على التنبؤ بالمخاطر الصحية وتخصيص العلاج لكل مريض على حدة بناءً على بياناته التاريخية."
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-400">كبير الأطباء، وحدة التحول الرقمي</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-10 border-t border-white/5">
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                  <span>الدرس السابق</span>
                </button>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      setIsLessonCompleted(true);
                      setCompletionProgress(100);
                      setModulesProgress(prev => ({
                        ...prev,
                        'أساسيات السجلات الصحية': 100
                      }));
                      setAchievements(prev => prev.map(a => 
                        a.id === 2 ? { ...a, unlocked: true } : a
                      ));
                      setTimeout(() => setShowCertificate(true), 1200);
                    }}
                    disabled={isLessonCompleted}
                    className={`px-8 py-3 rounded-xl font-bold transition-all shadow-xl flex items-center gap-2 ${
                      isLessonCompleted 
                        ? 'bg-brand-orange text-surface-deep cursor-default' 
                        : 'bg-brand-teal text-surface-deep hover:shadow-[0_0_20px_rgba(67,224,206,0.3)] hover:-translate-y-0.5'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <><CheckCircle2 size={18} /> مكتمل</>
                    ) : (
                      'تحديد كمكتمل'
                    )}
                  </button>

                  <button 
                    onClick={() => toggleDownload("أساسيات السجلات الصحية")}
                    disabled={downloadingProgress["أساسيات السجلات الصحية"] !== undefined}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 border relative overflow-hidden ${
                      downloadedLessons.includes("أساسيات السجلات الصحية")
                        ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal'
                        : downloadingProgress["أساسيات السجلات الصحية"] !== undefined
                          ? 'bg-brand-orange/5 border-brand-orange/30 text-brand-orange'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {downloadingProgress["أساسيات السجلات الصحية"] !== undefined && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadingProgress["أساسيات السجلات الصحية"]}%` }}
                        className="absolute inset-0 bg-brand-orange/10 pointer-events-none"
                      />
                    )}
                    
                    {downloadedLessons.includes("أساسيات السجلات الصحية") ? (
                      <><FileDown size={18} /> متاح أوفلاين</>
                    ) : downloadingProgress["أساسيات السجلات الصحية"] !== undefined ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>جاري التحميل... {downloadingProgress["أساسيات السجلات الصحية"]}%</span>
                      </>
                    ) : (
                      <><CloudDownload size={18} /> تحميل للأوفلاين</>
                    )}
                  </button>

                  {isLessonCompleted && (
                    <button 
                      onClick={() => setShowCertificate(true)}
                      className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-orange/20 transition-all"
                    >
                      <Award size={18} /> عرض الشهادة
                    </button>
                  )}
                  <button className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-slate-300">
                    <Star size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </motion.section>
        )}

        {/* Modules Grid */}
        {visibleWidgets.modules && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24"
          >
          <h2 className="text-3xl font-display font-black mb-10 pb-6 border-b border-white/5">
            الوحدات الأساسية
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* EHR - Big Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="md:col-span-8 rounded-3xl p-10 relative overflow-hidden group border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=1200&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" 
                alt="Medical Records"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/40 to-transparent" />
              
              <div className="relative h-full flex flex-col justify-end">
                <div className="flex justify-between items-end mb-6">
                  <div className="flex flex-col gap-4">
                    <Network size={48} className="text-brand-teal" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDownload('أساسيات السجلات الصحية');
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                        downloadedLessons.includes('أساسيات السجلات الصحية')
                          ? 'bg-brand-teal/20 border-brand-teal/30 text-brand-teal'
                          : downloadingProgress['أساسيات السجلات الصحية'] !== undefined
                            ? 'bg-brand-orange/20 border-brand-orange/30 text-brand-orange'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {downloadedLessons.includes('أساسيات السجلات الصحية') ? (
                        <><CheckCircle size={10} /> جاهز أوفلاين</>
                      ) : downloadingProgress['أساسيات السجلات الصحية'] !== undefined ? (
                        <><Loader2 size={10} className="animate-spin" /> جاري التحميل</>
                      ) : (
                        <><CloudDownload size={10} /> تحميل للأوفلاين</>
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-1">نسبة الإنجاز</div>
                    <div className="text-2xl font-display font-black text-white">%{modulesProgress['أساسيات السجلات الصحية'] || 0}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-black mb-2 text-white">السجلات الصحية الإلكترونية (EHR)</h3>
                <p className="text-slate-300 max-w-md mb-6">إدارة بيانات المرضى بكفاءة وأمان عاليين وفق المعايير العالمية.</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${modulesProgress['أساسيات السجلات الصحية']}%` }}
                    className="h-full bg-brand-teal"
                  />
                  {downloadingProgress['أساسيات السجلات الصحية'] !== undefined && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadingProgress['أساسيات السجلات الصحية']}%` }}
                      className="absolute inset-0 bg-brand-orange/40 h-1"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Vital Signs - Small Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="md:col-span-4 glass-panel rounded-3xl p-8 flex flex-col group border border-white/10"
            >
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start mb-6">
                  <Activity size={32} className="text-brand-orange" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDownload('مراقبة العلامات الحيوية');
                    }}
                    className={`p-2 rounded-xl border transition-all ${
                      downloadedLessons.includes('مراقبة العلامات الحيوية')
                        ? 'bg-brand-teal/20 border-brand-teal/30 text-brand-teal'
                        : downloadingProgress['مراقبة العلامات الحيوية'] !== undefined
                          ? 'bg-brand-orange/20 border-brand-orange/30 text-brand-orange'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                    }`}
                  >
                    {downloadedLessons.includes('مراقبة العلامات الحيوية') ? (
                      <CheckCircle size={16} />
                    ) : downloadingProgress['مراقبة العلامات الحيوية'] !== undefined ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CloudDownload size={16} />
                    )}
                  </button>
                </div>
                <h4 className="text-xl font-display font-bold mb-4">مراقبة العلامات الحيوية</h4>
              </div>
              <div className="flex items-end gap-1.5 h-16 w-full mb-4">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <motion.div 
                    key={`vital-bar-${i}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-brand-teal/40 rounded-t-md group-hover:bg-brand-teal transition-colors" 
                  />
                ))}
              </div>
            </motion.div>

            {/* AI Diagnosis - Small Card */}
            <motion.div 
                whileHover={{ y: -4 }}
                className="md:col-span-4 glass-panel rounded-3xl p-8 flex flex-col group border border-white/10 text-right"
            >
              <div className="flex justify-between items-start mb-6">
                <Stethoscope size={32} className="text-brand-teal" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDownload('تحليل البيانات السريرية');
                  }}
                  className={`p-2 rounded-xl border transition-all ${
                    downloadedLessons.includes('تحليل البيانات السريرية')
                      ? 'bg-brand-teal/20 border-brand-teal/30 text-brand-teal'
                      : downloadingProgress['تحليل البيانات السريرية'] !== undefined
                        ? 'bg-brand-orange/20 border-brand-orange/30 text-brand-orange'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                  }`}
                >
                  {downloadedLessons.includes('تحليل البيانات السريرية') ? (
                    <CheckCircle size={16} />
                  ) : downloadingProgress['تحليل البيانات السريرية'] !== undefined ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CloudDownload size={16} />
                  )}
                </button>
              </div>
              <h4 className="text-xl font-display font-bold mb-2">التشخيص المدعوم بـ AI</h4>
              <p className="text-slate-400 text-sm mt-auto">تحليل الصور الطبية بدقة وسرعة بفضل نماذج التعلم العميق المتخصصة.</p>
            </motion.div>

            {/* Telemedicine - Wide Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="md:col-span-8 glass-panel rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group cursor-pointer border border-white/10"
            >
               <div className="flex-1 text-right">
                  <h3 className="text-2xl font-display font-black mb-4">التطبيب عن بعد</h3>
                  <p className="text-slate-400 mb-6">تقديم الرعاية الصحية عن بعد باستخدام تقنيات الاتصال المرئي الآمنة والمشفرة.</p>
                  <button className="text-brand-teal font-bold flex items-center gap-2 group/btn">
                    <span>معرفة المزيد</span>
                    <ChevronLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
               </div>
               <div className="relative shrink-0">
                  <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center bg-white/5">
                    <Video size={48} className="text-brand-teal" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-dashed border-brand-teal/20 rounded-full"
                  />
               </div>
            </motion.div>
          </div>
          </motion.section>
        )}

        {/* Feedback Section */}
        {visibleWidgets.feedback && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24"
          >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-brand-teal/5 rounded-[2.5rem] p-8 md:p-12 border border-brand-teal/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 blur-[80px] rounded-full" />
            
            <div className="relative z-10 text-right space-y-6">
              <div className="inline-flex p-3 bg-brand-teal/10 rounded-2xl text-brand-teal mb-4">
                <MessageSquarePlus size={32} />
              </div>
              <h2 className="text-4xl font-display font-black text-gradient">شاركنا تجربتك</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                رأيك يساهم في بناء مستقبل التعليم الطبي. أخبرنا كيف كانت تجربتك مع المسارات التعليمية وما هي مقترحاتك للتحسين.
              </p>
              
              <div className="flex gap-8 py-4 border-t border-white/5">
                <div>
                  <div className="text-2xl font-display font-black text-brand-teal">١٥٠+</div>
                  <div className="text-xs text-slate-500">تقييم جديد هذا الأسبوع</div>
                </div>
                <div className="border-r border-white/10" />
                <div>
                  <div className="text-2xl font-display font-black text-brand-teal">٤.٩ / ٥</div>
                  <div className="text-xs text-slate-500">متوسط رضا المستخدمين</div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <form onSubmit={handleSubmitFeedback} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 relative">
                 <AnimatePresence>
                  {showSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-deep/95 backdrop-blur-sm rounded-3xl text-center p-6"
                    >
                      <CheckCircle2 size={64} className="text-brand-teal mb-4 animate-bounce" />
                      <h3 className="text-2xl font-display font-black text-white">تم استلام تقييمك بنجاح!</h3>
                      <p className="text-slate-400 mt-2">شكراً لمساهمتك في تطوير مدار الصحة.</p>
                    </motion.div>
                  )}
                 </AnimatePresence>

                 {/* Star Rating */}
                 <div className="space-y-3">
                   <label className="block text-sm font-medium text-slate-300">كيف تقيم تجربتك التعليمية؟</label>
                   <div className="flex flex-row-reverse justify-end gap-2">
                     {[5, 4, 3, 2, 1].map((s) => (
                       <button
                         key={s}
                         type="button"
                         onMouseEnter={() => setHoverRating(s)}
                         onMouseLeave={() => setHoverRating(0)}
                         onClick={() => setRating(s)}
                         className="transition-all transform hover:scale-110"
                       >
                         <Star 
                           size={32} 
                           className={`${
                             (hoverRating || rating) >= s 
                               ? 'fill-brand-teal text-brand-teal' 
                               : 'text-slate-600'
                           } transition-colors`} 
                         />
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Inputs */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-400 mr-1">الاسم الكامل</label>
                      <input 
                        type="text" 
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="د. سارة..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal/50 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-400 mr-1">التخصص / المسمى</label>
                      <input 
                        type="text" 
                        required
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        placeholder="جراح عام..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal/50 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400 mr-1">مقترحاتك للتحسين</label>
                    <textarea 
                      rows={3}
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="كيف يمكننا جعل المنصة أفضل بالنسبة لك؟"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal/50 focus:ring-0 transition-all outline-none resize-none"
                    />
                 </div>

                 <button 
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isSubmitting 
                      ? 'bg-slate-700 cursor-not-allowed' 
                      : 'bg-brand-teal text-surface-deep hover:shadow-[0_0_20px_rgba(67,224,206,0.3)]'
                  }`}
                 >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-surface-deep/30 border-t-surface-deep rounded-full animate-spin" />
                   ) : (
                     <><Send size={18} /> إرسال التقييم</>
                   )}
                 </button>
              </form>
            </div>
          </div>
          </motion.section>
        )}

        {/* Testimonials */}
        {visibleWidgets.testimonials && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24 py-20 relative px-4 text-center"
          >
            <div className="absolute inset-0 bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none" />
            
            <h2 className="text-4xl font-display font-black mb-6 text-gradient inline-block">قصص نجاح خريجينا</h2>
            <p className="text-slate-400 text-lg mb-16">نخبة من المبتكرين الذين يقودون التحول الرقمي في الرعاية الصحية</p>

            <div className="max-w-4xl mx-auto relative min-h-[300px] flex items-center justify-center">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={allTestimonials[activeTestimonial].id}
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="glass-panel p-10 md:p-16 rounded-[2.5rem] border border-white/10 relative w-full"
                  >
                    <div className="flex justify-center gap-1 mb-8">
                       {[...Array(5)].map((_, i) => (
                         <Star 
                          key={`testimonial-star-${i}`} 
                          size={20} 
                          className={`${i < allTestimonials[activeTestimonial].rating ? "fill-brand-teal text-brand-teal" : "text-slate-700"} `} 
                        />
                       ))}
                    </div>
                    <p className="text-2xl font-medium leading-relaxed italic text-balance mb-10">
                      "{allTestimonials[activeTestimonial].text}"
                    </p>
                    <div>
                       <h4 className="text-xl font-display font-black text-brand-teal">{allTestimonials[activeTestimonial].author}</h4>
                       <p className="text-slate-400 text-sm mt-1">{allTestimonials[activeTestimonial].role}</p>
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>

            <div className="flex justify-center gap-6 mt-12">
               <button 
                  onClick={nextTestimonial}
                  className="p-4 rounded-full border border-brand-teal/30 text-brand-teal hover:bg-brand-teal hover:text-surface-deep transition-all"
                >
                  <ChevronRight size={24} />
               </button>
               <button 
                  onClick={prevTestimonial}
                  className="p-4 rounded-full border border-brand-teal/30 text-brand-teal hover:bg-brand-teal hover:text-surface-deep transition-all"
                >
                  <ChevronLeft size={24} />
               </button>
            </div>
          </motion.section>
        )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="lg:pr-[19.5rem] py-16 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center gap-10">
        <div className="text-brand-teal font-display font-black text-3xl">مدار الصحة</div>
        
        <div className="flex flex-wrap justify-center gap-8 px-6">
          <a href="#" className="text-sm text-slate-500 hover:text-brand-teal transition-colors underline-offset-4 hover:underline">سياسة الخصوصية</a>
          <a href="#" className="text-sm text-slate-500 hover:text-brand-teal transition-colors underline-offset-4 hover:underline">الشروط والأحكام</a>
          <a href="#" className="text-sm text-slate-500 hover:text-brand-teal transition-colors underline-offset-4 hover:underline">دعم النظام</a>
          <a href="#" className="text-sm text-slate-500 hover:text-brand-teal transition-colors underline-offset-4 hover:underline">اتصل بنا</a>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 text-slate-600 text-xs text-center border-t border-white/5 pt-10 w-full max-w-7xl px-6">
          <div className="flex-1">
            © ٢٠٢٤ منصة مدار الصحة. جميع الحقوق محفوظة. صمم بدقة لتمكين المتخصصين في المجال الطبي.
          </div>
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
               isOnline ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
             }`}>
               {isOnline ? <><Wifi size={12} /> متصل</> : <><WifiOff size={12} /> وضع الأوفلاين</>}
             </div>
          </div>
        </div>
      </footer>

      {/* Connectivity Toast */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] pointer-events-none flex flex-col items-center gap-4">
        <AnimatePresence>
          {Object.keys(downloadingProgress).length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <CloudDownload size={14} className="text-brand-orange" />
                  التحميلات النشطة
                </h4>
                <span className="text-[10px] text-slate-500 font-bold">{Object.keys(downloadingProgress).length} متبقي</span>
              </div>
              <div className="space-y-3">
                {Object.entries(downloadingProgress).map(([title, progress]) => (
                  <div key={title} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-300 font-bold">{title}</span>
                      <span className="text-brand-orange font-black">%{progress}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-brand-orange"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {showConnectivityToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 font-bold text-white pointer-events-auto ${
                isOnline ? 'bg-green-600 border-green-400' : 'bg-brand-orange border-brand-orange/50'
              }`}
            >
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
              {isOnline ? 'تم استعادة الاتصال بالإنترنت' : 'أنت الآن في وضع عدم الاتصال (أوفلاين)'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-surface-deep/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-white text-surface-deep overflow-hidden rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.5)] relative"
            >
              {/* Decorative Border */}
              <div className="absolute inset-4 border-[12px] border-double border-surface-deep/10 pointer-events-none" />
              <div className="absolute top-8 left-8 right-8 bottom-8 border border-brand-teal/20 pointer-events-none" />

              <div className="p-16 md:p-24 flex flex-col items-center text-center space-y-10 relative">
                {/* Header Decoration */}
                <div className="w-full flex items-center justify-between pointer-events-none opacity-20">
                   <div className="w-16 h-16 border-t-4 border-r-4 border-brand-teal" />
                   <div className="w-16 h-16 border-t-4 border-l-4 border-brand-teal" />
                </div>

                <div className="space-y-4">
                  <div className="text-brand-teal font-display font-black text-2xl tracking-widest uppercase">شهادة إتمام</div>
                  <div className="h-0.5 w-24 bg-brand-teal mx-auto" />
                </div>

                <div className="space-y-6">
                  <p className="text-xl font-medium text-slate-600">تشهد منصة مدار الصحة بأن الممارس الصحي:</p>
                  <h2 className="text-5xl font-display font-black text-surface-deep border-b-2 border-brand-teal pb-4 px-12 inline-block">
                    {userName || "د. أحمد علي"}
                  </h2>
                  <p className="text-xl font-medium text-slate-600 px-12 leading-relaxed">
                    قد أتم بنجاح البرنامج التعليمي المتقدم بعنوان:
                  </p>
                  <h3 className="text-3xl font-display font-bold text-brand-teal">
                    إدارة السجلات الصحية الإلكترونية (EHR) والمعايير الفنية الدولية
                  </h3>
                </div>

                <div className="grid grid-cols-2 w-full pt-16 gap-20">
                  <div className="flex flex-col items-center space-y-2 border-t border-surface-deep/10 pt-4">
                    <span className="text-xs text-slate-400">تاريخ الإصدار</span>
                    <span className="font-bold text-lg">{new Date().toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border-t border-surface-deep/10 pt-4">
                    <span className="text-xs text-slate-400">كود التحقق</span>
                    <span className="font-mono text-sm uppercase tracking-widest">MH-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
                </div>

                {/* Footer Seal */}
                <div className="absolute bottom-12 inset-x-0 flex items-center justify-center -space-x-4 pointer-events-none text-[#daa520]/40">
                   <div className="w-20 h-20 rounded-full bg-brand-teal flex items-center justify-center text-surface-deep transform rotate-12 animate-pulse shadow-xl border-4 border-white">
                      <Award size={40} />
                   </div>
                </div>
              </div>

              {/* Action Buttons (Non-Printable) */}
              <div className="absolute top-6 left-6 flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="p-3 bg-surface-deep/5 hover:bg-surface-deep/10 rounded-full text-slate-600 transition-colors"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => setShowCertificate(false)}
                  className="p-3 bg-red-500/10 hover:bg-red-500 text-slate-600 hover:text-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tutor Floating UI */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isTutorOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-panel rounded-3xl border border-brand-teal/20 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-brand-teal/10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-surface-deep flex items-center justify-center text-brand-teal">
                      <Bot size={24} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-brand-teal">مساعد مدار الصحة</h4>
                      <div className="flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                         <span className="text-[10px] text-slate-400">متصل الآن</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setIsTutorOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right">
                 {chatHistory.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-brand-teal/5 rounded-2xl">
                         <MessageCircle size={32} className="text-brand-teal/40" />
                      </div>
                      <p className="text-slate-400 text-sm max-w-[200px]">مرحباً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك في رحلتك التعليمية اليوم؟</p>
                   </div>
                 )}
                 {chatHistory.map((msg, i) => (
                   <div 
                    key={`chat-msg-${i}-${msg.role}`} 
                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                   >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-brand-teal text-surface-deep font-medium' 
                          : 'bg-white/5 text-slate-300 border border-white/5'
                      }`}>
                         {msg.parts[0].text}
                      </div>
                   </div>
                 ))}
                 {isChatLoading && (
                   <div className="flex justify-end">
                      <div className="bg-white/5 rounded-2xl px-4 py-2.5 flex gap-1">
                         <span className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                         <span className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                         <span className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                   </div>
                 )}
                 <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-surface-deep/40 border-t border-white/5 space-y-3">
                 {docName && (
                   <div className="flex items-center justify-between bg-brand-teal/5 border border-brand-teal/20 rounded-lg px-3 py-1.5">
                     <div className="flex items-center gap-2 overflow-hidden">
                       <FileText size={14} className="text-brand-teal shrink-0" />
                       <span className="text-[10px] text-slate-300 truncate">{docName}</span>
                     </div>
                     <button 
                      type="button"
                      onClick={() => { setDocContext(null); setDocName(null); }}
                      className="text-slate-500 hover:text-red-400 p-1"
                     >
                       <X size={12} />
                     </button>
                   </div>
                 )}
                 <div className="relative">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="اسأل أي شيء..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-teal/50 pr-20 transition-all font-medium"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".txt,.md,.json"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                        title="رفع مستند طبي"
                      >
                        <Paperclip size={16} />
                      </button>
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || isChatLoading}
                        className="p-1.5 bg-brand-teal text-surface-deep rounded-lg disabled:opacity-50 transition-all"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                 </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsTutorOpen(!isTutorOpen)}
          className="w-16 h-16 rounded-full bg-brand-teal text-surface-deep shadow-[0_8px_30px_rgba(67,224,206,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative group"
        >
          <Bot size={32} />
          {!isTutorOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center text-[10px] font-bold text-surface-deep outline outline-4 outline-surface-deep">
              1
            </span>
          )}
          <div className="absolute right-full mr-4 bg-brand-teal text-surface-deep px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-2 group-hover:translate-x-0">
             هل لديك سؤال؟ اسأل المساعد الذكي
          </div>
        </button>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/10 py-3 px-6 flex items-center justify-around z-[110] shadow-[0_-10px_30px_rgba(3,20,37,0.5)]">
        {[
          { icon: LayoutDashboard, label: "الرئيسية", active: true },
          { icon: GraduationCap, label: "المسارات" },
          { icon: Bot, label: "المساعد" },
          { icon: User, label: "الملف" },
        ].map((item) => (
          <button 
            key={item.label}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.active ? 'text-brand-teal' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon size={22} className={item.active ? 'drop-shadow-[0_0_8px_rgba(67,224,206,0.5)]' : ''} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
