import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
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
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

const AcceptedRideOfRider = ({navigation, route}) => {
  const {rideDetails} = route.params;

  const [showQR, setShowQR] = useState(false);
  const [QRValue, setQRValue] = useState(null);

  const handleShowingQR = rideId => {
    setShowQR(true);
    setQRValue(`${rideId}`);
  };

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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: wp('100%'), zIndex: 50}}>
          <GeneralHeader
            heading={'Ride Details'}
            onBackPress={() => navigation.navigate('SelectHourBlock')}
          />
        </View>

        <AcceptedRideComp
          riderName={rideDetails.driverDetails.driverName}
          profileImage={rideDetails.driverDetails.driverProfileImage}
          rating={'5'}
          bookingHours={rideDetails.rideDetails.hourBlock}
          pickupLocation={rideDetails.rideDetails.pickupLocation}
          dropoffLocation={rideDetails.rideDetails.dropoffLocation}
          startTime={rideDetails.rideDetails.startTime}
          onPhonePress={() =>
            onPhonePress(rideDetails.driverDetails.driverPhoneNumber)
          }
          onMessagePress={() =>
            onMessagePress(
              'abc123',
              rideDetails.driverDetails.driverId,
              rideDetails.driverDetails.driverName,
              rideDetails.driverDetails.driverProfileImage,
            )
          }
        />

        <BtnComp
          onPress={() => handleShowingQR(rideDetails.rideDetails.rideId)}
          btnText={'Show QR Code to start the ride'}
          style={{width: '90%', alignSelf: 'center', borderRadius: 15}}
        />
      </ScrollView>

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
      </Modal>
    </View>
  );
};

export default AcceptedRideOfRider;

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
