import React, {useState} from 'react';
import {Image, ImageStyle, StyleSheet, View} from 'react-native';
import {isEmpty} from '../../utilities/helper';
import imageLink from '../../assets/images/imageLink';
import BaseSkeleton from './BaseSkeleton.skeleton';
interface imagePreviewProps {
  styles?: ImageStyle;
  source: {uri?: string; require?: number};
  borderRadius?: number;
  resizeMode?: String;
  tintColor?: string;
}
const ImagePreview: React.FC<imagePreviewProps> = ({
  styles = {},
  source,
  resizeMode = 'cover',
  borderRadius = 0,
  tintColor,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  let image = typeof source === 'object' ? {...source} : source;
  try {
    if (!isEmpty(image) && !isEmpty(image?.uri)) {
      image.uri = JSON.parse(image.uri ?? '');
    }
  } catch (e) {}
  return (
    <View style={style.relative}>
      <Image
        source={
          image?.uri ? image : Number(image) ? image : imageLink.placeholder
        }
        tintColor={tintColor}
        style={styles}
        resizeMode={resizeMode as any}
        onLoadEnd={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
      />
      {isLoading && (
        <View style={style.loaderView}>
          <BaseSkeleton
            height={'100%'}
            width={'100%'}
            borderRadius={borderRadius}
          />
        </View>
      )}
    </View>
  );
};
export default ImagePreview;

const style = StyleSheet.create({
  relative: {position: 'relative', overflow: 'hidden'},
  loaderView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    overflow: 'hidden',
  },
});
