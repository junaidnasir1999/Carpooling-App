import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../assets/images';
import colors from '../theme/colors';
import endpoint from '../utils/endpoint';
import {convertToPresentableDate} from '../utils/functions';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ProfileHistoryBar = ({
  user_profile_image,
  user_name,
  start_time,
  hour_block,
}) => {
  return (
    <View
      style={{
        width: wp('86%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
      }}>
        {
          user_profile_image ? (
            <Image
              source={{uri: `${endpoint}/assets/uploads/user/${user_profile_image}`}}
              style={{
                width: 56,
                height: 56,
                borderRadius: 250,
                backgroundColor: 'lightgrey',
              }}
            />
          ) : (
            <Fontisto
              name="person"
              size={38}
              color={'black'}
              style={{
                alignSelf: 'center',
                backgroundColor: 'lightgrey',
                padding: 5,
                borderRadius: 8,
                overflow: 'hidden'
              }}
            />
          )
        }

      <View style={{marginLeft: 10}}>
        <Text style={{color: colors.themeBlue, fontSize: hp('2.3%')}}>
          {user_name}
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
          <Text style={{color: colors.themeBlack, fontSize: hp('1.8%')}}>
            {convertToPresentableDate(start_time)}
          </Text>
          {/* <Text style={{color: 'grey', marginLeft: 10}}>5.8mi . 14m</Text> */}
        </View>
      </View>

      <Text
        style={{
          color: 'rgba(0,0,0,0.8)',
          fontSize: hp('2%'),
          position: 'absolute',
          right: 0,
          top: 4,
        }}>{`${hour_block} Hours`}</Text>
    </View>
  );
};

export default ProfileHistoryBar;

const styles = StyleSheet.create({});
