import React, { createContext, useState, useContext } from 'react';
import { LanguageCode } from '../constants/i18n';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);

  return (
    <LanguageContext.Provider value={{
      lang, setLang,
      userProfile, setUserProfile,
      showWelcomeModal, setShowWelcomeModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
