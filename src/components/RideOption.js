import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RideOption = ({onPress, numberOfHours = false, price = false, text}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.rideBtn}>
      <View>
        <Text style={{fontSize: hp('3%'), color: 'black', paddingLeft: 10}}>
          {text}
        </Text>
        {price ? (
          <Text
            style={{
              fontSize: hp('2%'),
              color: 'rgba(0,0,0,0.9)',
              width: wp('56%'),
              paddingLeft: 10,
              fontWeight: 'bold',
            }}>
            $ {price}
          </Text>
        ) : null}
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {numberOfHours ? (
          <View style={styles.priceContainer}>
            <Text style={{color: 'white', fontSize: 18}}>{numberOfHours}</Text>
            <Text style={{color: 'white', fontSize: 9}}>Hours</Text>
          </View>
        ) : null}
        <AntDesign
          name="right"
          color="grey"
          size={20}
          style={{marginLeft: 5, overflow: 'hidden'}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default RideOption;

const styles = StyleSheet.create({
  rideBtn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    width: wp('88%'),
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  priceContainer: {
    backgroundColor: colors.themeBlue,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 250,
  },
});
