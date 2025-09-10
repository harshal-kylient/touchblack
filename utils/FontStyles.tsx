import { createStyleSheet, useStyles } from "react-native-unistyles";

const fontFamilyStylesheet = createStyleSheet({
    grotesque700: {
        fontFamily: 'CabinetGrotesk-Extrabold',
        // fontWeight: '700'
    },
    grotesque400: {
        fontFamily: 'CabinetGrotesk-Regular',
    }
  });

export const { styles } = useStyles(fontFamilyStylesheet);
