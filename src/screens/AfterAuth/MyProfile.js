import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import images from '../../assets/images';
import colors from '../../theme/colors';
import BtnComp from '../../components/BtnComp';
import GeneralHeader from '../../components/GeneralHeader';
import ProfileHistoryBar from '../../components/ProfileHistoryBar';
import endpoint from '../../utils/endpoint';
import {logout} from '../../redux/AuthSlice';
import database from '@react-native-firebase/database';
import Modal from 'react-native-modal';
import Input from '../../components/Input';
import Fontisto from 'react-native-vector-icons/Fontisto';

const MyProfile = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState('upcoming');
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state.authData);
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [riderDataFromFirebase, setRiderDataFromFirebase] = useState({});
  const [addReferral, setAddReferral] = useState(false);
  const [referralInput, setReferralInput] = useState('');

  const logoutAlert = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleLogout(),
        },
      ],
      {cancelable: true},
    );
  };

  const handleLogout = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/logout`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setLoading(true);
    axios
      .request(config)
      .then(response => {
        setLoading(false);
        if (response.data.success) {
          dispatch(logout());
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: `${response.data.message} 👋`,
          });
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: `${error.message} 👋`,
        });
      });
  };

  const fetchRiderDataFromFirebase = () => {
    database()
      .ref(`/users/${data.id}`)
      .on('value', resp => {
        if (resp.exists()) {
          setRiderDataFromFirebase(resp.val());
        } else {
          setRiderDataFromFirebase({});
        }
      });
    // .then(() => console.log("Data set successfully"))
  };

  const fetchRides = async () => {
    const allRidesOfUser = await database()
      .ref(`/users/${data.id}/myRides`)
      .once('value')
      .then(resp => (resp.exists() ? resp.val() : []));

    setRides([]);

    for (let eachRideId of allRidesOfUser) {
      const ridesRef = database().ref(`/rides/${eachRideId}`);
      ridesRef.once('value').then(snapshot => {
        if (snapshot.exists()) {
          setRides(oldRides => [...oldRides, snapshot.val()]);
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRiderDataFromFirebase();
      fetchRides();
    });
    return unsubscribe;
  }, [navigation]);

  function divideRides(ridesArray) {
    const dividedArrays = ridesArray.reduce(
      (acc, item) => {
        if (item.rideDetails.currentRide === 'completed') {
          acc.history.unshift(item);
        } else if (item.rideDetails.currentRide === 'upcoming') {
          acc.upcoming.unshift(item);
        }
        return acc;
      },
      {history: [], upcoming: []},
    );

    return dividedArrays;
  }

  const addReferralCode = async () => {
    if (
      referralInput > 0 &&
      referralInput !== riderDataFromFirebase.referralCode
    ) {
      const userIdOfReferredByPerson = await database()
        .ref(`/referrals/${referralInput}`)
        .once('value')
        .then(snapshot => (snapshot.exists() ? snapshot.val() : false));
      if (userIdOfReferredByPerson) {
        database()
          .ref(`/users/${data.id}`)
          .update({
            referralAdded: true,
          })
          .then(async () => {
            const successfullReferrals = await database()
              .ref(`/users/${userIdOfReferredByPerson}/successfullReferrals`)
              .once('value')
              .then(snapshot => (snapshot.exists() ? snapshot.val() : 0));
            await database()
              .ref(`/users/${userIdOfReferredByPerson}`)
              .update({
                successfullReferrals: successfullReferrals + 1,
              });
            setAddReferral(false);

            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Referral added successfully 😊',
            });
          })
          .catch(err => {
            console.log(`Some problem with adding referral ----->  ${err}`);
          });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: `This referral code does not exist 😓`,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: `Please add an appropriate referral 👋`,
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: 'white',
        paddingBottom: hp('5%'),
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <GeneralHeader
          onBackPress={() => navigation.goBack()}
          heading={'Profile'}
          linkText={'Edit'}
          onLinkPress={() => navigation.navigate('EditRiderProfile')}
        />
        <View
          style={{
            width: wp('86'),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{alignItems: 'flex-start', alignItems: 'center'}}>
            {data.profile_image ? (
              <Image
                source={{
                  uri: `${endpoint}/assets/uploads/user/${data.profile_image}`,
                }}
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: 'grey',
                  borderRadius: 250,
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <Fontisto
                name="person"
                size={75}
                color={'black'}
                style={{alignSelf: 'center', padding: 10, borderRadius: 8, overflow: 'hidden'}}
              />
            )}
            <Text
              style={{
                color: 'black',
                fontSize: hp('2.5%'),
                marginVertical: 10,
                textAlign: 'center',
              }}>
              {data?.name}
            </Text>
          </View>

          <View style={{marginTop: -10}}>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                fontWeight: '300',
              }}>
              Your Referral Code
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2.5%'),
                marginVertical: 3,
                fontWeight: '600',
              }}>
              {riderDataFromFirebase.referralCode}
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                fontWeight: '300',
              }}>
              Successful Referrals
            </Text>
            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2.5%'),
                marginVertical: 3,
                fontWeight: '600',
              }}>
              {riderDataFromFirebase?.successfullReferrals
                ? riderDataFromFirebase.successfullReferrals
                : 0}
            </Text>

            {!riderDataFromFirebase?.referralAdded ? (
              <BtnComp
                onPress={() => setAddReferral(true)}
                btnText={'Add Referral Code'}
                style={{
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
                textStyle={{fontWeight: '400'}}
              />
            ) : null}
          </View>
        </View>

        {/* PROFILE INFO */}
        <View
          style={{
            backgroundColor: 'black',
            width: wp('85%'),
            alignSelf: 'center',
            borderRadius: 18,
            marginTop: 30,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Contact No.
              </Text>
              <Text style={{color: 'lightgrey'}}>{data.phone}</Text>
            </View>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Email</Text>
              <Text style={{color: 'lightgrey'}}>{data.email}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: wp('85%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: 40,
          }}>
          <TouchableOpacity
            onPress={() => setSelectedOption('history')}
            style={[
              styles.container,
              selectedOption === 'history' ? styles.selected : null,
            ]}>
            <Text style={{fontSize: hp('2.2%'), color: 'black'}}>
              Ride History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedOption('upcoming')}
            style={[
              styles.container,
              selectedOption === 'upcoming' ? styles.selected : null,
            ]}>
            <Text style={{fontSize: hp('2.2%'), color: 'black'}}>
              Upcoming Rides
            </Text>
          </TouchableOpacity>
        </View>

        {selectedOption === 'history' &&
        divideRides(rides).history.length > 0 ? (
          <Text
            onPress={() =>
              navigation.navigate('RiderHistory', {
                ridesHistory: divideRides(rides).history,
              })
            }
            style={styles.viewAllText}>
            View All
          </Text>
        ) : selectedOption === 'upcoming' &&
          divideRides(rides).upcoming.length > 0 ? (
          <Text
            onPress={() =>
              navigation.navigate('UpcomingRiderRides', {
                upcomingRides: divideRides(rides).upcoming,
              })
            }
            style={styles.viewAllText}>
            View All
          </Text>
        ) : (
          <Text style={{color: 'grey', fontSize: hp('2%'), marginVertical: 25}}>
            There are no rides here!
          </Text>
        )}

        {selectedOption === 'history'
          ? divideRides(rides).history.map((eachRide, index) => {
              if (index < 2) {
                return (
                  <ProfileHistoryBar
                    key={index}
                    user_name={eachRide.driverDetails.driverName}
                    user_profile_image={
                      eachRide.driverDetails.driverProfileImage
                    }
                    hour_block={eachRide.rideDetails.hourBlock}
                    start_time={eachRide.rideDetails.startTime}
                  />
                );
              }
            })
          : divideRides(rides).upcoming.map((eachRide, index) => {
              if (index < 2) {
                return (
                  <ProfileHistoryBar
                    key={index}
                    user_name={eachRide.driverDetails.driverName}
                    user_profile_image={
                      eachRide.driverDetails.driverProfileImage
                    }
                    hour_block={eachRide.rideDetails.hourBlock}
                    start_time={eachRide.rideDetails.startTime}
                  />
                );
              }
            })}

        <View style={{width: wp('85%'), marginTop: 15}}>
          <BtnComp
            onPress={logoutAlert}
            btnText={
              loading ? (
                <ActivityIndicator size={25} color={'black'} />
              ) : (
                'Log out'
              )
            }
            style={{
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: colors.themeBlue,
            }}
            textStyle={{color: colors.themeBlue}}
          />
        </View>
      </View>

      {/* Modal to add a custom tip */}
      <Modal
        onBackButtonPress={() => {
          setAddReferral(false);
        }}
        isVisible={addReferral}
        onBackdropPress={() => setAddReferral(false)}>
        <View style={styles.tipAmountCont}>
          <Text style={styles.tipAmountHeading}>Enter the referral code</Text>

          <View style={{width: wp('60%'), alignSelf: 'center'}}>
            <Input
              keyboardType={'number-pad'}
              onChangeText={changedText => setReferralInput(changedText)}
              value={referralInput}
              placeholder={'e.g. 00000'}
              style={{color: 'black', fontSize: hp('2%')}}
            />
          </View>

          <BtnComp
            onPress={addReferralCode}
            btnText={'Add'}
            style={styles.tipAmountButtonStyling}
            textStyle={{color: 'white'}}
          />
        </View>
        <Toast />
      </Modal>
    </ScrollView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  selected: {borderBottomWidth: 3, borderColor: colors.themeBlue},
  viewAllText: {
    fontSize: hp('1.6%'),
    color: colors.themeBlue,
    borderBottomWidth: 1,
    borderBottomColor: colors.themeBlue,
    alignSelf: 'flex-end',
    marginRight: wp('8%'),
    fontWeight: '800',
    padding: 5,
  },
  tipAmountCont: {
    width: wp('85%'),
    // height: hp('30%'),
    backgroundColor: 'white',
    borderRadius: 30,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  tipAmountHeading: {
    color: 'black',
    alignSelf: 'center',
    marginVertical: 25,
    fontSize: hp('2.4%'),
  },
  tipAmountButtonStyling: {
    backgroundColor: 'black',
    width: wp('35%'),
    alignSelf: 'center',
    marginTop: 30,
  },
});
