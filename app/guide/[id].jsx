import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import GuideDetailView from '../../components/GuideDetailView';

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return <GuideDetailView guideId={Number(id)} onBack={handleBack} />;
}
