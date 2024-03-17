import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProfileHeader from '../../../components/ProfileHeader';
import GeneralHeader from '../../../components/GeneralHeader';
import RideOption from '../../../components/RideOption';
import colors from '../../../theme/colors';
import BtnComp from '../../../components/BtnComp';
import {useSelector} from 'react-redux';
import AcceptedRideComp from '../../../components/AcceptedRideComp';
import database from '@react-native-firebase/database';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { calculateAvgRating } from '../../../utils/functions';

const AcceptedRide = ({navigation, route}) => {
  const {rideDetails, fromUpcoming} = route.params;
  const [riderQualities, setRiderQualities] = useState([]);
  const [averageRating, setAverageRating] = useState(0)
  
  const totalRating = async(userId) => {
    database()
      .ref(`/users/${userId}/reviews`)
      .once('value')
      .then((resp) => {
        if (resp.exists()) {
          const reviews = resp.val();
          setAverageRating(calculateAvgRating(reviews));
        }
      })
      .catch((error) => {
        console.log(error); // Handle any errors and reject the promise if necessary
      });
  };

  const fetchQualities = () => {
    database()
      .ref(`/users/${rideDetails.riderDetails.riderId}`)
      .once('value')
      .then(snapshot => {
        const userData = snapshot.val();
        setRiderQualities(userData.qualities);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchQualities();
      totalRating(rideDetails.riderDetails.riderId)
    });

    return unsubscribe;
  }, [navigation]);

  const onPhonePress = (driverPhoneNumber) => {
    Linking.openURL(`tel:${driverPhoneNumber}`);
  };

  const onMessagePress = (fcm_token, otheruser_id, otheruser_name, otheruser_profile_image) => {
    navigation.navigate('ChatScreen', {
      fcm_token,
      otheruser_id,
      otheruser_name,
      otheruser_profile_image,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: wp('100%'), zIndex: 50}}>
          <GeneralHeader
            heading={'Ride Details'}
            onBackPress={() => navigation.goBack()}
          />
        </View>

        <AcceptedRideComp
          riderName={rideDetails.riderDetails.riderName}
          profileImage={rideDetails.riderDetails.riderProfileImage}
          rating={averageRating}
          bookingHours={rideDetails.rideDetails.hourBlock}
          pickupLocation={rideDetails.rideDetails.pickupLocation}
          dropoffLocation={rideDetails.rideDetails.dropoffLocation}
          startTime={rideDetails.rideDetails.startTime}
          onPhonePress={() => onPhonePress(rideDetails.riderDetails.riderPhoneNumber)}
          onMessagePress={() => onMessagePress('abc123', rideDetails.riderDetails.riderId, rideDetails.riderDetails.riderName, rideDetails.riderDetails.riderProfileImage)}
        />

        <Text style={styles.heading}>Client's Social Style</Text>

        <View style={styles.qualitiesContainer}>
          {riderQualities.map((eachQuality, index) => {
            return (
              <View
                key={index}
                style={[styles.socialCont, {width: 110, height: 110}]}>
                <Text style={{color: 'white', fontWeight: 600}}>
                  {eachQuality}
                </Text>
              </View>
            );
          })}
        </View>

        {fromUpcoming ? (
          <View
            style={{
              width: wp('85%'),
              alignSelf: 'center',
              marginVertical: hp('3%'),
            }}>
            <BtnComp
              btnText={'Start Driving'}
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: colors.themeBlue,
              }}
              textStyle={{color: colors.themeBlue}}
              onPress={() => navigation.navigate('QRScanner', {rideDetails})}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default AcceptedRide;

const styles = StyleSheet.create({
  internalCont: {
    width: wp('100%'),
    height: hp('15%'),
    backgroundColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -hp('5%'),
    zIndex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  heading: {
    color: 'grey',
    fontSize: hp('2.8%'),
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: 15,
    fontWeight: 400,
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
  socialCont: {
    width: 80,
    height: 80,
    backgroundColor: colors.themeBlue,
    color: 'white',
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  qualitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: wp('100%'),
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
});
