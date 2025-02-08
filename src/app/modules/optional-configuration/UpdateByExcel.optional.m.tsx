import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { useTranslation } from 'react-i18next';

const UpdateByExcelOptional = () => {
  const navigation = useCustomNavigation();
  const { t: trans } = useTranslation();
  return (
    <Container>
      <Header
         text={trans('Update by Excel')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateByExcel as never)
        }
      />
      <EmptyContent text={trans("There is no data to display" )}/>
    </Container>
  );
};

export default UpdateByExcelOptional;
