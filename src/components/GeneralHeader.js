import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../assets/images';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../theme/colors';

const GeneralHeader = ({heading, onBackPress, linkText=false, onLinkPress}) => {
  return (
    <View
      style={{
        width: wp('100%'),
        height: hp('10%'),
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center'}}>
            <TouchableOpacity onPress={onBackPress} style={{position: 'absolute', left: 0, padding: 5}}>
                <Entypo name="chevron-left" size={30} color={'grey'} />
            </TouchableOpacity>
            <Text style={{fontSize: hp('2.5%'),color: 'rgba(0,0,0,0.7)', fontWeight: '600'}}>{heading}</Text>
            <TouchableOpacity onPress={onLinkPress} style={{position: 'absolute', right: 10}} >
                {
                    linkText ? (
                        <Text style={{fontSize: hp('2.3'), fontWeight: '500' ,color: colors.themeBlue, marginLeft: 10}}>{linkText}</Text>
                    ) : null
                }
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default GeneralHeader;

const styles = StyleSheet.create({});
