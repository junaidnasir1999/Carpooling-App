import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import images from '../../../assets/images';
import colors from '../../../theme/colors';
import BtnComp from '../../../components/BtnComp';
import GeneralHeader from '../../../components/GeneralHeader';
import ProfileHistoryBar from '../../../components/ProfileHistoryBar';
import endpoint from '../../../utils/endpoint';
import {logout} from '../../../redux/AuthSlice';
import database from '@react-native-firebase/database';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';

const DriverProfile = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState('upcoming');
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state.authData);
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [driverDataFromFirebase, setDriverDataFromFirebase] = useState({})
  const [totalTip, setTotalTip] = useState(0);

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
    auth().signOut()
    .then(() => {
      setLoading(false)
      dispatch(logout());
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

  const fetchDriverDataFromFirebase = () => {
    database()
      .ref(`/users/${data.id}`)
      .once('value')
      .then(resp => {
        if(resp.exists()){
          setDriverDataFromFirebase(resp.val())
        }else {
          setDriverDataFromFirebase({})
        }
      })
      .catch(err => console.log(err))
  }

  const fetchRides = async() => {
    const allRidesOfUser = await database().ref(`/users/${data.id}/myRides`).once('value').then(resp => resp.exists() ? resp.val() : [])
    setRides([])
    setTotalTip(0)
    
    for(let eachRideId of allRidesOfUser){
      const ridesRef = database().ref(`/rides/${eachRideId}`);
      ridesRef.once('value').then(snapshot => {
        if (snapshot.exists()) {
          const latestRide = snapshot.val();
          setRides(oldRides => [...oldRides, latestRide]);

          const thisTip = latestRide.rideDetails.tip ? latestRide.rideDetails.tip : 0
          setTotalTip(oldTips => oldTips + +thisTip);
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRides()
      fetchDriverDataFromFirebase()
    })
    return unsubscribe;
  }, [navigation])

  function divideRides(ridesArray) {
    
    const dividedArrays = ridesArray.reduce(
      (acc, item) => {        
        if (item.rideDetails.currentRide === 'completed') {
          acc.history.push(item);
        } else if(item.rideDetails.currentRide === 'upcoming') {
          acc.upcoming.push(item);
        }
        return acc;
      },
      {history: [], upcoming: []},
    );

    return dividedArrays;
  }


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
          onLinkPress={() => navigation.navigate('EditProfile')}
        />
        <View
          style={{
            width: wp('86'),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
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
            <Text style={{color: 'black', fontSize: hp('2.5%'), marginVertical: 10, textAlign: 'center', fontWeight: '500'}}>
              {data?.name}
            </Text>
          </View>
        </View>

        <BtnComp btnText={'Watch Training Videos'} style={{width: wp('80%')}} onPress={() => navigation.navigate('WatchTrainingVideos')} />

        {/* PROFILE INFO */}
        <View
          style={{
            backgroundColor: colors.themeBlue,
            width: wp('85%'),
            alignSelf: 'center',
            borderRadius: 18,
            marginTop: 20,
          }}>
          {/* <View style={{flexDirection: 'row'}}>
              <View style={{margin: 20}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>First Name</Text>
                <Text style={{color: 'lightgrey'}}>John</Text>
              </View>
              <View style={{margin: 20}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Last Name</Text>
                <Text style={{color: 'lightgrey'}}>Smith</Text>
              </View>
            </View> */}

          {/* <View
            style={{
              width: wp('75%'),
              alignSelf: 'center',
              height: 1,
              backgroundColor: 'lightgrey',
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Total Earning
              </Text>
              <Text style={{color: 'lightgrey'}}>$40,000</Text>
            </View>
          </View> */}

          {/* <View
            style={{
              width: wp('75%'),
              alignSelf: 'center',
              height: 1,
              backgroundColor: 'lightgrey',
            }}
          /> */}
          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Total Tips
              </Text>
              <Text style={{color: 'lightgrey'}}>{`$${totalTip}`}</Text>
            </View>
          </View>

          <View
            style={{
              width: wp('75%'),
              alignSelf: 'center',
              height: 1,
              backgroundColor: 'lightgrey',
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Total Rides
              </Text>
              <Text style={{color: 'lightgrey'}}>{driverDataFromFirebase.myRides?.length}</Text>
            </View>
          </View>
        </View>

        <View
          style={styles.bottomCont}>
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

        {
          selectedOption === 'history' && divideRides(rides).history.length > 0 ? (
            <Text onPress={() => navigation.navigate('DrivingHistory', {ridesHistory: divideRides(rides).history})} style={styles.viewAllText}>
              View All
            </Text>
          ) : selectedOption === 'upcoming' && divideRides(rides).upcoming.length > 0 ? (
            <Text onPress={() => navigation.navigate('UpcomingRides', {upcomingRides: divideRides(rides).upcoming})} style={styles.viewAllText}>
              View All
            </Text>
          ) : <Text style={{color: 'grey', fontSize: hp('2%'), marginVertical: 25}}>There are no rides here!</Text>
        }

        
        {
          selectedOption === 'history' ? (
            divideRides(rides).history.map((eachRide, index) => {
              if(index < 2){
                return (
                  <ProfileHistoryBar
                    key={index}
                    user_name={eachRide.riderDetails.riderName}
                    user_profile_image={eachRide.riderDetails.riderProfileImage}
                    hour_block={eachRide.rideDetails.hourBlock}
                    start_time={eachRide.rideDetails.startTime}
                  />
                );
              }
            })
          ) : divideRides(rides).upcoming.map((eachRide, index) => {
            if(index < 2){
              return (
                <ProfileHistoryBar
                  key={index}
                  user_name={eachRide.riderDetails.riderName}
                  user_profile_image={eachRide.riderDetails.riderProfileImage}
                  hour_block={eachRide.rideDetails.hourBlock}
                  start_time={eachRide.rideDetails.startTime}
                />
              );
            }
          })
        }


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
    </ScrollView>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  container: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  selected: {borderBottomWidth: 3, borderColor: colors.themeBlue},
  bottomCont: {
    flexDirection: 'row',
    width: wp('85%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  viewAllText: {
    fontSize: hp('1.6%'),
    color: colors.themeBlue,
    borderBottomWidth: 1,
    borderBottomColor: colors.themeBlue,
    alignSelf: 'flex-end',
    marginRight: wp('8%'),
    fontWeight: '800',
    padding: 5
  }
});
