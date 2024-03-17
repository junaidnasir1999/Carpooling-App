import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GeneralHeader from '../../../components/GeneralHeader';
import AcceptedRiderRide from '../../../components/AcceptedRiderRide';
import Modal from 'react-native-modal';
import BtnComp from '../../../components/BtnComp';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import database from '@react-native-firebase/database';


const UpcomingRiderRides = ({navigation, route}) => {
  const {data} = useSelector(state => state.authData);
  
  const {upcomingRides} = route.params;
  const [showQR, setShowQR] = useState(false);
  const [QRValue, setQRValue] = useState(null);

  const onPhonePress = driverPhoneNumber => {
    Linking.openURL(`tel:${driverPhoneNumber}`);
  };

  const onMessagePress = (
    fcm_token,
    otheruser_id,
    otheruser_name,
    otheruser_profile_image,
  ) => {
    navigation.navigate('ChatScreen', {
      fcm_token,
      otheruser_id,
      otheruser_name,
      otheruser_profile_image,
    });
  };

  useEffect(() => {
    database().ref(`/users/${data.id}`).on('value', (resp) => {
      if(resp.exists()){
        let userData = resp.val();
        if(userData?.rideStarted){
          navigation.navigate('RidingScreen', {currentRideId: userData?.currentRideId})
        }
      }
    })
  }, [])

  const handleShowingQR = (rideId) => {
    setShowQR(true)
    setQRValue(`${rideId}`)
  }

  const renderUpcoming = ({item}) => {
    return (
      <View style={{marginVertical: 15}}>
        <AcceptedRiderRide
          riderName={item.driverDetails.driverName}
          profileImage={item.driverDetails.driverProfileImage}
          rating={'5'}
          bookingHours={item.rideDetails.hourBlock}
          pickupLocation={item.rideDetails.pickupLocation}
          dropoffLocation={item.rideDetails.dropoffLocation}
          startTime={item.rideDetails.startTime}
          onPhonePress={() =>
            onPhonePress(item.driverDetails.driverPhoneNumber)
          }
          onMessagePress={() =>
            onMessagePress(
              'abc123',
              item.driverDetails.driverId,
              item.driverDetails.driverName,
              item.driverDetails.driverProfileImage,
            )
          }
          onShowQRPress={() => handleShowingQR(item.rideDetails.rideId)}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <GeneralHeader
              heading={'Upcoming Rides'}
              onBackPress={() => navigation.goBack()}
            />
          );
        }}
        keyExtractor={item => item.rideDetails.startTime}
        data={upcomingRides}
        renderItem={renderUpcoming}
      />

      {/* Modal to add a custom tip */}
      <Modal
        onBackButtonPress={() => {
          setShowQR(false);
        }}
        isVisible={showQR}
        onBackdropPress={() => setShowQR(false)}>
        <View
          style={{
            width: wp('90%'),
            height: hp('60%'),
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              position: 'absolute',
              top: 20,
              fontSize: hp('3%'),
              color: 'black',
              fontWeight: 'bold',
            }}>
            Show this QR code to the driver
          </Text>
          <QRCode value={QRValue} size={200} />
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default UpcomingRiderRides;

const styles = StyleSheet.create({});
