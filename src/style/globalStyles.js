import { StyleSheet } from 'react-native';

import colors from '../utils/colors';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },

  subTitle: {
    fontSize: 15,
    color: colors.subText,
    marginTop: 4,
  },

  cardShadow: {
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.1,

    shadowRadius: 10,

    elevation: 6,
  },
});
