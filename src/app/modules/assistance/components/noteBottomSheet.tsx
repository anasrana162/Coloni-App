import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../../../components/app/Badge.app';
import { customPadding, globalStyles } from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CrossIcon from '../../../assets/icons/Cross.icon.asset';
import Button from '../../../components/core/button/Button.core';
import NoteField from '../components/NoteField';

interface VisibleBottomSheetProps {
  onConfirm: (note: string) => void;
  onCancel: () => void;
  note: string;
  setNote: (note: string) => void;
}

const NoteBottomSheet: React.FC<VisibleBottomSheetProps> = ({ onConfirm, onCancel,note,setNote }) => {
  const { t: trans } = useTranslation();
  const { colors } = useTheme() as any;
  const values = useRef<{ note: string }>({ note: '' });
  const [inputValue, setInputValue] = useState(note);
  const handleChange = (value: string, name?: any) => {
    values.current = { ...values.current, [name]: value };

  };
console.log("checking set noteeee..........",note);
  const handleAddNote = () => {
    onConfirm(values.current.note);
    global.showBottomSheet({ flag: false });

  };
  

  return (
    <View style={{ ...customPadding(5, 15, 15, 15) }}>
      <View style={{ ...globalStyles.flexRow, justifyContent: "space-between", alignItems: "center" }}>
        <Text
          style={[
            typographies(colors).montserratSemibold16,
            { color: colors.primary, textAlign: 'center', lineHeight: rs(40) },
          ]}>
          {trans("Grades")}
        </Text>
        <TouchableOpacity onPress={() => {
          onCancel();
          global.showBottomSheet({ flag: false });
        }}>
          <CrossIcon />
        </TouchableOpacity>
      </View>
      <NoteField
        placeholder={trans("Write a note here")}
        name="note"
        onChangeText={(value) => handleChange(value, 'note')}
        defaultValue={note}
      />
      <Button
        text={trans("Add note")}
        onPress={handleAddNote}
      />
    </View>
  );
};

export default NoteBottomSheet;
