import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import database from '@react-native-firebase/database';
import {calculateAvgRating} from '../utils/functions';
import Fontisto from 'react-native-vector-icons/Fontisto';

const RideRequest = ({
  riderName,
  riderId,
  errands,
  riderProfile,
  pickupLocation,
  dropoffLocation,
  onRejectPress,
  onAcceptPress,
}) => {
  const [averageRating, setAverageRating] = useState(0);

  const totalRating = async userId => {
    database()
      .ref(`/users/${userId}/reviews`)
      .once('value')
      .then(resp => {
        if (resp.exists()) {
          const reviews = resp.val();
          setAverageRating(calculateAvgRating(reviews));
        }
      })
      .catch(error => {
        console.log(error); // Handle any errors and reject the promise if necessary
      });
  };

  useEffect(() => {
    totalRating(riderId);
  }, []);

  return (
    <View style={styles.mainCont}>
      <View style={styles.thirdModalCont}>
        <View style={styles.secondModalSecondCont}>
          <View style={{flexDirection: 'row', width: '70%'}}>
            {
              riderProfile ? (
                <Image
                  style={{
                    marginLeft: 10,
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    backgroundColor: 'grey',
                  }}
                  source={{uri: `${endpoint}/assets/uploads/user/${riderProfile}`}}
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
                    marginLeft: 12,
                    overflow: 'hidden'
                  }}
                />
              )
            }

            <View style={{marginLeft: 10, width: '45%'}}>
              <Text style={{color: 'grey', fontSize: hp('1.7%')}}>
                Rider Name
              </Text>
              <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: hp('2%'),
                  width: '100%',
                }}>
                {riderName.length > 12
                  ? `${riderName.slice(0, 12)}...`
                  : riderName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <AntDesign name="star" size={15} color={'#DFC100'} />
              <Text
                style={{color: 'grey', fontSize: hp('1.6%'), marginLeft: 3}}>
                {averageRating}
              </Text>
            </View>
          </View>
          {/* <View style={styles.secondModalBtnCont}>
            <TouchableOpacity style={styles.phoneBtn}>
              <FontAwesome5 name="phone-alt" size={20} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneBtn}>
              <MaterialCommunityIcons name="message" size={20} color={'white'} />
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={styles.secondModalMiddleCont}>
          <View style={{width: '47%'}}>
            <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
              Pickup Location
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('1.6%'),
                marginTop: 3,
              }}>
              {pickupLocation}
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
              Dropoff Location
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('1.6%'),
                marginTop: 3,
              }}>
              {dropoffLocation}
            </Text>
          </View>
        </View>

        <View style={{width: '90%', alignSelf: 'center', marginBottom: 15}}>
          {errands?.map((item, index) => {
            return (
              <View>
                <Text style={{color: 'black', fontSize: hp('2%'), fontWeight: 'bold'}}>{item.errandName}</Text>
                <Text
                  key={index}
                  style={{
                    color: 'grey',
                    fontSize: hp('1.7%'),
                    marginVertical: 4,
                  }}>
                  {item.address}
                </Text>
              </View>
            );
          })}
        </View>

        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={onRejectPress}
            activeOpacity={0.6}
            style={[styles.btn, {backgroundColor: 'lightgrey'}]}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAcceptPress}
            activeOpacity={0.6}
            style={[styles.btn, {backgroundColor: colors.themeBlue}]}>
            <Text style={[styles.btnText, {color: 'white'}]}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RideRequest;

const styles = StyleSheet.create({
  mainCont: {
    alignSelf: 'center',
  },
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
    width: '100%',
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  secondModalMiddleCont: {
    width: wp('80%'),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 15,
  },
  secondModalBtnCont: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
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
