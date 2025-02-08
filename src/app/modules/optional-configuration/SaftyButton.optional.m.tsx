import React, { useRef, useEffect, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import { useTranslation } from 'react-i18next';
import InfoCard from '../../components/app/InfoCard.m';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { customPadding } from '../../assets/global-styles/global.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { colors } from '../../assets/global-styles/color.assets';
import Button from '../../components/core/button/Button.core';
import {themeStates} from '../../state/allSelector.state';
import { customUseSelector, customUseDispatch } from '../../packages/redux.package';
import saftyConfigationServices from '../../services/features/optionalConfiguration/saftybuttonConfiguration/saftyConfiguration.service';
import { checkEmptyValues, showAlertWithOneAction } from '../../utilities/helper';
import { addAction } from '../../state/features/optionalConfiguration/saftybuttonConfiguration/saftyConfiguration.slice';
import { useCustomNavigation } from '../../packages/navigation.package';



interface RadioButtonGroupProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  heading: string;
  defaultValue?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ options, selectedValue, onSelect, heading, defaultValue }) => {
  const { t: trans } = useTranslation();
  const {theme} = customUseSelector(themeStates);
  const [localSelectedValue, setLocalSelectedValue] = useState(defaultValue || selectedValue);
  const handleSelect = (value: string) => {
    setLocalSelectedValue(value);
    onSelect(value);
  };

  useEffect(() => {
    setLocalSelectedValue(selectedValue);
  }, [selectedValue]);

  const optionText = {
    ...typographies(colors).ralewayMedium12,
    color: theme === 'dark' ? colors.white : colors.black,
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => onSelect(option)}
        >
          <View style={styles.radioButton}>
            {localSelectedValue === option && <View style={styles.selectedDot} />}
          </View>
          <Text style={optionText}>{trans(option)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SaftyButtonOptional = () => {
  const { t: trans } = useTranslation();
  
  const [formData, setFormData] = useState({
    residentActivation: '',
    vigilanteActivation: '',
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await saftyConfigationServices.details();
      if (result?.body?.list?.length > 0) {
        const data = result.body.list[0];
        setFormData({
          residentActivation: data?.residentActivation || '',
          vigilanteActivation: data?.vigilanteActivation || '',
        });
      }
    };
    fetchData();
  }, []);

  
  const [residentActivation, setResidentActivation] = useState<string>('');
  const [vigilanteActivation, setVigilanteActivation] = useState<string>('');

  const handleSelect = (value: string, type: 'resident' | 'vigilante') => {
    let notificationSettings;
  
    // Define the notification settings based on the selected value
    switch (value) {
      case 'Message to vigilante':
        notificationSettings = { MessageToVigilante: true, MessageToResident: false, MessageToAdministrator: false };
        break;
      case 'Message to resident':
        notificationSettings = { MessageToVigilante: false, MessageToResident: true, MessageToAdministrator: false };
        break;
      case 'Message to administrator':
        notificationSettings = { MessageToVigilante: false, MessageToResident: false, MessageToAdministrator: true };
        break;
      default:
        notificationSettings = { MessageToVigilante: false, MessageToResident: false, MessageToAdministrator: false };
    }
  
    // Update formData with both the activation type and the notification settings
    setFormData(prevFormData => ({
      ...prevFormData,
      [type === 'resident' ? 'residentActivation' : 'vigilanteActivation']: value,
      [type === 'resident' ? 'residentNotificationSettings' : 'vigilanteNotificationSettings']: notificationSettings
    }));
  };

  const handleChange = (value: any, name?: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const loading = useRef(false);
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation()

  const handleSubmit = async () => {
    if (checkEmptyValues(formData, 'files')) {
      loading.current = true;
      try {
        const result = await saftyConfigationServices.create(formData);
        const { status, body, message } = result;

        if (status) {
          dispatch(addAction(body));
          showAlertWithOneAction({
            title: trans('Safty Configuration'),
            body: message,
          });
          navigation.goBack();
        } else {
          showAlertWithOneAction({
            title: trans('Safty Configuration'),
            body: message,
          });
        }
      } catch (error) {
        showAlertWithOneAction({
          title: trans('Safty Configuration'),
          body: trans('An error occurred'),
        });
      }
      loading.current = false;
    } else {
      showAlertWithOneAction({
        title: trans('Invalid'),
        body: trans('Please fill-up correctly'),
      });
    }
  };

  return (
    <Container>
      <Header text={trans("Safty Button")} />
      <View style={styles.contentWrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ ...customPadding(10, 20, 20, 20) }}
      >

        <InfoCard
          title={trans("Information")}
          body={trans("Indicate to whom the notification message will be sent in case the Safty Button is activated by the Resident or Security Guard.")}
        />
        <RadioButtonGroup
          options={['Message to vigilante', 'Message to resident', 'Message to administrator']}
          selectedValue={formData?.residentActivation}
          onSelect={(value) => handleSelect(value, 'resident')}
          heading={trans("Resident Activation")}
          defaultValue={formData?.residentActivation}
        />
        <RadioButtonGroup
          options={['Message to vigilante', 'Message to resident', 'Message to administrator']}
          selectedValue={formData?.vigilanteActivation}
          onSelect={(value) => handleSelect(value, 'vigilante')}
          heading={trans('Vigilante Activation')}
          defaultValue={formData?.vigilanteActivation}
        />
        </ScrollView>

         <View style={styles.buttonContainer}>
         <Button text={trans("Accept")} onPress={handleSubmit} />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    marginBottom: 10,
    ...typographies(colors).ralewaySemibold12,
    color: colors.primary,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  contentWrapper: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    //backgroundColor: colors.white,
  },
});

export default SaftyButtonOptional;
