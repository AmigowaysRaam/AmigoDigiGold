import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { wp } from '../../../resources/dimensions';
import { COLORS } from '../../../resources/colors';

export default function CommonBottomSheet({
  visible,
  onClose,
  onConfirm,
  title = 'Summary',
  subtitle = '',
  data = [],
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.bottomSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.dragHandle} />

          <Text style={styles.title}>{title}</Text>

          {!!subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
          <View style={styles.card}>
            {data?.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  index === data.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Text style={styles.label}>
                  {item.label}
                </Text>

                <Text style={styles.value}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              style={styles.confirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp(5),
  },

  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    textAlign: 'center',
    fontSize: wp(5),
    fontFamily: 'Poppins_600SemiBold',
    color: '#111',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: wp(4),
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  label: {
    color: '#666',
    fontFamily: 'Poppins_500Medium',
  },

  value: {
    color: '#111',
    fontFamily: 'Poppins_600SemiBold',
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    fontFamily: 'Poppins_600SemiBold',
  },

  confirmText: {
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});