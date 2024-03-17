import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar
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
import axios from 'axios';
import endpoint from '../../../utils/endpoint';
import Modal from 'react-native-modal';
import BtnComp from '../../../components/BtnComp';
import database from '@react-native-firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';

const SelectHourBlock = ({navigation}) => {
  const {data, token} = useSelector(state => state.authData);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [driverDataFromFirebase, setDriverDataFromFirebase] = useState({});
  const hourBlocks = [
    {hourBlock: '3 Hours'},
    {hourBlock: '6 Hours'},
    {hourBlock: '8 Hours'},
    {hourBlock: '12 Hours'},
  ];
  const [remainingPackageHours, setRemainingPackageHours] = useState(false);

  const notEnoughHoursBalance = () => {
    Alert.alert(
      'Not Enought Hours Balance!',
      "You don't have enough hours for the ride, do you want to buy some?",
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home'),
        },
      ],
      {cancelable: true},
    );
  };

  const onGoingRidePress = () => {
    navigation.navigate('RidingScreen', {
      currentRideId: driverDataFromFirebase.currentRideId,
    });
  };

  const hasOneYearPassed = (dateString) => {
    // Parse the string date into a JavaScript Date object
    const originalDate = new Date(dateString);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the difference in milliseconds between the current date and the original date
    const timeDifference = currentDate - originalDate;
  
    // Calculate the number of milliseconds in one year (365 days)
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
  
    // Check if the time difference is greater than or equal to one year
    return timeDifference >= oneYearInMilliseconds;
  }
  

  const checkIfTheHoursExpired = () => {
    
    database().ref(`/users/${data.id}/packagesBought`).once('value').then(resp => {
      if(resp.exists()){
        const packagesBought = resp.val()

        for(let eachPackage of packagesBought){
          let timeOfPurchase = eachPackage.timeOfPurchase
          if(hasOneYearPassed(timeOfPurchase)){            
            const leftPackages = packagesBought.filter(each => each.timeOfPurchase !== eachPackage.timeOfPurchase);

            database().ref(`/users/${data.id}`).update({
              hoursBalance: remainingPackageHours - eachPackage.hoursBought,
              packagesBought: leftPackages
            })
          }
        }
      }
    })
  }

  const fetchRiderData = () => {
    const riderRef = database().ref(`/users/${data.id}`);
    riderRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val()
        setDriverDataFromFirebase(userData);

        if(userData.rideStarted){
          navigation.navigate('RidingScreen', {
            currentRideId: userData.currentRideId,
          });
        }
        setRemainingPackageHours(userData?.hoursBalance ? userData?.hoursBalance : 0)
        if(userData?.currentRequestId){
          setLoading(true)
        }else {
          setLoading(false)
        }

        if(userData.hasOwnProperty('rideStated') && userData.rideStarted){
          navigation.navigate('RidingScreen', {currentRideId: userData.currentRideId})
        }
      }
    });

    // return riderRef.off('value');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfTheHoursExpired()
    })
    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    fetchRiderData();
  }, []);

  const cancelRideRequest = async() => {
    const rideRequestsRef = database().ref(`/rideRequests`)
    const rideRequests = await rideRequestsRef.once('value').then(resp => resp.exists() ? resp.val() : [])
    const remainingRides = rideRequests.filter(rideRequest => rideRequest.request_id !== driverDataFromFirebase.currentRequestId)
    rideRequestsRef.set([
      ...remainingRides
    ])
    .then(() => {
      console.log("Your Ride Got Cancelled, Congrats")

      database().ref(`/users/${data.id}`).update({
        currentRequestId: []
      })
      .then(() => console.log('ride request id is set to user'))
      
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
            Select your hour block
          </Text>
        </View>

        {driverDataFromFirebase.rideStarted ? (
          <TouchableOpacity
            onPress={() => onGoingRidePress()}
            activeOpacity={0.6}
            style={{
              backgroundColor: 'green',
              width: '90%',
              padding: 10,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: hp('2%'),
                marginRight: 15,
              }}>
              You have a ride going on!
            </Text>
            <AntDesign name="arrowright" size={25} color={'white'} />
          </TouchableOpacity>
        ) : null}

        <View
          style={{
            width: wp('88%'),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <Text style={styles.hoursText}>
            Package Hours: {remainingPackageHours}
          </Text>
          <BtnComp
            btnText={'Buy Package'}
            style={{paddingHorizontal: 15}}
            onPress={() => navigation.navigate('Home')}
          />
        </View>

        <View style={{marginTop: hp('5%'), paddingBottom: 50}}>
          <FlatList
            data={hourBlocks}
            renderItem={({item}) => {
              return (
                <RideOption
                  text={item.hourBlock}
                  onPress={() => {
                    if(remainingPackageHours > +item.hourBlock.split(' ')[0]){
                      navigation.navigate('ScheduleAndErrands', {
                        hours: item.hourBlock.split(' ')[0],
                      })
                    } else {
                      notEnoughHoursBalance()
                    }
                  }
                  }
                />
              );
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 10}}
          />
        </View>
      </ScrollView>
      <Modal
        coverScreen={false}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        isVisible={isLoaderVisible}
        style={{margin: 0}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={100} color={'white'} />
        </View>
      </Modal>


      <Modal
        coverScreen={false}
        animationIn={'bounceInUp'}
        animationOut={'bounceOutDown'}
        isVisible={loading}>
        <View
          style={{
            width: '100%',
            // height: '60%',
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            source={require('../../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{height: 300, width: 300}}
          />
          <Text
            style={{
              fontSize: hp('3%'),
              textAlign: 'center',
              width: '80%',
              color: colors.themeBlue,
              fontWeight: '900',
            }}>
            Wait while we find a driver for you
          </Text>
          <BtnComp btnText={'Cancel'} onPress={cancelRideRequest}  style={{width: wp('75%'), borderRadius: 10, marginVertical: 20}} />
        </View>
      </Modal>
    </View>
  );
};

export default SelectHourBlock;

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
  hoursText: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
  },
});
