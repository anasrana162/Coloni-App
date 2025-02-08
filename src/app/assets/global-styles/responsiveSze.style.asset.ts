import {Dimensions, StatusBar} from 'react-native';

const round = (value: number) => {
  const result = Math.round(Number(value));
  return result;
};
const {height, width} = Dimensions.get('screen');
const rs = (size: any, dimensions?: 'h' | 'w') => {
  const dimension = dimensions ?? 'h';
  if (size === 'wf') {
    return round(width);
  }
  if (size === 'hf') {
    return round(height);
  }
  if (size === 'hwh') {
    return round(height - (height * 0.08195 + (StatusBar?.currentHeight || 0)));
  }
  if (dimension === 'w') {
    if (width > 400) {
      const w = size / 313;
      return round(w * width);
    } else if (width <= 400 && width > 385) {
      const w = size / 315;
      return round(w * width);
    } else if (width <= 385 && width > 370) {
      const w = size / 317;
      return round(w * width);
    } else if (width <= 370 && width > 355) {
      const w = size / 319;
      return round(w * width);
    } else if (width <= 355 && width > 340) {
      const w = size / 321;
      return round(w * width);
    } else if (width <= 340 && width > 325) {
      const w = size / 323;
      return round(w * width);
    } else if (width <= 325 && width > 310) {
      const w = size / 325;
      return round(w * width);
    } else {
      const w = size / 327;
      return round(w * width);
    }
  } else if (dimension === 'h') {
    if (height > 800) {
      const h = size / 860;
      return round(h * height);
    } else if (height <= 800 && height > 750) {
      const h = size / 810;
      return round(h * height);
    } else if (height <= 750 && height > 700) {
      const h = size / 760;
      return round(h * height);
    } else if (height <= 700 && height > 650) {
      const h = size / 710;
      return round(h * height);
    } else if (height <= 650 && height > 600) {
      const h = size / 660;
      return round(h * height);
    } else if (height <= 600 && height > 550) {
      const h = size / 610;
      return round(h * height);
    } else {
      const h = size / 610;
      return round(h * height);
    }
  }
};

export default rs;
