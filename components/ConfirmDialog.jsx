import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import AppIcon from './AppIcon';

export default function ConfirmDialog({
  visible,
  title,
  message,
  icon = 'alert-circle-outline',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { theme } = useTheme();

  if (!visible) {
    return null;
  }

  const accentColor = destructive ? '#DC2626' : theme.primary;
  const accentSoftBg = destructive ? '#FEE2E2' : theme.primarySoft;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[
            styles.dialogCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: accentSoftBg,
                  borderColor: `${accentColor}35`,
                },
              ]}
            >
              <AppIcon name={icon} size={22} color={accentColor} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          </View>

          {Boolean(message) && (
            <Text style={[styles.message, { color: theme.textMuted }]}>
              {message}
            </Text>
          )}

          <View style={styles.actionsRow}>
            <Pressable
              style={[
                styles.btn,
                styles.cancelBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.btn,
                styles.confirmBtn,
                {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 20,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    lineHeight: 24,
  },
  message: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {},
  cancelBtnText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  confirmBtn: {},
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
});
