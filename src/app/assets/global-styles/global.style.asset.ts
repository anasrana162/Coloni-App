import {StyleSheet} from 'react-native';
import rs from './responsiveSze.style.asset';

export const globalStyles:any = StyleSheet.create({
  relativeContainer: {flex: 1, position: 'relative'},
  flex1: {flex: 1},
  flexGrow1: {flexGrow: 1},
  centerView: {alignItems: 'center', flex: 1, justifyContent: 'center'},
  activityCenter: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexShrink1: {flexShrink: 1},
  emptyFlexBox: {flexGrow: 1},
  rowBetween: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  flexWithGap: {
    flexDirection: 'row',
    gap: 10,
  },
  justifyAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBetweenWithoutFlex: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  gap2: {gap: 2},
  rotate90: {transform: [{rotate: '90deg'}]},
  dot14: {height: 14, width: 14, borderRadius: 7},
  dot4: {height: 4, width: 4, borderRadius: 2},
  gap8: {gap: 8},
  gap4: {gap: 4},
});
export const shadow = (colors: any) =>
  StyleSheet.create({
    shadow: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    bottomBorder: {borderBottomWidth: 1, borderBottomColor: colors.gray5},
  });
export const customPadding = (top = 0, right = 0, bottom = 0, left = 0) => {
  return {
    paddingTop: rs(top),
    paddingRight: rs(right),
    paddingBottom: rs(bottom),
    paddingLeft: rs(left),
  };
};
export const customMargin = (top = 0, right = 0, bottom = 0, left = 0) => {
  return {
    marginTop: rs(top),
    marginRight: rs(right),
    marginBottom: rs(bottom),
    marginLeft: rs(left),
  };
};
export const customBorderRadius = (
  topLeft = 0,
  topRight = 0,
  bottomRight = 0,
  bottomLeft = 0,
) => {
  return {
    borderTopLeftRadius: topLeft,
    borderTopRightRadius: topRight,
    borderBottomRightRadius: bottomRight,
    borderBottomLeftRadius: bottomLeft,
  };
};
