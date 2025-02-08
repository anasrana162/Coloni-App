import {
  View,
  Text,
  ViewStyle,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import EmptyIcon from '../../assets/images/svg/emptyIcon.svg';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import LeftArrowIcon from '../../assets/icons/LeftArrow.icon';
import {colors} from '../../assets/global-styles/color.assets';
interface PaginationProps {
  PageNo?: string | number;
  onNext: any;
  onBack: any;
}

const Pagination: React.FC<PaginationProps> = ({
  PageNo = '',

  onNext = () => {},
  onBack = () => {},
}) => {
  const {colors} = useTheme() as any;

  // const disableNext=
  //   console.log('PageNo', PageNo);

  return (
    <View style={styles.mainCont}>
      <TouchableOpacity onPress={onBack} style={styles.touchable}>
        <LeftArrowIcon width={30} height={30} fill={colors.primaryText} />
      </TouchableOpacity>
      <View
        style={[
          styles.pageCont,
          {
            borderColor: colors.primaryText,
          },
        ]}>
        <Text
          style={[
            styles.pageNotext,
            {
              color: colors.primaryText,
            },
          ]}>
          {PageNo}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onNext}
        style={[styles.touchable, {transform: [{rotate: '180deg'}]}]}>
        <LeftArrowIcon width={30} height={30} fill={colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  mainCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  touchable: {padding: 5, borderRadius: 20},
  pageCont: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
  },
  pageNotext: {
    ...typographies(colors).montserratMedium13,
  },
});
