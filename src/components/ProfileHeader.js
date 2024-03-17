import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../assets/images';
import endpoint from '../utils/endpoint';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ProfileHeader = ({username, profileImage, style, onPress}) => {
  // console.log(profileImage)
  return (
    <View
      style={[
        {
          width: wp('100%'),
          height: hp('10%'),
          backgroundColor: 'white',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
          alignSelf: 'center',
          flexDirection: 'row',
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        {profileImage ? (
          <Image
            source={{uri: `${endpoint}/assets/uploads/user/${profileImage}`}}
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'grey',
              borderRadius: 250,
              resizeMode: 'cover',
            }}
          />
        ) : (
          <Fontisto
            name="person"
            size={25}
            color={'black'}
            style={{alignSelf: 'center', backgroundColor: 'lightgrey', padding: 10, borderRadius: 8, overflow: 'hidden'}}
          />
        )}
        <Text
          style={{
            fontSize: hp('2.5%'),
            color: 'rgba(0,0,0,0.7)',
            marginLeft: 10,
          }}>
          Hi, {username}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({});
