import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { TARGET_13_LANGUAGES, LanguageCode, LanguageItem, getTranslation } from '../constants/i18n';

interface Props {
  visible: boolean;
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onClose?: () => void;
}

export default function LanguageSelectionModal({
  visible,
  currentLang,
  onSelectLanguage,
  onClose,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tempLang, setTempLang] = useState<LanguageCode>(currentLang);

  const t = getTranslation(tempLang);

  const filteredLanguages = TARGET_13_LANGUAGES.filter((item: LanguageItem) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    );
  });

  const handleConfirm = () => {
    onSelectLanguage(tempLang);
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>🌐 {t.welcomeHeader}</Text>
          <Text style={styles.welcomeSub}>{t.chooseLang}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search language / Введите язык / 検索..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Target 13 Languages List */}
        <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
          {filteredLanguages.map((item: LanguageItem) => {
            const isSelected = tempLang === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.langItemCard, isSelected && styles.selectedLangCard]}
                onPress={() => setTempLang(item.code)}
              >
                <Text style={styles.flagText}>{item.flag}</Text>
                <View style={styles.nameContainer}>
                  <Text style={[styles.langName, isSelected && styles.selectedLangText]}>
                    {item.name}
                  </Text>
                  <Text style={styles.nativeName}>{item.nativeName}</Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Confirm Button Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>✨ {t.continueBtn}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7', paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 14 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 4 },
  welcomeSub: { fontSize: 13, color: '#636366', lineHeight: 18 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    marginBottom: 14,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1c1c1e' },
  clearIcon: { fontSize: 14, color: '#8e8e93', paddingHorizontal: 4 },
  scrollList: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  langItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  selectedLangCard: {
    borderColor: '#0a84ff',
    borderWidth: 2,
    backgroundColor: '#f0f8ff',
  },
  flagText: { fontSize: 28, marginRight: 14 },
  nameContainer: { flex: 1 },
  langName: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  selectedLangText: { color: '#0a84ff' },
  nativeName: { fontSize: 13, color: '#636366', marginTop: 2 },
  checkIcon: { fontSize: 18, color: '#0a84ff', fontWeight: 'bold' },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  confirmBtn: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
