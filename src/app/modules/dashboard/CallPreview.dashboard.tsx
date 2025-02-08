import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import MuteIcon from '../../assets/icons/Mute.icon';
import DeclineIcon from '../../assets/icons/Decline.icon';
import SpeakerIcon from '../../assets/icons/Speaker.icon';
import {callPreviewStyles as styles} from './styles/callPreview.styles';
import {useTranslation} from 'react-i18next';


const CallPreview = () => {
  const {t: trans} = useTranslation();

  return (
    <Container showHeader={false}>
      <ImageBackground
        source={imageLink.callPreviewBg}
        style={globalStyles.flex1}>
        <View style={styles.topContainer}>
          <View style={styles.topContainerTextContainer}>
            <ImagePreview
              source={imageLink.avatar}
              styles={{width: rs(55), height: rs(55)}}
              borderRadius={55}
            />
            <View>
              <Text style={typographies(colors).ralewayNormal32}>
                {trans('John Smith')}
              </Text>
              <Text style={typographies(colors).ralewayMedium21}>
                {trans('connecting...')}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.softDark,
              ...customPadding(8, 33, 20, 33),
            }}>
            <View style={styles.bottomTab} />
            <View style={styles.bottomMiddleCont}>
              <View style={styles.center}>
                <TouchableOpacity activeOpacity={0.7} style={styles.icon}>
                  <MuteIcon />
                </TouchableOpacity>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {color: colors.white, marginTop: rs(6)},
                  ]}>
                  {trans('Mute')}
                </Text>
              </View>
              <View style={styles.center}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.icon, {backgroundColor: colors.error3}]}>
                  <DeclineIcon />
                </TouchableOpacity>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {color: colors.white, marginTop: rs(6)},
                  ]}>
                  {trans('End')}
                </Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.speaker}>
              <SpeakerIcon />
              <Text
                style={[
                  typographies(colors).ralewayMedium12,
                  {color: colors.white},
                ]}>
                {trans('Speaker')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default CallPreview;
