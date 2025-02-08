import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import { customPadding } from '../../assets/global-styles/global.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTranslation } from 'react-i18next';
import Button from '../../components/core/button/Button.core';
import { useCustomNavigation } from '../../packages/navigation.package';
import surveysService from '../../services/features/surveys/surveys.service';
import { checkEmptyValues, showAlertWithOneAction } from '../../utilities/helper';
import { apiResponse } from '../../services/features/api.interface';
import { updateAction } from '../../state/features/surveys/surveys.slice';
import { customUseDispatch } from '../../packages/redux.package';
import { addAction } from '../../state/features/expenses/expense.slice';

interface RadioButtonProps {
  value: string;
  selectedValue: string;
  onSelect: (index: number) => void;
  label: string;
  index: number;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  selectedValue,
  onSelect,
  label,
  index,
}) => {
  const isSelected = value === selectedValue;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onSelect(index)}
    >
      <View style={[styles.outerCircle, isSelected && styles.selectedOuterCircle]}>
        {isSelected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

const SurveyResidentScreen: React.FC<{ route: { params: { item: any } } }> = ({
  route: { params: { item } },
}) => {
  const values = useRef<{ choice: number;vote:boolean;comment:string}>({
    choice: 0,
    vote:false,
    comment:"test",

  });

  const [selectedOption, setSelectedOption] = useState<string>('');

  const dispatch = customUseDispatch();
  const { t: trans } = useTranslation();
  const navigation = useCustomNavigation<any>();
  const loading = useRef(false);

  const handleChange = (index: number) => {
    values.current.choice = index+1;
    setSelectedOption(item?.options[index]);
  };

  const handleButtonPress = async (isInFavour: boolean) => {
    values.current.vote = isInFavour;
  
    const payload = {
      ...values.current,
    };
    console.log("Checking payload:", payload);
  
    if (checkEmptyValues(payload)) {
      loading.current = true;
  
      try {
        const result = await surveysService.addVote(payload, item?._id);
        const { status, body, message } = result as apiResponse;
        if (status) {
          dispatch(addAction({ body }));
          navigation.goBack();
        } else {
          showAlertWithOneAction({
            title: trans('Surveys'),
            body: message,
          });
        }
      } catch (error) {
        showAlertWithOneAction({
          title: trans('Error'),
          body: trans('Something went wrong. Please try again.'),
        });
      } finally {
        loading.current = false;
      }
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill up correctly'),
      });
    }
  };
  

  return (
    <Container>
      <Header text={trans('Survey Answers')} />
      <ScrollView
        contentContainerStyle={{ ...customPadding(30, 25, 40, 25), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text style={styles.questionHeading}>{trans('Question')}</Text>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{item?.question}</Text>
        </View>
        <View style={styles.questionContainer}>
          {item?.options.map((option: string, index: number) => (
            <RadioButton
              key={index}
              value={option}
              selectedValue={selectedOption}
              onSelect={handleChange}
              label={option}
              index={index}
            />
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <View>
          <Button
            style={styles.inFavourBtn}
            text={trans('In Favour')}
            onPress={() => handleButtonPress(true)} 
          />
          <Button
            style={styles.inAgainstBtn}
            text={trans('In Against')}
            onPress={() => handleButtonPress(false)} 
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  questionHeading: {
    ...typographies(colors).ralewayMedium14,
    color: colors.primary,
  },
  questionText: {
    ...typographies(colors).ralewayMedium14,
    lineHeight: 24,
  },
  questionContainer: {
    ...customPadding(10, 2, 10, 2),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: {
    ...typographies(colors).ralewayMedium12,
    color: colors.gray1,
    lineHeight: 40,
    marginLeft: 10,
  },
  inFavourBtn: {
    marginBottom: 10,
    backgroundColor: colors.light,
  },
  inAgainstBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outerCircle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOuterCircle: {
    borderColor: colors.gray,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.gray2,
  },
  label: {
    marginLeft: 10,
    ...typographies(colors).montserratNormal12,
    color: colors.gray1,
  },
});

export default SurveyResidentScreen;
