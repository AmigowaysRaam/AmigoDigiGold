import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { wp } from '../../../resources/dimensions';

const LANGUAGES = [
  { id: '1', name: 'English' },
  { id: '2', name: 'தமிழ்' },
  { id: '3', name: 'हिन्दी' },
  { id: '4', name: 'తెలుగు' },
  { id: '5', name: 'മലയാളം' },
];

export default function LanguageModal({
  visible,
  onClose,
  onSelectLanguage,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer}>
          <Text style={styles.title}>Select Language</Text>

          <FlatList
            data={LANGUAGES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.languageItem}
                onPress={() => {
                  onSelectLanguage(item);
                  onClose();
                }}
              >
                <Text style={styles.languageText}>
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: wp(4.5),
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 15,
  },
  languageItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
  },
  languageText: {
    fontSize: wp(4),
    fontFamily: 'Poppins_500Medium',
  },
});