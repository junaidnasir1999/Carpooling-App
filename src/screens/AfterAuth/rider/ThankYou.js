import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import images from '../../../assets/images';
import BtnComp from '../../../components/BtnComp';

const ThankYou = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: wp('80%'),
          height: hp('45%'),
          backgroundColor: 'white',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}>
          <AntDesign name="hearto" size={65} color={'#BE1E2D'} />
          <Text style={{color: 'black', fontSize: hp('3%')}} >Thanks for using</Text>
          <BtnComp onPress={() => navigation.navigate('SelectHourBlock')} btnText={'OK'} style={{backgroundColor: colors.themeBlack, width: wp('35%')}} />
        </View>

    
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({});
