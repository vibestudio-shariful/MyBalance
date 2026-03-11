import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Landmark, 
  Settings as SettingsIcon,
  Plus,
  Minus,
  ArrowUpCircle,
  ArrowDownCircle,
  User,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Wallet,
  ChevronLeft,
  Palette,
  Check,
  Camera,
  MinusCircle,
  PlusCircle,
  Mail,
  ExternalLink,
  AlertCircle,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths, parseISO } from 'date-fns';
import { Transaction, TransactionType, SavingsSector, SavingsHistoryItem, UserProfile, Person } from './types';

// --- Types ---
type ThemeColor = 'emerald' | 'indigo' | 'rose' | 'amber' | 'slate';

interface AppState {
  theme: ThemeColor;
  selectedMonth: Date;
}

// --- Components ---

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

const IconButton = ({ icon: Icon, onClick, active, themeColor }: { icon: any, onClick: () => void, active?: boolean, themeColor: ThemeColor }) => {
  const activeClasses = {
    emerald: 'bg-emerald-500 shadow-emerald-200',
    indigo: 'bg-indigo-500 shadow-indigo-200',
    rose: 'bg-rose-500 shadow-rose-200',
    amber: 'bg-amber-500 shadow-amber-200',
    slate: 'bg-slate-800 shadow-slate-200',
  };

  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${
        active ? `${activeClasses[themeColor]} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'
      }`}
    >
      <Icon size={24} />
    </button>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'transactions' | 'savings' | 'settings'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<SavingsSector[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Shariful Islam",
    email: "connect.shariful@gmail.com",
    avatar: undefined,
    currency: "৳"
  });
  const [theme, setTheme] = useState<ThemeColor>('emerald');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (language === 'bn') {
      if (hour < 6) return 'শুভ রাত্রি';
      if (hour < 12) return 'শুভ সকাল';
      if (hour < 16) return 'শুভ দুপুর';
      if (hour < 19) return 'শুভ সন্ধ্যা';
      return 'শুভ রাত্রি';
    } else {
      if (hour < 6) return 'Good Night';
      if (hour < 12) return 'Good Morning';
      if (hour < 16) return 'Good Afternoon';
      if (hour < 19) return 'Good Evening';
      return 'Good Night';
    }
  }, [language]);

  const t = useMemo(() => ({
    bn: {
      welcome: greeting + ',',
      settings: 'সেটিংস',
      home: 'হোম',
      denapawna: 'দেনাপাওনা',
      savings: 'সঞ্চয়',
      balance: 'এই মাসের ব্যালেন্স',
      income: 'মোট আয়',
      expense: 'মোট ব্যয়',
      recent: 'সাম্প্রতিক লেনদেন',
      all: 'সব দেখুন',
      noTransactions: 'এই মাসে কোন লেনদেন নেই',
      receivable: 'পাবো',
      payable: 'দেবো',
      paid: 'পরিশোধিত',
      history: 'লেনদেনের ইতিহাস',
      addTransaction: 'নতুন লেনদেন যোগ করুন',
      addPerson: 'নতুন ব্যক্তি যোগ করুন',
      addSavings: 'নতুন সঞ্চয় খাত যোগ করুন',
      save: 'সংরক্ষণ করুন',
      confirm: 'নিশ্চিত করুন',
      cancel: 'বাতিল',
      delete: 'ডিলিট করুন',
      confirmDelete: 'আপনি কি নিশ্চিত?',
      backup: 'ব্যাকআপ ও রিস্টোর',
      googleDrive: 'গুগল ড্রাইভ ব্যাকআপ',
      developer: 'ডেভেলপার',
      language: 'ভাষা (Language)',
      currency: 'কারেন্সি',
      theme: 'থিম',
      restore: 'রিস্টোর করুন',
      connected: 'সংযুক্ত',
      connect: 'কানেক্ট করুন',
      disconnect: 'ডিসকানেক্ট',
      profileEdit: 'প্রোফাইল এডিট করুন',
      name: 'আপনার নাম',
      email: 'ইমেইল',
      amount: 'পরিমাণ',
      date: 'তারিখ',
      category: 'ক্যাটাগরি',
      note: 'নোট (ঐচ্ছিক)',
      person: 'ব্যক্তি',
      adjust: 'সমন্বয় করুন',
      plus: 'যোগ করুন',
      minus: 'বিয়োগ করুন',
      toastAdd: 'লেনদেন সফলভাবে যোগ করা হয়েছে',
      toastDelete: 'লেনদেন মুছে ফেলা হয়েছে',
      toastProfile: 'প্রোফাইল আপডেট করা হয়েছে',
      toastSavings: 'সঞ্চয় খাত যোগ করা হয়েছে',
      toastSavingsAdjust: 'সঞ্চয় সমন্বয় করা হয়েছে',
      toastPerson: 'নতুন ব্যক্তি যোগ করা হয়েছে',
      toastCurrency: 'কারেন্সি পরিবর্তন করা হয়েছে',
      toastTheme: 'থিম পরিবর্তন করা হয়েছে',
      toastLanguage: 'ভাষা পরিবর্তন করা হয়েছে',
    },
    en: {
      welcome: greeting + ',',
      settings: 'Settings',
      home: 'Home',
      denapawna: 'Dena-Paona',
      savings: 'Savings',
      balance: 'Monthly Balance',
      income: 'Total Income',
      expense: 'Total Expense',
      recent: 'Recent Transactions',
      all: 'View All',
      noTransactions: 'No transactions this month',
      receivable: 'Receivable',
      payable: 'Payable',
      paid: 'Paid',
      history: 'Transaction History',
      addTransaction: 'Add New Transaction',
      addPerson: 'Add New Person',
      addSavings: 'Add Savings Sector',
      save: 'Save',
      confirm: 'Confirm',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Are you sure?',
      backup: 'Backup & Restore',
      googleDrive: 'Google Drive Backup',
      developer: 'Developer',
      language: 'Language',
      currency: 'Currency',
      theme: 'Theme',
      restore: 'Restore',
      connected: 'Connected',
      connect: 'Connect',
      disconnect: 'Disconnect',
      profileEdit: 'Edit Profile',
      name: 'Your Name',
      email: 'Email',
      amount: 'Amount',
      date: 'Date',
      category: 'Category',
      note: 'Note (Optional)',
      person: 'Person',
      adjust: 'Adjust',
      plus: 'Add',
      minus: 'Subtract',
      toastAdd: 'Transaction added successfully',
      toastDelete: 'Transaction deleted',
      toastProfile: 'Profile updated',
      toastSavings: 'Savings sector added',
      toastSavingsAdjust: 'Savings adjusted',
      toastPerson: 'New person added',
      toastCurrency: 'Currency changed',
      toastTheme: 'Theme changed',
      toastLanguage: 'Language changed',
    }
  }[language]), [language]);

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Settings Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupFiles, setBackupFiles] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Home view state
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [historyView, setHistoryView] = useState<{ show: boolean, type: 'income' | 'expense' | 'all' }>({ show: false, type: 'all' });

  // Person Modal State
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [personNameInput, setPersonNameInput] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedSavingsSector, setSelectedSavingsSector] = useState<SavingsSector | null>(null);

  const [preSelectedPerson, setPreSelectedPerson] = useState<string | null>(null);
  const [allowedTypesOverride, setAllowedTypesOverride] = useState<TransactionType[] | null>(null);
  const [initialTypeOverride, setInitialTypeOverride] = useState<TransactionType | null>(null);

  // Savings Sector Modal States
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsModalMode, setSavingsModalMode] = useState<'add' | 'adjust'>('add');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'plus' | 'minus'>('plus');

  // Denapawna Filter
  const [denapawnaFilter, setDenapawnaFilter] = useState<'all' | 'receivable' | 'payable'>('all');

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  } | null>(null);

  const [savingsInput, setSavingsInput] = useState('');
  const [savingsDate, setSavingsDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('hk_transactions');
    const savedSavings = localStorage.getItem('hk_savings');
    const savedPersons = localStorage.getItem('hk_persons');
    const savedProfile = localStorage.getItem('hk_profile');
    const savedTheme = localStorage.getItem('hk_theme') as ThemeColor;
    const savedLanguage = localStorage.getItem('hk_language') as 'bn' | 'en';
    const savedTokens = localStorage.getItem('hk_google_tokens');
    const savedEmail = localStorage.getItem('hk_google_email');

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedSavings) {
      const parsedSavings = JSON.parse(savedSavings);
      // Ensure history exists for all sectors
      const migratedSavings = parsedSavings.map((s: any) => ({
        ...s,
        history: s.history || []
      }));
      setSavings(migratedSavings);
    }
    if (savedPersons) setPersons(JSON.parse(savedPersons));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTokens) {
      setIsGoogleConnected(true);
      setGoogleEmail(savedEmail);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('hk_transactions', JSON.stringify(transactions));
    localStorage.setItem('hk_savings', JSON.stringify(savings));
    localStorage.setItem('hk_persons', JSON.stringify(persons));
    localStorage.setItem('hk_profile', JSON.stringify(profile));
    localStorage.setItem('hk_theme', theme);
    localStorage.setItem('hk_language', language);
  }, [transactions, savings, persons, profile, theme, language]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Google OAuth Listener
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const tokens = event.data.tokens;
        const email = event.data.email;
        localStorage.setItem('hk_google_tokens', JSON.stringify(tokens));
        localStorage.setItem('hk_google_email', email);
        setIsGoogleConnected(true);
        setGoogleEmail(email);
        await uploadToGoogleDrive(tokens);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [transactions, savings, profile, theme]);

  const uploadToGoogleDrive = async (tokens: any) => {
    setIsBackingUp(true);
    try {
      const response = await fetch('/api/backup/google-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          data: { transactions, savings, profile, theme },
          filename: `hishab_kitab_backup_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`
        })
      });
      const result = await response.json();
      if (result.success) {
        showToast("গুগল ড্রাইভে ব্যাকআপ সফলভাবে সম্পন্ন হয়েছে!", 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Backup failed:", error);
      showToast("ব্যাকআপ ব্যর্থ হয়েছে: " + error.message, 'error');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleGoogleDriveBackup = async () => {
    const savedTokens = localStorage.getItem('hk_google_tokens');
    if (savedTokens) {
      await uploadToGoogleDrive(JSON.parse(savedTokens));
    } else {
      try {
        const response = await fetch('/api/auth/google/url');
        const { url } = await response.json();
        window.open(url, 'google_auth', 'width=600,height=700');
      } catch (error) {
        showToast("গুগল অথেনটিকেশন ইউআরএল পাওয়া যায়নি।", 'error');
      }
    }
  };

  const handleListBackups = async () => {
    const savedTokens = localStorage.getItem('hk_google_tokens');
    if (!savedTokens) {
      handleGoogleDriveBackup();
      return;
    }

    setIsLoadingBackups(true);
    setShowRestoreModal(true);
    try {
      const response = await fetch('/api/backup/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: JSON.parse(savedTokens) })
      });
      const result = await response.json();
      if (result.success) {
        setBackupFiles(result.files);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      showToast("ব্যাকআপ তালিকা পাওয়া যায়নি: " + error.message, 'error');
      setShowRestoreModal(false);
    } finally {
      setIsLoadingBackups(false);
    }
  };

   const handleRestoreFromDrive = async (fileId: string) => {
    console.log("handleRestoreFromDrive called with:", fileId);
    const savedTokens = localStorage.getItem('hk_google_tokens');
    if (!savedTokens) {
      showToast("গুগল ড্রাইভ কানেক্ট করা নেই। দয়া করে আবার কানেক্ট করুন।", 'error');
      return;
    }

    setConfirmConfig({
      title: 'রিস্টোর কনফার্মেশন',
      message: 'আপনি কি নিশ্চিত যে এই ব্যাকআপটি রিস্টোর করতে চান? আপনার বর্তমান সকল ডাটা মুছে যাবে এবং ব্যাকআপের ডাটা দিয়ে রিপ্লেস হবে।',
      confirmText: 'রিস্টোর করুন',
      cancelText: 'না',
      isDanger: true,
      onConfirm: async () => {
        setIsRestoring(true);
        try {
          console.log("Restoring from file:", fileId);
          const response = await fetch('/api/backup/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: JSON.parse(savedTokens), fileId })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server returned ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            const data = result.data;
            console.log("Backup data received:", data);
            
            if (data && typeof data === 'object') {
              if (data.transactions) setTransactions(data.transactions);
              if (data.savings) setSavings(data.savings);
              if (data.profile) setProfile(data.profile);
              if (data.theme) setTheme(data.theme);
              
              showToast("ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!", 'success');
              setShowRestoreModal(false);
            } else {
              throw new Error("ব্যাকআপ ফাইলের ফরম্যাট সঠিক নয়।");
            }
          } else {
            throw new Error(result.error || "অজানা ত্রুটি");
          }
        } catch (error: any) {
          console.error("Restore error:", error);
          showToast("রিস্টোর ব্যর্থ হয়েছে: " + error.message, 'error');
        } finally {
          setIsRestoring(false);
          setShowConfirmModal(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleDeleteBackup = async (fileId: string) => {
    const savedTokens = localStorage.getItem('hk_google_tokens');
    if (!savedTokens) return;

    setConfirmConfig({
      title: 'ব্যাকআপ ডিলিট',
      message: 'আপনি কি নিশ্চিত যে এই ব্যাকআপ ফাইলটি ডিলিট করতে চান? এটি আর ফিরে পাওয়া যাবে না।',
      confirmText: 'ডিলিট করুন',
      cancelText: 'না',
      isDanger: true,
      onConfirm: async () => {
        setIsRestoring(true);
        try {
          const response = await fetch('/api/backup/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: JSON.parse(savedTokens), fileId })
          });
          const result = await response.json();
          if (result.success) {
            setBackupFiles(prev => prev.filter(f => f.id !== fileId));
            showToast("ব্যাকআপ ফাইল ডিলিট করা হয়েছে", 'success');
          } else {
            throw new Error(result.error);
          }
        } catch (error: any) {
          showToast("ডিলিট ব্যর্থ হয়েছে: " + error.message, 'error');
        } finally {
          setIsRestoring(false);
          setShowConfirmModal(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowAddModal(false);
    showToast('লেনদেন সফলভাবে যোগ করা হয়েছে');
  };

  const addPerson = (name: string) => {
    if (!name.trim()) return;
    const newPerson: Person = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim()
    };
    setPersons([...persons, newPerson]);
    setShowPersonModal(false);
    setPersonNameInput('');
    showToast('নতুন ব্যক্তি যোগ করা হয়েছে', 'success');
  };

  const deleteTransaction = (id: string) => {
    setConfirmConfig({
      title: language === 'bn' ? 'লেনদেন ডিলিট' : 'Delete Transaction',
      message: language === 'bn' ? 'আপনি কি নিশ্চিত যে এই লেনদেনটি মুছে ফেলতে চান? এটি হিসাব থেকে সমন্বয় হয়ে যাবে।' : 'Are you sure you want to delete this transaction? It will be adjusted from the balance.',
      confirmText: language === 'bn' ? 'ডিলিট করুন' : 'Delete',
      cancelText: language === 'bn' ? 'না' : 'No',
      isDanger: true,
      onConfirm: () => {
        setTransactions(prev => prev.filter(x => x.id !== id));
        showToast(language === 'bn' ? 'লেনদেন মুছে ফেলা হয়েছে' : 'Transaction deleted', 'success');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const deletePerson = (id: string) => {
    const personToDelete = persons.find(p => p.id === id);
    if (!personToDelete) return;
    
    setConfirmConfig({
      title: language === 'bn' ? 'ব্যক্তি ডিলিট' : 'Delete Person',
      message: language === 'bn' ? `আপনি কি নিশ্চিত যে আপনি "${personToDelete.name}"-কে মুছে ফেলতে চান? তার সকল লেনদেনের রেকর্ডও মুছে যাবে এবং হিসাব সমন্বয় হবে।` : `Are you sure you want to delete "${personToDelete.name}"? All their transaction records will be deleted and balance will be adjusted.`,
      confirmText: language === 'bn' ? 'ডিলিট করুন' : 'Delete',
      cancelText: language === 'bn' ? 'না' : 'No',
      isDanger: true,
      onConfirm: () => {
        setPersons(prev => prev.filter(p => p.id !== id));
        setTransactions(prev => prev.filter(t => t.person !== personToDelete.name));
        setSelectedPerson(null);
        showToast(language === 'bn' ? 'ব্যক্তি এবং তার সকল লেনদেন মুছে ফেলা হয়েছে' : 'Person and all their transactions deleted', 'success');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const deleteSavingsSector = (id: string) => {
    const sectorToDelete = savings.find(s => s.id === id);
    if (!sectorToDelete) return;

    setConfirmConfig({
      title: language === 'bn' ? 'সঞ্চয় খাত ডিলিট' : 'Delete Savings Sector',
      message: language === 'bn' ? `আপনি কি নিশ্চিত যে আপনি "${sectorToDelete.name}" সঞ্চয় খাতটি মুছে ফেলতে চান? এর সকল ব্যালেন্স রেকর্ড মুছে যাবে।` : `Are you sure you want to delete "${sectorToDelete.name}"? All its balance records will be deleted.`,
      confirmText: language === 'bn' ? 'ডিলিট করুন' : 'Delete',
      cancelText: language === 'bn' ? 'না' : 'No',
      isDanger: true,
      onConfirm: () => {
        setSavings(prev => prev.filter(s => s.id !== id));
        showToast(language === 'bn' ? 'সঞ্চয় খাত মুছে ফেলা হয়েছে' : 'Savings sector deleted', 'success');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };
  const filteredTransactions = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return transactions.filter(t => {
      const date = parseISO(t.date);
      // Only show income/expense on home page
      const isHomeType = t.type === 'income' || t.type === 'expense';
      return isHomeType && isWithinInterval(date, { start, end });
    });
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0), [filteredTransactions]);

  const totalExpense = useMemo(() => filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0), [filteredTransactions]);

  const currentBalance = totalIncome - totalExpense;

  const receivables = useMemo(() => transactions
    .filter(t => t.type === 'receivable')
    .reduce((acc, curr) => acc + curr.amount, 0) - 
    transactions
    .filter(t => t.type === 'income' && t.person)
    .reduce((acc, curr) => acc + curr.amount, 0), [transactions]);

  const payables = useMemo(() => transactions
    .filter(t => t.type === 'payable')
    .reduce((acc, curr) => acc + curr.amount, 0) -
    transactions
    .filter(t => t.type === 'expense' && t.person)
    .reduce((acc, curr) => acc + curr.amount, 0), [transactions]);

  const themeColors = {
    emerald: 'bg-emerald-500 shadow-emerald-200 text-emerald-600 border-emerald-100 ring-emerald-500',
    indigo: 'bg-indigo-500 shadow-indigo-200 text-indigo-600 border-indigo-100 ring-indigo-500',
    rose: 'bg-rose-500 shadow-rose-200 text-rose-600 border-rose-100 ring-rose-500',
    amber: 'bg-amber-500 shadow-amber-200 text-amber-600 border-amber-100 ring-amber-500',
    slate: 'bg-slate-800 shadow-slate-200 text-slate-800 border-slate-100 ring-slate-800',
  };

  const themeBg = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-800',
  };

  const themeText = {
    emerald: 'text-emerald-500',
    indigo: 'text-indigo-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
    slate: 'text-slate-800',
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div>
          {activeTab === 'settings' ? (
            <h1 className="text-xl font-bold text-slate-800">{t.settings}</h1>
          ) : (
            <>
              <h2 className="text-slate-400 text-sm font-medium">{t.welcome}</h2>
              <h1 className="text-xl font-bold text-slate-800">{profile.name}</h1>
            </>
          )}
        </div>
        <div 
          onClick={() => setShowProfileModal(true)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer active:scale-90 transition-transform ${theme === 'slate' ? 'bg-slate-100 text-slate-800' : `${themeColors[theme].split(' ')[2].replace('text-', 'bg-').replace('-600', '-100')} ${themeText[theme]}`}`}
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={24} />
          )}
        </div>
      </header>

      {/* Month Selector */}
      {activeTab !== 'settings' && (
        <div className="px-6 mb-4">
          <div className="bg-white rounded-2xl p-2 flex items-center justify-between shadow-sm border border-slate-100">
            <button 
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-700">{format(selectedMonth, language === 'bn' ? 'MMMM yyyy' : 'MMMM yyyy')}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{language === 'bn' ? 'মাসের হিসাব' : 'Monthly Records'}</span>
            </div>
            <button 
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="px-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <div className={`${themeBg[theme]} rounded-[2rem] p-8 text-white shadow-xl ${themeColors[theme].split(' ')[1]} relative overflow-hidden`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 text-center">
                  <p className="opacity-80 text-sm mb-1">{t.balance}</p>
                  <h2 className="text-4xl font-bold mb-0">{profile.currency} {currentBalance.toLocaleString()}</h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setHistoryView({ show: true, type: 'income' })}
                  className="text-left"
                >
                  <Card className="flex flex-col gap-2 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle size={16} className="text-emerald-500" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.income}</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">{profile.currency} {totalIncome.toLocaleString()}</p>
                  </Card>
                </button>
                <button 
                  onClick={() => setHistoryView({ show: true, type: 'expense' })}
                  className="text-left"
                >
                  <Card className="flex flex-col gap-2 bg-rose-50/50 border-rose-100 hover:bg-rose-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle size={16} className="text-rose-500" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.expense}</p>
                    </div>
                    <p className="text-lg font-bold text-rose-600">{profile.currency} {totalExpense.toLocaleString()}</p>
                  </Card>
                </button>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">{t.recent}</h3>
                  <button onClick={() => setHistoryView({ show: true, type: 'all' })} className={`${themeText[theme]} text-sm font-medium`}>{t.all}</button>
                </div>
                <div className="space-y-3">
                  {filteredTransactions.slice(0, 5).map(t_item => (
                    <TransactionItem 
                      key={t_item.id} 
                      transaction={t_item} 
                      currency={profile.currency} 
                      themeColor={theme} 
                      onDelete={() => deleteTransaction(t_item.id)}
                    />
                  ))}
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-slate-400 italic">{t.noTransactions}</div>
                  )}
                </div>
              </div>

              {/* History View Modal */}
              <AnimatePresence>
                {historyView.show && (
                  <motion.div 
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto"
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setHistoryView({ ...historyView, show: false })}
                            className="p-2 bg-white rounded-xl text-slate-500 shadow-sm border border-slate-100"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <h3 className="font-bold text-slate-800 text-lg">
                            {historyView.type === 'income' ? 'আয়ের রেকর্ড' : historyView.type === 'expense' ? 'ব্যয়ের রেকর্ড' : 'সব লেনদেন'}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {filteredTransactions.filter(t => historyView.type === 'all' ? true : t.type === historyView.type).length === 0 ? (
                          <div className="text-center py-20 text-slate-400 italic">কোন রেকর্ড পাওয়া যায়নি</div>
                        ) : (
                          filteredTransactions
                            .filter(t => historyView.type === 'all' ? true : t.type === historyView.type)
                            .map(t => (
                              <TransactionItem 
                                key={t.id} 
                                transaction={t} 
                                currency={profile.currency} 
                                onDelete={() => deleteTransaction(t.id)}
                                themeColor={theme} 
                                showTime
                              />
                            ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div 
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800 text-lg">{t.denapawna}</h3>
                <button 
                  onClick={() => setShowPersonModal(true)}
                  className={`p-2 rounded-xl bg-white border border-slate-100 text-slate-500 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold`}
                >
                  <Plus size={16} />
                  {t.addPerson}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col gap-1 border-emerald-100 bg-emerald-50/30">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.receivable}</p>
                  <p className="text-xl font-bold text-emerald-600">{profile.currency} {receivables.toLocaleString()}</p>
                </Card>
                <Card className="flex flex-col gap-1 border-rose-100 bg-rose-50/30">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.payable}</p>
                  <p className="text-xl font-bold text-rose-600">{profile.currency} {payables.toLocaleString()}</p>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{language === 'bn' ? 'ব্যক্তি তালিকা' : 'Person List'}</h4>
                {persons.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 italic">{language === 'bn' ? 'কোন ব্যক্তি যোগ করা হয়নি' : 'No persons added'}</div>
                ) : (
                  persons.map(p => {
                    const personTransactions = transactions.filter(t_item => t_item.person === p.name);
                    const personReceivable = personTransactions.filter(t_item => t_item.type === 'receivable').reduce((sum, t_item) => sum + t_item.amount, 0);
                    const personPayable = personTransactions.filter(t_item => t_item.type === 'payable').reduce((sum, t_item) => sum + t_item.amount, 0);
                    const personIncome = personTransactions.filter(t_item => t_item.type === 'income').reduce((sum, t_item) => sum + t_item.amount, 0);
                    const personExpense = personTransactions.filter(t_item => t_item.type === 'expense').reduce((sum, t_item) => sum + t_item.amount, 0);
                    const netBalance = (personReceivable - personIncome) - (personPayable - personExpense);

                    return (
                      <button 
                        key={p.id}
                        onClick={() => setSelectedPerson(p)}
                        className="w-full text-left"
                      >
                        <Card className={`flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-l-4 ${netBalance > 0 ? 'border-l-emerald-500' : netBalance < 0 ? 'border-l-rose-500' : 'border-l-slate-300'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${netBalance > 0 ? 'bg-emerald-100 text-emerald-600' : netBalance < 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800">{p.name}</h5>
                              <p className="text-[10px] text-slate-400 font-medium">{language === 'bn' ? 'লেনদেন:' : 'Transactions:'} {personTransactions.length} {language === 'bn' ? 'টি' : ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${netBalance > 0 ? 'text-emerald-600' : netBalance < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                              {profile.currency} {Math.abs(netBalance).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                              {netBalance > 0 ? t.receivable : netBalance < 0 ? t.payable : t.paid}
                            </p>
                          </div>
                        </Card>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Person Detail View Modal */}
              <AnimatePresence>
                {selectedPerson && (
                  <motion.div 
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto"
                  >
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setSelectedPerson(null)}
                            className="p-2 bg-white rounded-xl text-slate-500 shadow-sm border border-slate-100"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <h3 className="font-bold text-slate-800 text-lg flex-1">{selectedPerson.name} - {language === 'bn' ? 'বিস্তারিত' : 'Details'}</h3>
                          <button 
                            onClick={() => deletePerson(selectedPerson.id)}
                            className="p-2 bg-rose-50 rounded-xl text-rose-500 shadow-sm border border-rose-100 active:scale-90 transition-transform"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                      {(() => {
                        const personTransactions = transactions.filter(t => t.person === selectedPerson.name);
                        const personReceivable = personTransactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
                        const personPayable = personTransactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
                        const personIncome = personTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                        const personExpense = personTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                        const netBalance = (personReceivable - personIncome) - (personPayable - personExpense);

                        return (
                          <>
                            <div className={`${netBalance > 0 ? 'bg-emerald-500 shadow-emerald-200' : netBalance < 0 ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-800 shadow-slate-200'} rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden`}>
                              <div className="relative z-10 text-center">
                                <p className="opacity-80 text-sm mb-1">{language === 'bn' ? 'নিট ব্যালেন্স' : 'Net Balance'}</p>
                                <h2 className="text-4xl font-bold mb-1">{profile.currency} {Math.abs(netBalance).toLocaleString()}</h2>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-90">
                                  {netBalance > 0 ? (language === 'bn' ? 'আপনি পাবেন' : 'You will get') : netBalance < 0 ? (language === 'bn' ? 'আপনি দেবেন' : 'You will give') : t.paid}
                                </p>
                              </div>
                            </div>

                              <div className="flex gap-4">
                                <button 
                                  onClick={() => {
                                    setPreSelectedPerson(selectedPerson.name);
                                    // Logic: If I owe them (netBalance < 0), receiving money increases debt (payable)
                                    // If they owe me (netBalance >= 0), receiving money decreases debt (income)
                                    const type = netBalance < 0 ? 'payable' : 'income';
                                    setAllowedTypesOverride([type]);
                                    setInitialTypeOverride(type);
                                    setShowAddModal(true);
                                  }}
                                  className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                >
                                  <PlusCircle size={20} />
                                  {language === 'bn' ? 'পেলাম' : 'Received'}
                                </button>
                                <button 
                                  onClick={() => {
                                    setPreSelectedPerson(selectedPerson.name);
                                    // Logic: If I owe them (netBalance < 0), giving money decreases debt (expense)
                                    // If they owe me (netBalance >= 0), giving money increases debt (receivable)
                                    const type = netBalance < 0 ? 'expense' : 'receivable';
                                    setAllowedTypesOverride([type]);
                                    setInitialTypeOverride(type);
                                    setShowAddModal(true);
                                  }}
                                  className="flex-1 py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                >
                                  <MinusCircle size={20} />
                                  {language === 'bn' ? 'দিলাম' : 'Given'}
                                </button>
                              </div>

                            <div className="space-y-4">
                              <h4 className="font-bold text-slate-800">{t.history}</h4>
                              <div className="space-y-3">
                                {personTransactions.length === 0 ? (
                                  <div className="text-center py-10 text-slate-400 italic">{t.noTransactions}</div>
                                ) : (
                                  personTransactions.map(t_item => (
                                    <TransactionItem 
                                      key={t_item.id} 
                                      transaction={t_item} 
                                      currency={profile.currency} 
                                      onDelete={() => deleteTransaction(t_item.id)}
                                      themeColor={theme}
                                      showTime
                                    />
                                  ))
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'savings' && (
            <motion.div 
              key="savings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">{t.savings}</h3>
                <button 
                  onClick={() => {
                    setSavingsModalMode('add');
                    setSelectedSectorId(null);
                    setShowSavingsModal(true);
                  }}
                  className={`p-2 rounded-xl ${themeBg[theme]} text-white shadow-lg active:scale-95 transition-transform`}
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {savings.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 italic">{language === 'bn' ? 'কোন সঞ্চয় খাত তৈরি করা হয়নি' : 'No savings sectors created'}</div>
                ) : (
                  savings.map(sector => (
                    <Card key={sector.id} className="relative overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <button 
                          onClick={() => setSelectedSavingsSector(sector)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className={`p-3 rounded-2xl bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors`}>
                            <Landmark size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{sector.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'বিস্তারিত দেখতে ক্লিক করুন' : 'Click for details'}</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => deleteSavingsSector(sector.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}</p>
                          <p className="text-2xl font-bold text-slate-800">{profile.currency} {sector.balance.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedSectorId(sector.id);
                              setSavingsModalMode('adjust');
                              setAdjustType('plus');
                              setShowSavingsModal(true);
                            }}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors active:scale-95"
                          >
                            <PlusCircle size={20} />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedSectorId(sector.id);
                              setSavingsModalMode('adjust');
                              setAdjustType('minus');
                              setShowSavingsModal(true);
                            }}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors active:scale-95"
                          >
                            <MinusCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Savings Detail View Modal */}
              <AnimatePresence>
                {selectedSavingsSector && (
                  <motion.div 
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    className="fixed inset-0 bg-slate-50 z-[60] overflow-y-auto"
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedSavingsSector(null)}
                          className="p-2 bg-white rounded-xl text-slate-500 shadow-sm border border-slate-100"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <h3 className="font-bold text-slate-800 text-lg flex-1">{selectedSavingsSector.name} - {language === 'bn' ? 'বিস্তারিত' : 'Details'}</h3>
                      </div>

                      <div className={`bg-amber-500 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-100 relative overflow-hidden`}>
                        <div className="relative z-10 text-center">
                          <p className="opacity-80 text-sm mb-1">{language === 'bn' ? 'মোট সঞ্চয়' : 'Total Savings'}</p>
                          <h2 className="text-4xl font-bold mb-1">{profile.currency} {selectedSavingsSector.balance.toLocaleString()}</h2>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            setSelectedSectorId(selectedSavingsSector.id);
                            setSavingsModalMode('adjust');
                            setAdjustType('plus');
                            setShowSavingsModal(true);
                          }}
                          className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                          <PlusCircle size={20} />
                          {language === 'bn' ? 'জমা করুন' : 'Deposit'}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedSectorId(selectedSavingsSector.id);
                            setSavingsModalMode('adjust');
                            setAdjustType('minus');
                            setShowSavingsModal(true);
                          }}
                          className="flex-1 py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                          <MinusCircle size={20} />
                          {language === 'bn' ? 'উত্তোলন' : 'Withdraw'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800">{t.history}</h4>
                        <div className="space-y-3">
                          {!selectedSavingsSector.history || selectedSavingsSector.history.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 italic">{t.noTransactions}</div>
                          ) : (
                            selectedSavingsSector.history.map(item => (
                              <Card key={item.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-2xl ${item.type === 'plus' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    {item.type === 'plus' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.type === 'plus' ? (language === 'bn' ? 'জমা' : 'Deposit') : (language === 'bn' ? 'উত্তোলন' : 'Withdraw')}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                      {format(new Date(item.date), 'dd MMM, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                <p className={`font-bold ${item.type === 'plus' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {item.type === 'plus' ? '+' : '-'}{profile.currency}{item.amount.toLocaleString()}
                                </p>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 pb-10"
            >
              <h3 className="font-bold text-slate-800 text-lg">{t.settings}</h3>
              
              <div className="space-y-3">
                <SettingsItem icon={Languages} label={t.language} onClick={() => {
                  setLanguage(language === 'bn' ? 'en' : 'bn');
                  showToast(language === 'bn' ? 'Language changed to English' : 'ভাষা পরিবর্তন করা হয়েছে', 'success');
                }} />
                
                {/* Theme Selector */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                      <Palette size={20} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{t.theme}</span>
                  </div>
                  <div className="flex justify-between px-2">
                    {(['emerald', 'indigo', 'rose', 'amber', 'slate'] as ThemeColor[]).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setTheme(c);
                          showToast(t.toastTheme, 'success');
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          c === 'emerald' ? 'bg-emerald-500' :
                          c === 'indigo' ? 'bg-indigo-500' :
                          c === 'rose' ? 'bg-rose-500' :
                          c === 'amber' ? 'bg-amber-500' : 'bg-slate-800'
                        } ${theme === c ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : 'opacity-60 hover:opacity-100'}`}
                      >
                        {theme === c && <Check size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <SettingsItem icon={Wallet} label={`${t.currency} (${profile.currency})`} onClick={() => setShowCurrencyModal(true)} />
                
                <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                        <Landmark size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{t.googleDrive}</span>
                        <span className={`text-[10px] font-bold ${isGoogleConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {isGoogleConnected ? `${t.connected}: ${googleEmail}` : (language === 'bn' ? 'সেট করা নেই' : 'Not set')}
                        </span>
                      </div>
                    </div>
                    {isGoogleConnected && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.removeItem('hk_google_tokens');
                          localStorage.removeItem('hk_google_email');
                          setIsGoogleConnected(false);
                          setGoogleEmail(null);
                          showToast(language === 'bn' ? "গুগল ড্রাইভ ডিসকানেক্ট করা হয়েছে।" : "Google Drive disconnected.", 'success');
                        }}
                        className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg"
                      >
                        {t.disconnect}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleGoogleDriveBackup}
                      disabled={isBackingUp}
                      className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isBackingUp ? 'bg-slate-100 text-slate-400' : `${themeBg[theme]} text-white shadow-sm active:scale-95`
                      }`}
                    >
                      <Download size={16} />
                      {isBackingUp ? (language === 'bn' ? 'ব্যাকআপ হচ্ছে...' : 'Backing up...') : (language === 'bn' ? 'ব্যাকআপ নিন' : 'Backup Now')}
                    </button>
                    <button 
                      onClick={handleListBackups}
                      className="py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
                    >
                      <Upload size={16} />
                      {t.restore}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-10 text-center space-y-2">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.developer}</p>
                  <div className="flex flex-col items-center text-slate-600">
                    <p className="text-sm font-bold">শরিফুল ইসলাম</p>
                    <div className="flex items-center gap-2">
                      <Mail size={12} />
                      <p className="text-xs font-medium">{profile.email}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-300">My Balance v1.5.0 • Made with ❤️</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-slate-100 p-3 pb-6 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <IconButton icon={LayoutDashboard} active={activeTab === 'home'} onClick={() => setActiveTab('home')} themeColor={theme} />
        <IconButton icon={ArrowLeftRight} active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} themeColor={theme} />
        
        {/* FAB */}
        <button 
          onClick={() => {
            if (activeTab === 'savings') {
              if (savings.length > 0) {
                setSelectedSectorId(savings[0].id);
                setSavingsModalMode('adjust');
                setAdjustType('plus');
                setShowSavingsModal(true);
              } else {
                setSavingsModalMode('add');
                setShowSavingsModal(true);
              }
            } else if (activeTab === 'transactions') {
              setShowAddModal(true);
            } else {
              setShowAddModal(true);
            }
          }}
          className={`w-14 h-14 ${themeBg[theme]} rounded-full flex items-center justify-center text-white shadow-lg ${themeColors[theme].split(' ')[1]} -mt-14 border-4 border-white transition-all active:scale-90`}
        >
          <Plus size={32} />
        </button>

        <IconButton icon={Landmark} active={activeTab === 'savings'} onClick={() => setActiveTab('savings')} themeColor={theme} />
        <IconButton icon={SettingsIcon} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} themeColor={theme} />
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-slate-800 text-white' : 'bg-rose-500 text-white'
            }`}>
              {toast.type === 'success' ? <Check size={18} /> : <Trash2 size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Add Transaction Modal */}
        {showAddModal && (
          <Modal onClose={() => {
            setShowAddModal(false);
            setPreSelectedPerson(null);
            setAllowedTypesOverride(null);
            setInitialTypeOverride(null);
          }}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">
              {preSelectedPerson ? `${preSelectedPerson} - লেনদেন` : (activeTab === 'transactions' ? 'দেনাপাওনা যোগ করুন' : 'নতুন লেনদেন যোগ করুন')}
            </h3>
            <AddTransactionForm 
              onSubmit={addTransaction} 
              onCancel={() => {
                setShowAddModal(false);
                setPreSelectedPerson(null);
                setAllowedTypesOverride(null);
                setInitialTypeOverride(null);
              }} 
              themeColor={theme} 
              initialType={initialTypeOverride || (activeTab === 'transactions' ? 'receivable' : 'expense')}
              allowedTypes={allowedTypesOverride || (activeTab === 'transactions' ? ['receivable', 'payable'] : ['income', 'expense'])}
              persons={persons}
              preSelectedPerson={preSelectedPerson}
            />
          </Modal>
        )}

        {/* Add Person Modal */}
        {showPersonModal && (
          <Modal onClose={() => { setShowPersonModal(false); setPersonNameInput(''); }}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">নতুন ব্যক্তি যোগ করুন</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ব্যক্তির নাম</label>
                <input 
                  type="text" 
                  value={personNameInput}
                  onChange={e => setPersonNameInput(e.target.value)}
                  placeholder="যেমন: রহিম সাহেব"
                  className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${theme === 'emerald' ? 'focus:ring-emerald-500' : theme === 'indigo' ? 'focus:ring-indigo-500' : theme === 'rose' ? 'focus:ring-rose-500' : theme === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-lg font-bold text-slate-800`}
                />
              </div>
              <button 
                onClick={() => addPerson(personNameInput)}
                className={`w-full py-4 ${themeBg[theme]} text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform`}
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </Modal>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <Modal onClose={() => setShowProfileModal(false)}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">প্রোফাইল এডিট করুন</h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={40} className="text-slate-300" />
                    )}
                  </div>
                  <label className={`absolute -right-2 -bottom-2 p-2 ${themeBg[theme]} text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                    <Camera size={16} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfile({ ...profile, avatar: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">ছবি পরিবর্তন করুন</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">আপনার নাম</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-400 text-lg font-bold text-slate-800`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ইমেইল</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-400 text-sm font-medium text-slate-600`}
                  />
                </div>
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    showToast('প্রোফাইল আপডেট করা হয়েছে', 'success');
                  }}
                  className={`w-full py-4 ${themeBg[theme]} text-white font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-95`}
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Savings Modal */}
        {showSavingsModal && (
          <Modal onClose={() => { setShowSavingsModal(false); setSavingsInput(''); setSavingsDate(format(new Date(), 'yyyy-MM-dd')); }}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">
              {savingsModalMode === 'add' ? 'নতুন সঞ্চয় খাত যোগ করুন' : 
               adjustType === 'plus' ? 'টাকা যোগ করুন' : 'টাকা বিয়োগ করুন'}
            </h3>
            <div className="space-y-4">
              {savingsModalMode === 'add' ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">খাতের নাম</label>
                  <input 
                    type="text" 
                    value={savingsInput}
                    onChange={e => setSavingsInput(e.target.value)}
                    placeholder="যেমন: হজ্ব ফান্ড"
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-400 text-lg font-bold text-slate-800"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">পরিমাণ</label>
                      <input 
                        type="number" 
                        value={savingsInput}
                        onChange={e => setSavingsInput(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-400 text-xl font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">তারিখ</label>
                      <input 
                        type="date" 
                        value={savingsDate}
                        onChange={e => setSavingsDate(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-400 text-sm font-medium"
                      />
                    </div>
                  </div>
                </>
              )}
                <button 
                  onClick={() => {
                    if (savingsModalMode === 'add') {
                      if (savingsInput) {
                        setSavings([...savings, { 
                          id: Math.random().toString(36).substr(2, 9), 
                          name: savingsInput, 
                          balance: 0,
                          history: [] 
                        }]);
                        setShowSavingsModal(false);
                        setSavingsInput('');
                        showToast(language === 'bn' ? 'নতুন সঞ্চয় খাত যোগ করা হয়েছে' : 'New savings sector added', 'success');
                      }
                    } else {
                      const amount = parseFloat(savingsInput);
                      if (!isNaN(amount) && selectedSectorId) {
                        const historyItem: SavingsHistoryItem = {
                          id: Math.random().toString(36).substr(2, 9),
                          amount,
                          type: adjustType,
                          date: savingsDate
                        };
                        
                        setSavings(savings.map(s => 
                          s.id === selectedSectorId 
                            ? { 
                                ...s, 
                                balance: s.balance + (adjustType === 'plus' ? amount : -amount),
                                history: [historyItem, ...(s.history || [])]
                              } 
                            : s
                        ));
                        
                        // Update selectedSavingsSector if it's open
                        if (selectedSavingsSector && selectedSavingsSector.id === selectedSectorId) {
                          setSelectedSavingsSector(prev => prev ? {
                            ...prev,
                            balance: prev.balance + (adjustType === 'plus' ? amount : -amount),
                            history: [historyItem, ...(prev.history || [])]
                          } : null);
                        }

                        setShowSavingsModal(false);
                        setSavingsInput('');
                        showToast(language === 'bn' ? 'সঞ্চয় সমন্বয় করা হয়েছে' : 'Savings adjusted', 'success');
                      }
                    }
                  }}
                  className={`w-full py-4 ${themeBg[theme]} text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform`}
                >
                  {t.confirm}
                </button>
            </div>
          </Modal>
        )}

        {/* Currency Modal */}
        {showCurrencyModal && (
          <Modal onClose={() => setShowCurrencyModal(false)}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">কারেন্সি পরিবর্তন করুন</h3>
            <div className="grid grid-cols-3 gap-4">
              {['৳', '$', '€', '£', '₹', '¥'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setProfile({ ...profile, currency: c });
                    setShowCurrencyModal(false);
                    showToast('কারেন্সি পরিবর্তন করা হয়েছে', 'success');
                  }}
                  className={`p-4 rounded-2xl text-xl font-bold transition-all ${
                    profile.currency === c ? `${themeBg[theme]} text-white shadow-lg` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Modal>
        )}

        {/* Restore Modal */}
        {showRestoreModal && (
          <Modal onClose={() => setShowRestoreModal(false)}>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">ব্যাকআপ থেকে রিস্টোর</h3>
            <p className="text-xs text-slate-400 text-center mb-6">আপনার গুগল ড্রাইভ থেকে একটি ব্যাকআপ ফাইল সিলেক্ট করুন</p>
            
            <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
              {isLoadingBackups ? (
                <div className="text-center py-10 space-y-3">
                  <div className={`w-10 h-10 border-4 border-slate-100 border-t-${theme}-500 rounded-full animate-spin mx-auto`} />
                  <p className="text-xs text-slate-400">ব্যাকআপ তালিকা লোড হচ্ছে...</p>
                </div>
              ) : backupFiles.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400 italic">কোন ব্যাকআপ ফাইল পাওয়া যায়নি</p>
                </div>
              ) : (
                backupFiles.map(file => (
                  <div
                    key={file.id}
                    className={`w-full p-4 bg-slate-50 rounded-2xl flex items-center justify-between hover:bg-slate-100 transition-all group ${isRestoring ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !isRestoring && handleRestoreFromDrive(file.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                        {file.createdTime ? format(new Date(file.createdTime), 'dd MMM yyyy, hh:mm a') : 'Unknown Date'}
                      </span>
                      <span className="text-[10px] text-slate-400">ID: {file.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isRestoring ? (
                        <div className={`w-5 h-5 border-2 border-slate-200 border-t-${theme}-500 rounded-full animate-spin`} />
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBackup(file.id);
                            }}
                            className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <ChevronRight size={18} className="text-slate-300" />
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => setShowRestoreModal(false)}
              className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl mt-4"
            >
              বন্ধ করুন
            </button>
          </Modal>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmConfig && (
          <Modal onClose={() => setShowConfirmModal(false)}>
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${confirmConfig.isDanger ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{confirmConfig.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{confirmConfig.message}</p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl active:scale-95 transition-transform"
                >
                  {confirmConfig.cancelText || 'বাতিল'}
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className={`flex-1 py-4 text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-lg ${confirmConfig.isDanger ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'}`}
                >
                  {confirmConfig.confirmText || 'নিশ্চিত করুন'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-t-[3rem] p-8 space-y-6 shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />
        {children}
      </motion.div>
    </div>
  );
}

// --- Sub-components ---

interface TransactionItemProps {
  transaction: Transaction;
  currency: string;
  onDelete?: () => void;
  themeColor: ThemeColor;
  showTime?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, currency, onDelete, themeColor, showTime = false }) => {
  const isPositive = transaction.type === 'income' || transaction.type === 'receivable';
  
  const typeColors = {
    income: 'bg-emerald-100 text-emerald-600',
    expense: 'bg-rose-100 text-rose-600',
    receivable: 'bg-blue-100 text-blue-600',
    payable: 'bg-amber-100 text-amber-600',
  };

  const themeText = {
    emerald: 'text-emerald-500',
    indigo: 'text-indigo-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
    slate: 'text-slate-800',
  };

  return (
    <Card className="p-4 flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${typeColors[transaction.type]}`}>
          {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : 
           transaction.type === 'expense' ? <ArrowDownCircle size={20} /> :
           <ArrowLeftRight size={20} />}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{transaction.category}</h4>
          <p className="text-[10px] text-slate-400 font-medium">
            {transaction.person ? `${transaction.person} • ` : ''}
            {format(new Date(transaction.date), showTime ? 'dd MMM, yyyy - hh:mm a' : 'dd MMM, yyyy')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-bold ${isPositive ? (themeColor === 'emerald' ? 'text-emerald-500' : themeText[themeColor]) : 'text-rose-500'}`}>
          {isPositive ? '+' : '-'}{currency}{transaction.amount.toLocaleString()}
        </p>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
            className="p-2 -mr-2 text-slate-300 hover:text-rose-500 transition-colors active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </Card>
  );
};

function SettingsItem({ icon: Icon, label, onClick, danger }: { icon: any, label: string, onClick?: () => void, danger?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 bg-white rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors border border-slate-100"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${danger ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
          <Icon size={20} />
        </div>
        <span className={`text-sm font-semibold ${danger ? 'text-rose-500' : 'text-slate-700'}`}>{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </button>
  );
}

interface AddTransactionFormProps {
  onSubmit: (t: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  themeColor: ThemeColor;
  initialType?: TransactionType;
  allowedTypes?: TransactionType[];
  persons: Person[];
  preSelectedPerson?: string | null;
}

function AddTransactionForm({ onSubmit, onCancel, themeColor, initialType = 'expense', allowedTypes = ['income', 'expense', 'receivable', 'payable'], persons, preSelectedPerson }: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [person, setPerson] = useState(preSelectedPerson || '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const themeBg = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-800',
  };

  const themeText = {
    emerald: 'text-emerald-500',
    indigo: 'text-indigo-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
    slate: 'text-slate-800',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    // Combine selected date with current time
    const now = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(now.getHours());
    selectedDate.setMinutes(now.getMinutes());
    selectedDate.setSeconds(now.getSeconds());

    onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      person,
      note,
      date: selectedDate.toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {allowedTypes.length > 1 && (
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {allowedTypes.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                type === t ? `bg-white ${themeText[themeColor]} shadow-sm` : 'text-slate-400'
              }`}
            >
              {t === 'income' ? 'আয়' : t === 'expense' ? 'ব্যয়' : t === 'receivable' ? 'পাবো' : 'দেবো'}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">পরিমাণ</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-xl font-bold text-slate-800`}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">তারিখ</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-sm font-medium`}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ক্যাটাগরি</label>
          <input 
            type="text" 
            placeholder="যেমন: বাজার"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-sm font-medium`}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ব্যক্তি (ঐচ্ছিক)</label>
          {allowedTypes.includes('receivable') ? (
            <select
              value={person}
              onChange={e => setPerson(e.target.value)}
              className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-sm font-medium`}
              required={type === 'receivable' || type === 'payable'}
            >
              <option value="">ব্যক্তি সিলেক্ট করুন</option>
              {persons.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder="নাম"
              value={person}
              onChange={e => setPerson(e.target.value)}
              className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-sm font-medium`}
            />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">নোট</label>
        <input 
          type="text" 
          placeholder="বিস্তারিত লিখুন..."
          value={note}
          onChange={e => setNote(e.target.value)}
          className={`w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : themeColor === 'indigo' ? 'focus:ring-indigo-500' : themeColor === 'rose' ? 'focus:ring-rose-500' : themeColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-slate-800'} text-sm font-medium`}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
        >
          বাতিল
        </button>
        <button 
          type="submit"
          className={`flex-2 py-4 ${themeBg[themeColor]} text-white font-bold rounded-2xl shadow-lg shadow-slate-200 hover:opacity-90 transition-all active:scale-95`}
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </form>
  );
}
