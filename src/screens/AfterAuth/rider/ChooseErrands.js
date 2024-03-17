import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BtnComp from '../../../components/BtnComp';
import Modal from 'react-native-modal';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import axios from 'axios';
import endpoint from '../../../utils/endpoint';
import {useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import {convertDateFormat} from '../../../utils/functions';
import database from '@react-native-firebase/database';
import ErrandChoosingMaps from '../../../components/ErrandChoosingMaps';
import Input from '../../../components/Input';
import {API_KEY} from '@env'

const ChooseErrands = ({navigation, route}) => {
  const {
    dropoffCoords,
    dropOffLocation,
    pickupCoords,
    pickupLocation,
    myLocation,
    startTime,
    endTime,
    hourBlock,
  } = route.params;
  const [showErrandsChooser, setShowErrandChooser] = useState(false);
  const {token, data} = useSelector(state => state.authData);
  const [errands, setErrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentRideRequestId, setCurrentRideRequestId] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errandName, setErrandName] = useState('');

  const removeErrand = address => {
    setErrands(errands.filter(each => each.address !== address));
  };

  // const findDrivers = () => {
  //   let data = new FormData();
  //   data.append('hour_block', hourBlock);
  //   data.append('pickup_location', pickupLocation);
  //   data.append('drop_off_location', dropOffLocation);
  //   data.append('pickup_coords', JSON.stringify(pickupCoords));
  //   data.append('dropoff_coords', JSON.stringify(dropoffCoords));
  //   data.append('start_time', convertDateFormat(startTime));
  //   data.append('end_time', convertDateFormat(endTime));
  //   data.append('errands', JSON.stringify(errands))

  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: `${endpoint}/api/create-rider-request`,
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     data : data
  //   };

  //   setButtonLoading(true)

  //   axios.request(config)
  //   .then((response) => {
  //     setButtonLoading(false)

  //     if(response.data.success){
  //       setLoading(true)
  //       console.log("==============>>   ", response.data.data)
  //     }
  //   })
  //   .catch((error) => {
  //     setButtonLoading(false)
  //     console.log(error);
  //   });
  // };

  const findDrivers = async () => {
    setButtonLoading(true);
    const rideRequestsRef = database().ref(`/rideRequests`);
    const rideRequests = await rideRequestsRef
      .once('value')
      .then(resp => (resp.exists() ? resp.val() : []));
    const rideRequestId = Math.ceil(Math.random() * 100000);
    await rideRequestsRef
      .set([
        ...rideRequests,
        {
          request_id: rideRequestId,
          user_id: data.id,
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          user_profile_image: data.profile_image,
          hour_block: hourBlock,
          riderQualities: data.qualities.split(','),
          pickup_location: pickupLocation,
          drop_off_location: dropOffLocation,
          pickup_coords: pickupCoords,
          dropoff_coords: dropoffCoords,
          start_time: convertDateFormat(startTime),
          end_time: convertDateFormat(endTime),
          errands: errands,
        },
      ])
      .then(() => {
        setCurrentRideRequestId(rideRequestId);
        setButtonLoading(false);
        setLoading(true);

        database()
          .ref(`/users/${data.id}`)
          .update({
            currentRequestId: rideRequestId,
          })
          .then(() => console.log('ride request id is set to user'));

        const allRidesRef = database().ref(`/rides/${rideRequestId}`);
        allRidesRef.on('value', resp => {
          if (resp.exists()) {
            const currentUserReference = database().ref(`/users/${data.id}`);
            currentUserReference.once('value').then(resp => {
              if (resp.exists()) {
                currentUserReference.update({
                  hoursBalance: resp.val().hoursBalance - hourBlock,
                });
              }
            });

            const thisRideData = resp.val();

            if (thisRideData.rideDetails.currentRide !== 'completed') {
              navigation.navigate('AcceptedRideOfRider', {
                rideDetails: resp.val(),
              });
            }
          } else {
            console.log('The Data does not exists for a specific ride');
          }
        });
      })
      .catch(() => {
        setButtonLoading(false);
      });
  };

  const cancelRideRequest = async () => {
    const rideRequestsRef = database().ref(`/rideRequests`);
    const rideRequests = await rideRequestsRef
      .once('value')
      .then(resp => (resp.exists() ? resp.val() : []));
    const remainingRides = rideRequests.filter(
      rideRequest => rideRequest.request_id !== currentRideRequestId,
    );
    rideRequestsRef
      .set([...remainingRides])
      .then(() => {
        console.log('Your Ride Got Cancelled, Congrats');

        database()
          .ref(`/users/${data.id}`)
          .update({
            currentRequestId: [],
          })
          .then(() => console.log('ride request id is set to user'));

        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  const setErrandFromMaps = (latitude, longitude, address, errandName) => {
    const locationCoords = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setErrands(oldState => [
      ...oldState,
      {coords: locationCoords, address: address, errandName},
    ]);
    setShowErrandChooser(false);
    setShowLocationPicker(false);
  };

  if (showLocationPicker) {
    return (
      <ErrandChoosingMaps
        navigation={navigation}
        myLocation={myLocation}
        chooseErrand={setErrandFromMaps}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.internalCont}>
        <AntDesign
          name="leftcircle"
          size={25}
          color={'white'}
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20, overflow: 'hidden'}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: hp('2.7%'),
            fontWeight: 'bold',
          }}>
          Add Errands
        </Text>
      </View>

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 25}}>
        {errands.map((eachErrand, index) => {
          return (
            <View key={index} style={styles.timePickerContainer}>
              <TouchableOpacity
                onPress={() => removeErrand(eachErrand.address)}
                activeOpacity={0.6}
                style={{position: 'absolute', top: 10, right: 10, padding: 3}}>
                <Text style={{fontSize: hp('1.5%'), color: 'maroon'}}>
                  REMOVE
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: hp('2.4%'),
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginLeft: 5,
                  marginTop: 10,
                  width: '90%'
                }}>
                {eachErrand.errandName}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '96%',
                  marginTop: 10,
                }}>
                <Text style={{fontSize: hp('2%'), fontWeight: 'bold'}}>
                  {eachErrand.address}
                </Text>
              </View>
            </View>
          );
        })}

        <BtnComp
          onPress={() => setShowErrandChooser(true)}
          btnText={errands.length <= 0 ? 'Add an errand' : 'Add another   +'}
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            width: wp('88%'),
            marginVertical: 15,
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,

            elevation: 8,
            paddingVertical: 25,
            marginTop: 20,
          }}
          textStyle={{
            color: colors.themeBlue,
            fontWeight: '900',
            fontSize: hp('2.2%'),
          }}
        />
        <BtnComp
          onPress={findDrivers}
          btnText={
            buttonLoading ? (
              <ActivityIndicator color={'white'} size={30} />
            ) : (
              'Look For Drivers'
            )
          }
          style={{
            backgroundColor: colors.themeBlue,
            borderRadius: 20,
            width: wp('88%'),
            marginVertical: 15,
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,

            elevation: 8,
            paddingVertical: 25,
            marginTop: 20,
          }}
          textStyle={{
            color: 'white',
            fontWeight: '900',
            fontSize: hp('2.2%'),
          }}
        />
      </ScrollView>

      <Modal
        coverScreen={false}
        animationIn={'slideInLeft'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setShowErrandChooser(false)}
        isVisible={showErrandsChooser}
        onBackButtonPress={() => setShowErrandChooser(false)}
        style={{margin: 0}}>
        <View
          style={{
            width: '100%',
            height: '100%',
            // borderRadius: 8,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign
            name="downcircleo"
            size={25}
            color={'black'}
            onPress={() => setShowErrandChooser(false)}
            style={{position: 'absolute', top: 14, right: 14, overflow: 'hidden'}}
          />

          <Input
            placeholder="Errand Name"
            value={errandName}
            onChangeText={changedText => setErrandName(changedText)}
            containerStyle={{
              borderRadius: 8,
              width: '90%',
              borderWidth: 2,
              paddingVertical: 6,
              marginTop: 50,
            }}
          />

          <GooglePlacesAutocomplete
            styles={{
              container: {
                width: '90%',
                alignSelf: 'center',
                margin: 10,
                // marginTop: 50,
                zIndex: 2,
              },
              textInput: {
                height: 65,
                color: 'black',
                borderRadius: 8,
                fontSize: hp('2%'),
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: 'grey',
              },
            }}
            fetchDetails={true}
            placeholder={'Search for a location'}
            onPress={(data, details = null) => {
              const locationCoords = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              };
              setErrands(oldState => [
                ...oldState,
                {coords: locationCoords, address: details.formatted_address, errandName},
              ]);
              setErrandName('')
              setShowErrandChooser(false);
            }}
            query={{
              key: API_KEY,
              language: 'en',
            }}
          />

          <BtnComp
            onPress={() => setShowLocationPicker(true)}
            btnText={'Choose on maps instead'}
            style={{
              width: '90%',
              paddingVertical: 15,
              marginBottom: 15,
              borderRadius: 8,
            }}
          />
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
          <BtnComp
            btnText={'Cancel'}
            onPress={cancelRideRequest}
            style={{width: wp('75%'), borderRadius: 10, marginVertical: 20}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ChooseErrands;

const styles = StyleSheet.create({
  internalCont: {
    width: wp('100%'),
    height: hp('10%'),
    backgroundColor: colors.themeBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
    flexDirection: 'row',
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  timePickerContainer: {
    width: wp('88%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: hp('2%'),
  },
  locationIconCont: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
