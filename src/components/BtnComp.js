import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../theme/colors'

const BtnComp = ({btnText, textStyle, style, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={[styles.btnCont, style]}>
      <Text style={[styles.btnText, textStyle]}>{btnText}</Text>
    </TouchableOpacity>
  )
}

export default BtnComp

const styles = StyleSheet.create({
  btnCont: {
    backgroundColor: colors.themeBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
    paddingVertical: 15
  },
  btnText: {
    color: 'white',
    fontSize: hp('1.8%'),
    fontWeight: 'bold'
  }
})