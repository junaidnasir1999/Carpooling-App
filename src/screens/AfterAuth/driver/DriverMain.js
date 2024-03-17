import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Switch,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProfileHeader from '../../../components/ProfileHeader';
import RideOption from '../../../components/RideOption';
import colors from '../../../theme/colors';
import BtnComp from '../../../components/BtnComp';
import {useSelector} from 'react-redux';
import RideRequest from '../../../components/RideRequest';
import axios from 'axios';
import endpoint from '../../../utils/endpoint';
import Modal from 'react-native-modal';
import database from '@react-native-firebase/database';
import {calculateAvgRating} from '../../../utils/functions';

// const rideRequestsData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];

const DriverMain = ({navigation}) => {
  const {data, token} = useSelector(state => state.authData);
  const [driverDataFromFirebase, setDriverDataFromFirebase] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequestsData, setRideRequestsData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // const requestRiders = () => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `${endpoint}/api/driver-request`,
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   };

  //   axios.request(config)
  //   .then((response) => {
  //     if(response.data.success){
  //       console.log("============>>     ", response.data.data)
  //       setRideRequestsData(response.data.data)
  //     }else {
  //       console.log(response.data.message)
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error.message);
  //   });
  // }

  // const acceptRide = id => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `${endpoint}/api/driver-rider-request/${id}/Accept`,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   setShowLoader(true);

  //   axios
  //     .request(config)
  //     .then(response => {
  //       setShowLoader(false);

  //       if (response.data.success) {
  //         navigation.navigate('AcceptedRide', {riderData: response.data.data});
  //       }
  //     })
  //     .catch(error => {
  //       setShowLoader(false);

  //       console.log(error);
  //     });
  // };

  const acceptRide = async (requestId, rideDetails) => {
    const rideRequestsRef = database().ref(`/rideRequests`);
    const driverRef = database().ref(`/users/${data.id}`);
    const riderRef = database().ref(`/users/${rideDetails.user_id}`);

    const rideRequests = await rideRequestsRef
      .once('value')
      .then(resp => resp.val());

    const remainingRides = rideRequests.filter(
      rideRequest => rideRequest.request_id !== requestId,
    );

    rideRequestsRef
      .set([...remainingRides])
      .then(() => {
        console.log('Your Ride Got Cancelled, Congrats');
      })
      .catch(err => {
        console.log(err);
      });

    const allRidesRef = database().ref(`/rides`);
    const allRides = await allRidesRef
      .once('value')
      .then(resp => (resp.exists() ? resp.val() : {}));

    allRidesRef
      .set({
        ...allRides,
        [requestId]: {
          rideDetails: {
            rideId: requestId,
            currentRide: 'upcoming',
            pickupCoords: rideDetails.pickup_coords,
            dropoffCoords: rideDetails.dropoff_coords,
            pickupLocation: rideDetails.pickup_location,
            dropoffLocation: rideDetails.drop_off_location,
            errands: rideDetails.errands,
            hourBlock: rideDetails.hour_block,
            startTime: rideDetails.start_time,
            endTime: rideDetails.end_time,
          },
          riderDetails: {
            riderId: rideDetails.user_id,
            riderName: rideDetails.user_name,
            riderProfileImage: rideDetails.user_profile_image,
            riderEmail: rideDetails.user_email,
            riderPhoneNumber: rideDetails?.user_phone,
          },
          driverDetails: {
            driverId: data.id,
            driverName: data.name,
            driverProfileImage: data.profile_image,
            driverEmail: data.email,
            driverPhoneNumber: data.phone,
          },
        },
      })
      .then(async () => {
        await riderRef.once('value').then(resp => {
          const myRides = resp.val().myRides ? resp.val().myRides : [];
          riderRef.update({
            currentRequestId: [],
            myRides: [...myRides, requestId],
          });
        });

        await driverRef.once('value').then(resp => {
          const myRides = resp.val().myRides ? resp.val().myRides : [];
          driverRef.update({
            myRides: [...myRides, requestId],
          });
        });

        const wholeRideDetails = await database()
          .ref(`/rides/${requestId}`)
          .once('value')
          .then(async resp => {
            return await resp.val();
          });

        await navigation.navigate('AcceptedRide', {
          rideDetails: wholeRideDetails,
          fromUpcoming: true,
        });
      })
      .catch(err => {
        console.log('0-0-0-0-0-0-0-0-0----->       ', err);
      });
  };

  const requestRiders = snapshot => {
    if (snapshot.exists()) {
      setRideRequestsData(snapshot.val());
    } else {
      setRideRequestsData([]);
    }
  };

  const fetchRiderData = () => {
    const riderRef = database().ref(`/users/${data.id}`);
    riderRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const driverData = snapshot.val();
        setDriverDataFromFirebase(driverData);

        if(driverData.rideStarted){
          navigation.navigate('DrivingScreen', {rideId: driverData.currentRideId});
        }
      }
    });
  };

  useEffect(() => {
    fetchRiderData();
  }, []);

  useEffect(() => {
    const rideRequestRef = database().ref('/rideRequests');

    if (isOnline) {
      rideRequestRef.on('value', requestRiders);
    }

    return () => rideRequestRef.off('value', requestRiders);
  }, [isOnline]);

  const onGoingRidePress = async () => {
    const driverRef = database().ref(`/users/${data.id}`);

    driverRef.once('value').then(resp => {
      if(resp.exists()){
        const driverData = resp.val();
        navigation.navigate('DrivingScreen', {rideId: driverData.currentRideId});
      }
    });
  };

  const rejectRide = async rejectionId => {
    const filteredData = rideRequestsData.filter(eachRequest => {
      return eachRequest.request_id !== rejectionId;
    });
    setRideRequestsData(filteredData);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{width: wp('100%'), zIndex: 50}}>
        <ProfileHeader
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
          }}
          username={data.name}
          profileImage={data.profile_image}
          onPress={() => navigation.navigate('DriverProfile')}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => {
          return (
            <>
              {driverDataFromFirebase.rideStarted ? (
                <TouchableOpacity
                  onPress={() => onGoingRidePress()}
                  activeOpacity={0.6}
                  style={{
                    margin: 20,
                    backgroundColor: 'green',
                    width: '90%',
                    padding: 10,
                    borderRadius: 8,
                    flexDirection: 'row',
                    marginBottom: -10,
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
              <View style={[styles.offlineOrOnlineContainer]}>
                <Text
                  style={
                    !isOnline
                      ? styles.onlineText
                      : [styles.onlineText, {color: 'lightgrey'}]
                  }>
                  Offline
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#65C466'}}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setIsOnline(!isOnline);
                  }}
                  value={isOnline}
                />
                <Text
                  style={
                    isOnline
                      ? styles.onlineText
                      : [styles.onlineText, {color: 'lightgrey'}]
                  }>
                  Online
                </Text>
              </View>
            </>
          );
        }}
        data={rideRequestsData}
        renderItem={({item}) => {
          return isOnline ? (
            <RideRequest
              riderName={item.user_name}
              riderProfile={item.user_profile_image}
              riderId={item.user_id}
              pickupLocation={item.pickup_location}
              dropoffLocation={item.drop_off_location}
              errands={item.errands}
              onAcceptPress={() => acceptRide(item.request_id, item)}
              onRejectPress={() => rejectRide(item.request_id)}
            />
          ) : null;
        }}
        ListFooterComponent={() => {
          if (isOnline) {
            return (
              <Text
                style={{
                  color: 'rgba(0,0,0,0.7)',
                  alignSelf: 'center',
                  fontSize: hp('2%'),
                  marginVertical: 35,
                }}>
                Finding riders for you....
              </Text>
            );
          }
        }}
      />

      <Modal
        animationIn={'slideInLeft'}
        animationOut={'slideOutDown'}
        isVisible={showLoader}>
        <View>
          <ActivityIndicator color={'white'} size={100} />
        </View>
      </Modal>
    </View>
  );
};

export default DriverMain;

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

  offlineOrOnlineContainer: {
    width: wp('90%'),
    height: hp('6%'),
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: hp('3%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: 60,
    marginBottom: 10,
  },
  destinationArrowCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  verticalLine: {
    width: 1,
    height: hp('5%'),
    backgroundColor: 'grey',
    marginVertical: 3,
  },
  firstModalCont: {
    height: hp('40%'),
    width: wp('100%'),
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  firstModalTopCont: {
    flexDirection: 'row',
    width: wp('90%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
});
