import React from 'react';
import ImagePreview from '../core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useTranslation } from 'react-i18next';
import { customUseSelector } from '../../packages/redux.package';
import { languageStates } from '../../state/allSelector.state';

const LanguagePicker = () => {
  const { language } = customUseSelector(languageStates);
  const languageImageMap: { [key: string]: any } = {
    en: imageLink.unitedStates,
    es: imageLink.maxicanFlag,
  };
  const selectedImage = languageImageMap[language] || imageLink.unitedStates;

  return <ImagePreview source={selectedImage} />;
};

export default LanguagePicker;
