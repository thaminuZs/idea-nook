import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const AVATAR_OPTIONS = ['🌟', '🚀', '🎨', '🦁', '🦄', '🦖', '🤖', '🐼'];
const AGE_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const GENDER_OPTIONS = [
  { id: 'boy', label: 'Boy', emoji: '👦' },
  { id: 'girl', label: 'Girl', emoji: '👧' },
  { id: 'other', label: 'Super Star', emoji: '⭐' },
];

export default function OnboardingScreen({
  initialProfile = null,
  onComplete,
  onCancel = null,
  isFirstTime = true,
}) {
  const { theme, scheme } = useTheme();

  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState(initialProfile?.age || null);
  const [gender, setGender] = useState(initialProfile?.gender || null);
  const [avatarEmoji, setAvatarEmoji] = useState(initialProfile?.avatarEmoji || '🌟');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isDark = scheme === 'dark';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const borderCol = isDark ? '#333333' : '#E2E8F0';
  const inputBg = isDark ? '#2A2A2A' : '#F8FAFC';
  const subtitleColor = isDark ? '#A0AEC0' : '#64748B';

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name! ✏️');
      return;
    }

    if (!age) {
      setErrorMsg('Please tap your age! 🎂');
      return;
    }

    if (!gender) {
      setErrorMsg('Please choose your badge! 🌈');
      return;
    }

    try {
      setSubmitting(true);
      await onComplete({
        name: name.trim(),
        age: Number(age),
        gender,
        avatarEmoji,
      });
    } catch (err) {
      setErrorMsg(err?.message || 'Could not save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heroEmoji}>{avatarEmoji}</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {isFirstTime ? 'Welcome to IdeaNook!' : 'Edit Your Profile'}
          </Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            {isFirstTime
              ? 'Tell us about yourself so we can show you the best DIY guides!'
              : 'Update your details anytime for personalized crafts and activities.'}
          </Text>
        </View>

        {/* Avatar Picker */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            Pick Your Companion 🐾
          </Text>
          <View style={styles.avatarRow}>
            {AVATAR_OPTIONS.map((item) => {
              const isSelected = avatarEmoji === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setAvatarEmoji(item)}
                  style={[
                    styles.avatarBtn,
                    isSelected && styles.avatarBtnSelected,
                  ]}
                >
                  <Text style={styles.avatarEmojiText}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Name Input */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            What is your name? ✏️
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: inputBg,
                color: theme.text,
                borderColor: borderCol,
              },
            ]}
            placeholder="e.g. Leo, Maya, Sam"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (errorMsg) setErrorMsg('');
            }}
            maxLength={25}
            autoCorrect={false}
            autoCapitalize="words"
          />
        </View>

        {/* Age Picker */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              How old are you? 🎂
            </Text>
            {age && (
              <Text style={styles.selectedBadgeText}>
                {age} years old
              </Text>
            )}
          </View>
          <View style={styles.ageGrid}>
            {AGE_OPTIONS.map((num) => {
              const isSelected = age === num;
              return (
                <Pressable
                  key={num}
                  onPress={() => {
                    setAge(num);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={[
                    styles.agePill,
                    {
                      backgroundColor: isSelected ? '#FF7043' : inputBg,
                      borderColor: isSelected ? '#FF7043' : borderCol,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.agePillText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {num}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Gender Choice */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            Choose your badge 🌈
          </Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((item) => {
              const isSelected = gender === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setGender(item.id);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={[
                    styles.genderCard,
                    {
                      backgroundColor: isSelected
                        ? isDark ? '#2D3748' : '#FFF7ED'
                        : inputBg,
                      borderColor: isSelected ? '#FF7043' : borderCol,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={styles.genderEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.genderLabel,
                      {
                        color: isSelected ? '#FF7043' : theme.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Error Notice */}
        {Boolean(errorMsg) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isFirstTime ? "Let's Start Crafting! 🚀" : 'Save Profile ✨'}
              </Text>
            )}
          </Pressable>

          {!isFirstTime && onCancel && (
            <Pressable
              style={[styles.cancelButton, { borderColor: borderCol }]}
              onPress={onCancel}
              disabled={submitting}
            >
              <Text style={[styles.cancelButtonText, { color: subtitleColor }]}>
                Cancel
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  selectedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF7043',
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarBtnSelected: {
    borderColor: '#FF7043',
    backgroundColor: '#FFEBE5',
    transform: [{ scale: 1.15 }],
  },
  avatarEmojiText: {
    fontSize: 26,
  },
  textInput: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: '600',
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  agePill: {
    minWidth: 46,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agePillText: {
    fontSize: 16,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  genderEmoji: {
    fontSize: 28,
  },
  genderLabel: {
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
