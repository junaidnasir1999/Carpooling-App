import {StyleSheet, Text, View, ActivityIndicator, Alert} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import database from '@react-native-firebase/database';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScanner = ({route, navigation}) => {
  const {rideDetails} = route.params;
  const [loading, setLoading] = useState(false);

  const startRide = async resp => {
    
    if(resp.data == rideDetails.rideDetails.rideId){
        const riderRef = database().ref(
            `/users/${rideDetails.riderDetails.riderId}`,
          );
          const driverRef = database().ref(
            `/users/${rideDetails.driverDetails.driverId}`,
          );
      
          let alreadyStartedRide = await riderRef
            .once('value')
            .then(snapshot =>
              snapshot.exists() ? snapshot.val().rideStarted : false,
            );
      
          if (!alreadyStartedRide) {
            await riderRef
              .update({
                rideStarted: true,
                currentRideId: rideDetails.rideDetails.rideId,
              })
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'The ride started successfully 😊',
                });
              })
              .catch(err => {
                Toast.show({
                  type: 'error',
                  text1: 'Oops',
                  text2: `${err.message} 😓`,
                });
              });
      
            await driverRef
              .update({
                rideStarted: true,
                currentRideId: rideDetails.rideDetails.rideId,
              })
              .then(() => {
                console.log('The Driver rideStarted value updated successfully');
              });

            await navigation.navigate('DrivingScreen', {rideDetails});
          } else {
            Alert.alert('You are already on a ride!');
          }
    }else {
        Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: `The QR does not match 😓`,
        });
    }

  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
      <View
        style={{
          width: '92%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        //   backgroundColor: 'lightgrey',
          position: 'absolute',
          top: 20
        }}>
        <AntDesign
          onPress={() => navigation.goBack()}
          name="arrowleft"
          size={25}
          color={'black'}
          style={{position: 'absolute', left: 0, overflow: 'hidden'}}
        />
        <Text style={{width: '80%', fontSize: hp('3%'), color: 'black'}} >Scan the QR code shown by the rider to start the ride</Text>
      </View>
      <View
        style={{
          height: hp('60%'),
          backgroundColor: 'black',
          overflow: 'hidden',
        }}>
        <QRCodeScanner onRead={startRide} />
      </View>

      {loading ? (
        <View
          style={{
            position: 'absolute',
            width: wp('90%'),
            height: hp('95%'),
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={80} color={'white'} />
        </View>
      ) : null}
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({});
