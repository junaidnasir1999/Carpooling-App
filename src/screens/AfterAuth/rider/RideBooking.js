import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileHeader from '../../../components/ProfileHeader';
import colors from '../../../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import images from '../../../assets/images';
import Modal from 'react-native-modal';
import BtnComp from '../../../components/BtnComp';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Input from '../../../components/Input';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import {getDistance} from 'geolib';
import {API_KEY} from '@env';

Geocoder.init(API_KEY, {language: 'en'});

const RideBooking = ({navigation, route}) => {
  const {
    dropoffCoords,
    dropOffLocation,
    pickupCoords,
    pickupLocation,
    myLocation,
    startTime,
    endTime,
    hourBlock
  } = route.params;
  const mapRef = useRef();

  const [isModalVisible, setModalVisible] = useState(true);
  const [isSecondModalVisible, setSecondModalVisible] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);

  const [selectedTip, setSelectedTip] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [customTipInput, setCustomTipInput] = useState(0);
  const [customTipAmount, setCustomTipAmount] = useState(0);

  // This method will zoom out to show the whole path
  const fitToPath = () => {
    mapRef.current.fitToCoordinates([pickupCoords, dropoffCoords], {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      animated: true,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <MapView
        ref={mapRef}
        style={{
          position: 'absolute',
          width: wp('100%'),
          height: hp('100%'),
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        // scrollEnabled={false}
        // zoomEnabled={false}
        initialRegion={{
          latitude: (pickupCoords.latitude + dropoffCoords.latitude) / 2,
          longitude: (pickupCoords.longitude + dropoffCoords.longitude) / 2,
          latitudeDelta:
            Math.abs(pickupCoords.latitude - dropoffCoords.latitude) + 0.1,
          longitudeDelta:
            Math.abs(pickupCoords.longitude - dropoffCoords.longitude) + 0.1,
        }}>
        {pickupCoords && dropoffCoords ? (
          <MapViewDirections
            origin={pickupCoords}
            destination={dropoffCoords}
            onReady={fitToPath}
            apikey={API_KEY}
            strokeWidth={6}
            strokeColor={colors.themeBlue}
          />
        ) : null}

        <Marker coordinate={pickupCoords}>
          <Image
            source={require('../../../assets/images/marker.png')}
            style={{height: 35, width: 35}}
          />
        </Marker>
        <Marker coordinate={dropoffCoords}>
          <Image
            source={require('../../../assets/images/startFlag.png')}
            style={{height: 35, width: 35}}
          />
        </Marker>
      </MapView>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.goBack()}
        style={styles.backIcon}>
        <AntDesign name="arrowleft" size={25} color={'black'} />
      </TouchableOpacity>

      <View style={styles.destinationContainer}>
        <View style={styles.destinationArrowCont}>
          <Octicons name="dot-fill" color={colors.themeBlue} size={15} />
          <View style={styles.verticalLine} />
          <AntDesign name="caretdown" color={colors.themeBlue} size={10} />
        </View>

        <View style={{width: '85%'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PickupLocationPicker', {
                fromRideBooking: true,
                dropoffCoords,
                dropOffLocation,
                myLocation,
                startTime,
                endTime,
                hourBlock
              })
            }
            style={{
              height: hp('6.3%'),
              width: '96%',
              padding: 5,
              zIndex: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', width: '85%'}}>
              {pickupLocation.length > 70
                ? `${pickupLocation.substring(0, 70)}...`
                : pickupLocation}
            </Text>
            <AntDesign name="edit" size={25} color={colors.themeBlue} />
          </TouchableOpacity>

          <View
            style={{
              width: wp('75%'),
              height: 2,
              backgroundColor: colors.themeBlue,
            }}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DropoffLocationPicker', {
                pickupCoords,
                pickupLocation,
                myLocation,
                startTime,
                endTime,
                hourBlock
              })
            }
            style={{
              height: hp('6.3%'),
              width: '96%',
              padding: 5,
              zIndex: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', width: '85%'}}>
              {dropOffLocation.length > 70
                ? `${dropOffLocation.substring(0, 70)}...`
                : dropOffLocation}
            </Text>
            <AntDesign name="edit" size={25} color={colors.themeBlue} />
          </TouchableOpacity>
        </View>
      </View>

      <BtnComp
        onPress={() =>
          navigation.navigate('ChooseErrands', {
            dropoffCoords,
            dropOffLocation,
            pickupCoords,
            pickupLocation,
            myLocation,
            startTime,
            endTime,
            hourBlock
          })
        }
        btnText={'Book Now'}
        style={{
          position: 'absolute',
          bottom: 20,
          width: wp('90%'),
          alignSelf: 'center',
        }}
      />

      {/* THIRD MODAL */}
      {/* <Modal
        onBackButtonPress={() => {
          setSecondModalVisible(false);
          navigation.goBack();
        }}
        hasBackdrop={false}
        isVisible={isSecondModalVisible}
        style={{margin: 0}}>
        <View style={styles.thirdModalCont}>
          <View style={styles.secondModalSecondCont}>
            <Image style={{marginLeft: 20}} source={images.driverPic} />
            <View style={{marginLeft: 10}}>
              <Text style={{color: 'grey', fontSize: hp('1.7%')}}>
                Driver Name
              </Text>
              <Text style={{color: colors.themeBlue, fontSize: hp('2%')}}>
                John Smith
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              <AntDesign name="star" size={15} color={'#DFC100'} />
              <Text
                style={{color: 'grey', fontSize: hp('1.6%'), marginLeft: 3}}>
                5.0
              </Text>
            </View>
          </View>

          <View style={styles.secondModalMiddleCont}>
            <View>
              <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
                Pickup Location
              </Text>
              <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: hp('2.1%'),
                  marginTop: 3,
                }}>
                24, Ocean Avenue
              </Text>
            </View>
            <View>
              <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
                Drop off location
              </Text>
              <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: hp('2.1%'),
                  marginTop: 3,
                }}>
                26, Beach Avenue
              </Text>
            </View>
          </View>

          <View style={styles.secondModalBtnCont}>
            <View
              style={{
                width: wp('75%'),
                alignSelf: 'center',
              }}>
              <BtnComp
                btnText={'Send message'}
                onPress={() => {
                  setSecondModalVisible(false);
                  setRideCompleted(true);
                }}
                style={{borderWidth: 1, borderColor: colors.themeBlue}}
              />
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
              <FontAwesome5 name="phone-alt" size={25} color={'white'} />
            </TouchableOpacity>
          </View>

          <View
            style={{width: wp('90%'), alignSelf: 'center', marginBottom: 10}}>
            <BtnComp
              btnText={'Cancel'}
              style={styles.cancelBtn}
              textStyle={{color: colors.themeBlue, fontWeight: '400'}}
            />
          </View>
        </View>
      </Modal> */}


    </View>
  );
};

export default RideBooking;

const styles = StyleSheet.create({
  destinationContainer: {
    width: wp('90%'),
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: hp('8%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  destinationArrowCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  verticalLine: {
    width: 1,
    height: hp('5%'),
    backgroundColor: colors.themeBlue,
    marginVertical: 3,
  },
  firstModalCont: {
    height: hp('12%'),
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
  moneyText: {
    fontSize: hp('5%'),
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '900',
    marginBottom: -5,
    marginHorizontal: 5,
  },
  secondModalCont: {
    width: wp('85%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  bookingBtnCont: {
    width: wp('90%'),
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  reserveBtnCont: {width: wp('90%'), alignSelf: 'center', marginBottom: 10},
  thirdModalCont: {
    height: hp('40%'),
    width: wp('100%'),
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  secondModalSecondCont: {
    flexDirection: 'row',
    width: wp('100%'),
    alignSelf: 'center',
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  secondModalMiddleCont: {
    width: wp('85%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  secondModalBtnCont: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  phoneBtn: {
    backgroundColor: colors.themeBlue,
    width: 57,
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.themeBlue,
  },
  rideCompletedModal: {
    height: hp('70%'),
    width: wp('100%'),
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  profileInfoCont: {
    flexDirection: 'row',
    width: wp('100%'),
    alignSelf: 'center',
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonsCont: {
    width: wp('85%'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  smallCancelBtn: {
    borderWidth: 1,
    borderColor: colors.themeBlue,
    backgroundColor: 'white',
    borderColor: colors.themeBlue,
  },
  unselectedTipOption: {
    borderWidth: 1,
    borderColor: colors.themeBlue,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginRight: 10,
    marginVertical: 6,
  },
  unselectedTipText: {
    color: colors.themeBlue,
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  button: {
    position: 'absolute',
    bottom: 95,
    right: 16,
    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#68a2f9',
  },
  backIcon: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 250,
    position: 'absolute',
    top: 10,
    left: 15,
  },
});
