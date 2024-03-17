import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileHeader from '../../../components/ProfileHeader';
import RideOption from '../../../components/RideOption';
import colors from '../../../theme/colors';
import {useSelector} from 'react-redux';
import endpoint from '../../../utils/endpoint';
import axios from 'axios';
import Modal from 'react-native-modal';
import BtnComp from '../../../components/BtnComp';
import database from '@react-native-firebase/database';

const Home = ({navigation}) => {
  const {token, data, packageBought} = useSelector(state => state.authData);

  const pickupDates = [
    {package: 'Silver', hours: 100, price: '6,500'},
    {package: 'Gold', hours: 500, price: '32,500'},
    {package: 'Platinum', hours: 1000, price: '65,000'},
  ];

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{width: wp('100%'), zIndex: 50}}>
        <ProfileHeader
          username={data.name}
          profileImage={data.profile_image}
          onPress={() => navigation.navigate('MyProfile')}
        />
      </View>

      <View style={styles.internalCont}>
        <Text
          style={{color: 'white', fontSize: hp('2.7%'), fontWeight: 'bold'}}>
          Select your package
        </Text>
        <Text
          style={{color: 'white', fontSize: hp('1.5%'), marginTop: 5}}>
          Please Note (Package expire 1 year from purchase date)
        </Text>
      </View>

      {/* {packageBought ? ( */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectHourBlock')}
          style={{alignSelf: 'flex-start', margin: 25}}>
          <Text
            style={{
              fontSize: hp('2%'),
              borderBottomWidth: 1,
              fontWeight: 'bold',
              borderBottomColor: colors.themeBlue,
              color: colors.themeBlue,
            }}>
            Go to hour blocks{' '}
          </Text>
        </TouchableOpacity>
      {/* ) : null} */}

      <View
        style={{height: hp('82%'), marginTop: hp('6%'), paddingBottom: 50}}>
        <FlatList
          data={pickupDates}
          renderItem={({item}) => {
            return (
              <RideOption
                text={item.package}
                numberOfHours={item.hours}
                price={item.price}
                onPress={() =>
                  navigation.navigate('PaymentMethod', {
                    packageHours: item.hours,
                    packageName: item.package,
                  })
                }
              />
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  internalCont: {
    width: wp('100%'),
    height: hp('14%'),
    backgroundColor: colors.themeBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -hp('5%'),
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  thirdBlueCont: {
    width: wp('100%'),
    height: hp('15%'),
    backgroundColor: colors.themeBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -hp('5%'),
    zIndex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 15,
    marginBottom: 30,
  },
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
    paddingVertical: 26,
    paddingHorizontal: 15,
  },
});
