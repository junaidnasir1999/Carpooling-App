import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import images from '../assets/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BtnComp from './BtnComp';
import endpoint from '../utils/endpoint';
import {convertDateFormat, convertToPresentableDate} from '../utils/functions';
import Fontisto from 'react-native-vector-icons/Fontisto';

const AcceptedRide = ({
  riderName,
  rating,
  pickupLocation,
  dropoffLocation,
  bookingHours,
  startTime,
  profileImage,
  compType = 'upcoming',
  onPhonePress,
  onMessagePress,
}) => {
  return (
    <View style={{alignSelf: 'center'}}>
      <View style={styles.thirdModalCont}>
        <View style={styles.secondModalSecondCont}>
          <View style={{flexDirection: 'row'}}>
            {
              profileImage ? (
                <Image
                  style={{width: 55, height: 55, borderRadius: 10}}
                  source={{uri: `${endpoint}/assets/uploads/user/${profileImage}`}}
                />
              ) : (
                <Fontisto
                  name="person"
                  size={35}
                  color={'black'}
                  style={{
                    alignSelf: 'center',
                    backgroundColor: 'lightgrey',
                    padding: 10,
                    borderRadius: 12,
                    marginTop: -5,
                    overflow: 'hidden'
                  }}
                />
              )
            }

            <View style={{marginLeft: 10}}>
              <Text style={{color: 'grey', fontSize: hp('1.7%')}}>Client</Text>
              <Text style={{color: colors.themeBlue, fontSize: hp('2%')}}>
                {riderName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              <AntDesign name="star" size={15} color={'#DFC100'} />
              <Text
                style={{color: 'grey', fontSize: hp('1.6%'), marginLeft: 3}}>
                {rating}
              </Text>
            </View>
          </View>

          {compType !== 'history' ? (
            <View style={styles.secondModalBtnCont}>
              <TouchableOpacity
                onPress={onPhonePress}
                activeOpacity={0.6}
                style={styles.phoneBtn}>
                <FontAwesome5 name="phone-alt" size={20} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMessagePress}
                activeOpacity={0.6}
                style={styles.phoneBtn}>
                <MaterialCommunityIcons
                  name="message"
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.secondModalMiddleCont}>
          <View style={{width: '45%'}}>
            <Text
              style={{color: 'grey', fontSize: hp('1.7%'), fontWeight: 'bold'}}>
              Pickup Location
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                marginTop: 3,
              }}>
              {pickupLocation}
            </Text>
          </View>
          <View style={{width: '45%'}}>
            <Text
              style={{color: 'grey', fontSize: hp('1.7%'), fontWeight: 'bold'}}>
              Booking Hours
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                marginTop: 3,
              }}>
              {`${bookingHours} Hours`}
            </Text>
          </View>
        </View>

        <View style={styles.secondModalMiddleCont}>
          <View style={{width: '45%'}}>
            <Text
              style={{color: 'grey', fontSize: hp('1.7%'), fontWeight: 'bold'}}>
              Drop off Location
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                marginTop: 3,
              }}>
              {dropoffLocation}
            </Text>
          </View>
          <View style={{width: '45%'}}>
            <Text
              style={{color: 'grey', fontSize: hp('1.7%'), fontWeight: 'bold'}}>
              Pickup Date and Time
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                marginTop: 3,
              }}>
              {convertToPresentableDate(startTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AcceptedRide;

const styles = StyleSheet.create({
  thirdModalCont: {
    width: wp('90%'),
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  secondModalSecondCont: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 20,
  },
  secondModalMiddleCont: {
    width: '100%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  secondModalBtnCont: {
    width: wp('28%'),
    flexDirection: 'row',
    marginLeft: '10%',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  phoneBtn: {
    backgroundColor: colors.themeBlue,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.themeBlue,
  },
  btn: {
    width: '50%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: hp('2%'),
  },
});
