import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
    customPadding,
    globalStyles,
} from '../../assets/global-styles/global.style.asset';
import LabelInput from '../../components/app/LabelInput.app';
import MultiLineInput from '../assistance/components/NoteField';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../../components/app/CustomSelect.app';


const AddUpdateByExcel2Optional = () => {
    const { t: trans } = useTranslation();
    return (
        <Container>
            <Header
                text={trans("Update by Excel")}
                rightIcon={<ImagePreview source={imageLink.saveIcon} />}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{
                    ...customPadding(20, 20, 20, 20),
                }}>
                <CustomSelect
                    placeholder={trans('Update Type')}
                    data={[
                        trans('Pay'),
                        trans('Resident'),
                    ]}
                
                />
                <LabelInput placeholder={trans('Use')}
                />
                <MultiLineInput
                    placeholder={trans('Copy and paste Information here')}
                />

            </ScrollView>
        </Container>
    );
};

export default AddUpdateByExcel2Optional;
