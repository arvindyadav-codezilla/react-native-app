import { I18nManager } from 'react-native';
import { moderateScale } from './scale';

// usedoo english font family
const UE_FONT_LIGHT = 'Rubik-Light';
const UE_FONT_REGULAR = 'Rubik-Regular';
const UE_FONT_BOLD = 'Rubik-Bold';

// usedoo arabic font family
const UA_FONT_LIGHT = 'HelveticaNeueLTArabic-Light';
const UA_FONT_REGULAR = 'HelveticaNeueLTArabic-Roman';
const UA_FONT_BOLD = 'HelveticaNeueLTArabic-Bold';

// sizes

const xSmall = () => ({
  fontSize: moderateScale(12),
});
const smallU = () => ({
  fontSize: moderateScale(14),
});
const regularU = () => ({
  fontSize: moderateScale(16),
});
const mediumU = () => ({
  fontSize: moderateScale(18),
});
const largeU = () => ({
  fontSize: moderateScale(20),
});

// weights

const lightU = () => ({
  fontFamily: I18nManager.isRTL ? UA_FONT_LIGHT : UE_FONT_LIGHT,
});
// comment for testing
const normalU = () => ({
  fontFamily: I18nManager.isRTL ? UA_FONT_REGULAR : UE_FONT_REGULAR,
});

const boldU = () => ({
  fontFamily: I18nManager.isRTL ? UA_FONT_BOLD : UE_FONT_BOLD,
});

// styles
const header1 = () => ({
  ...largeU(), // 20
  ...boldU(),
});

const header2 = () => ({
  ...largeU(), // 20
  ...normalU(),
});

const header3 = () => ({
  ...mediumU(), // 18
  ...normalU(),
});

const standardU = () => ({
  ...regularU(), // 16
  ...normalU(),
});

const standardLight = () => ({
  ...regularU(), // 16
  ...lightU(),
});

const standardBold = () => ({
  ...regularU(), // 16
  ...boldU(),
});

const subTextU = () => ({
  ...smallU(), // 14
  ...normalU(),
});

const subTextBold = () => ({
  ...smallU(), // 14
  ...boldU(),
});

const subTextLight = () => ({
  ...smallU(), // 14
  ...lightU(),
});

const smallTextU = () => ({
  ...xSmall(), // 12
  ...normalU(),
});

const smallTextBold = () => ({
  ...xSmall(), // 12
  ...boldU(),
});

const smallTextLight = () => ({
  ...xSmall(), // 12
  ...lightU(),
});
export default {
  size: {
    xSmall,
    smallU,
    regularU,
    mediumU,
    largeU,
  },
  style: {
    header1,
    header2,
    header3,
    standardU,
    standardLight,
    standardBold,
    subTextU,
    subTextBold,
    subTextLight,
    smallTextU,
    smallTextBold,
    smallTextLight,
  },
  weights: {
    lightU,
    boldU,
    normalU,
  },
  fonts: {
    en: UE_FONT_REGULAR,
    ar: UA_FONT_REGULAR,
  },
};
