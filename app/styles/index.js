import { createIconSetFromFontello } from 'react-native-vector-icons';
import Colors from './colors';
import Images from './images';
import * as Scale from './scale';
import Typography from './typography';
import { styles as Mixins } from './mixins';

import fontelloConfig from './config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export { Colors, Images, Scale, Typography, Icon, Mixins };
