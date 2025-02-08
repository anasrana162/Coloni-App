import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TextProps,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {FlatList} from 'react-native-gesture-handler';
import {formatDate} from '../../utilities/helper';
import {customMargin} from '../../assets/global-styles/global.style.asset';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('screen');
// Define the prop types
interface ViewHistoryProps {
  title: string;
  //para: string;
  button1Text: string;
  button2Text: string;
  mainContStyle?: ViewStyle;
  onButton1Press: any;
  onButton2Press: any;
  onDismiss: any;
  data: any;
}
const ViewHistory: React.FC<ViewHistoryProps> = ({
  title,
  button1Text,
  button2Text,
  mainContStyle,
  onButton1Press,
  onButton2Press,
  onDismiss,
  data,
}) => {
  const {t: trans} = useTranslation();
  return (
    <View
      style={{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Pressable
        onPress={() => onDismiss()}
        style={styles.backGrounCont}></Pressable>
      <View style={[styles.container, mainContStyle]}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          style={{width: width - 100}}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {formatDate(item, 'yyyy-MM-DD \n HH:MM')}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <EmptyContent
              text={trans('There are no pin History!')}
              //forLoading={isLoading}
            />
          }
        />
        <View style={styles.flex_row}>
          {button1Text && (
            <TouchableOpacity
              onPress={() => onButton1Press()}
              style={styles.button1}>
              <Text style={[styles.button, {color: colors.black}]}>
                {button1Text}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onButton2Press()}
            style={styles.button2}>
            <Text style={styles.button}>{button2Text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ViewHistory;

const styles = StyleSheet.create({
  itemContainer: {
    ...customMargin(2, 10, 2, 10),
    padding: 10,
    backgroundColor: colors.gray,
    width: '100%',
  },
  itemText: {
    ...typographies(colors).ralewayBold15,
    color: colors.black,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  container: {
    width: width - 80,
    position: 'absolute',
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowRadius: 4,
  },
  backGrounCont: {
    width: width,
    height: height,
    backgroundColor: 'rgba(52,52,52,0.4)',
    position: 'absolute',
    zIndex: 100,
  },
  title: {
    ...typographies(colors).ralewayBold15,
    marginBottom: 10,
    color: colors.primary,
    marginTop: 10,
  },
  button: {
    ...typographies(colors).ralewayBold15,
    color: colors.black,
    marginVertical: 5,
  },
  flex_row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button1: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
    borderRadius: 10,
  },
  button2: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray1,
    borderRadius: 10,
  },
});
