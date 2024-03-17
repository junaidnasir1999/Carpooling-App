import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Rating, AirbnbRating} from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import endpoint from '../../../utils/endpoint';
import Input from '../../../components/Input';
import database from '@react-native-firebase/database';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {calculateAvgRating} from '../../../utils/functions';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {API_KEY} from '@env';

const RidingScreen = ({navigation, route}) => {
  const {currentRideId} = route.params;
  const [rideDetails, setRideDetails] = useState({});
  const [isModalVisible, setModalVisible] = useState(true);

  const [rideCompleted, setRideCompleted] = useState(false);
  const [selectedTip, setSelectedTip] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [customTipInput, setCustomTipInput] = useState(0);
  const [customTipAmount, setCustomTipAmount] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const [showExtendTimeModal, setShowExtendTimeModal] = useState(false);
  const [hoursIncreased, setHoursIncreased] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const mapRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      database()
        .ref(`/rides/${currentRideId}`)
        .on('value', resp => {
          if (resp.exists()) {
            const currentRide = resp.val();
            setRideDetails(currentRide);
            totalRating(currentRide?.driverDetails?.driverId);
          }
        });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (
      rideDetails?.rideDetails?.extendTimeRequest &&
      rideDetails?.rideDetails?.extendTimeRequest === 'accepted'
    ) {
      extendTime();
    }

    if (rideDetails?.rideDetails?.currentRide === 'completed') {
      setModalVisible(false);
      setRideCompleted(true);
    }
  }, [rideDetails]);

  const totalRating = async userId => {
    database()
      .ref(`/users/${userId}/reviews`)
      .once('value')
      .then(resp => {
        if (resp.exists()) {
          const reviews = resp.val();
          setAverageRating(calculateAvgRating(reviews));
        }
      })
      .catch(error => {
        console.log(error); // Handle any errors and reject the promise if necessary
      });
  };

  // This function will zoom out to show the whole path
  const fitToPath = () => {
    mapRef.current.fitToCoordinates(
      [
        rideDetails?.rideDetails.pickupCoords,
        rideDetails?.rideDetails.dropoffCoords,
      ],
      {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      },
    );
  };

  const onPhonePress = () => {
    const riderPhoneNumber = rideDetails?.driverDetails.driverPhoneNumber;
    Linking.openURL(`tel:${riderPhoneNumber}`);
  };

  const onMessagePress = () => {
    navigation.navigate('ChatScreen', {
      fcm_token: 'abc123',
      otheruser_id: rideDetails?.driverDetails.driverId,
      otheruser_name: rideDetails?.driverDetails.driverName,
      otheruser_profile_image: rideDetails?.driverDetails.driverProfileImage,
    });
  };

  const updatedEndTime = (endDateTime, numberOfHours) => {
    const endTimeInMS = new Date(endDateTime).getTime();
    const timeNeedsToBeAdded = numberOfHours * 3600000;

    const summedUpEndTime = endTimeInMS + timeNeedsToBeAdded;
    const formatedSummed = new Date(summedUpEndTime);

    return `${formatedSummed.getFullYear()}-${
      formatedSummed.getMonth() + 1
    }-${formatedSummed.getDate()} ${formatedSummed.getHours()}:${formatedSummed.getMinutes()}:${formatedSummed.getSeconds()}`;
  };

  const extendTime = async () => {
    await database()
      .ref(`/rides/${currentRideId}/rideDetails`)
      .update({
        hourBlock: +rideDetails?.rideDetails?.hourBlock + +hoursIncreased,
        endTime: updatedEndTime(
          rideDetails?.rideDetails?.endTime,
          hoursIncreased,
        ),
        extendTimeRequest: 'null',
      })
      .then(() => {
        console.log('The end time updated successfully');
      })
      .catch(err => {
        console.log('THIS IS THE ERROR -=--0-0-0-0->>      ', err);
      });

    const currentHoursBalance = await database()
      .ref(`/users/${rideDetails.riderDetails.riderId}/hoursBalance`)
      .once('value')
      .then(resp => resp.val());
    database()
      .ref(`/users/${rideDetails.riderDetails.riderId}`)
      .update({
        hoursBalance: currentHoursBalance - hoursIncreased,
      })
      .then(() => {
        console.log('The Problem solved');
        setHoursIncreased(0);
        setShowExtendTimeModal(false);
      })
      .catch(err => {
        console.log('Error with extending hours ==>     ', err);
      });
  };

  const handleExtendTime = () => {
    if (hoursIncreased > 0 && hoursIncreased % 1 === 0) {
      database()
        .ref(`/rides/${currentRideId}/rideDetails`)
        .update({
          extendTimeRequest: 'sent',
        })
        .then(() => {
          setShowExtendTimeModal(false);
          Toast.show({
            type: 'success',
            text1: 'Your Request has been sent 😊.',
            text2: `Wait for the dirver's response.`,
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert(
        'Invalid Input',
        'Please enter a whole number (no decimals or fractions).',
      );
    }
  };

  const handleReviewSubmit = async () => {
    if (rating) {
      const peopleReviews = await database()
        .ref(`/users/${rideDetails.driverDetails.driverId}/reviews`)
        .once('value')
        .then(resp => (resp.exists() ? resp.val() : []));

      database()
        .ref(`/users/${rideDetails.driverDetails.driverId}`)
        .update({
          reviews: [
            ...peopleReviews,
            {
              rating: rating,
              reviewText: reviewText,
            },
          ],
        })
        .then(() => {
          if (!selectedTip && !customTipAmount) {
            const riderRef = database().ref(
              `/users/${rideDetails?.riderDetails.riderId}`,
            );
            riderRef
              .update({
                rideStarted: false,
              })
              .then(() => {
                navigation.navigate('ThankYou');
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Thank you for your review 😊',
                });
              })
              .catch(err => {
                Toast.show({
                  type: 'error',
                  text1: 'Oops',
                  text2: `${err.message} 😓`,
                });
              });
          } else {
            const tip = selectedTip ? selectedTip : customTipAmount;
            database()
              .ref(`/rides/${currentRideId}/rideDetails`)
              .update({
                tip: tip,
              })
              .then(() => {
                navigation.navigate('ThankYou');
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: `Please give a rating 👋`,
      });
    }
  };

  if (Object.values(rideDetails).length <= 0) {
    return (
      <ActivityIndicator
        size={65}
        color={'black'}
        style={{marginTop: hp('40%')}}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AntDesign
        name="arrowleft"
        size={25}
        color={'black'}
        style={{
          position: 'absolute',
          top: 25,
          left: 25,
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 250,
          borderWidth: 1,
          borderColor: 'black',
          overflow: 'hidden'
        }}
        onPress={() => {
          if (rideDetails?.rideDetails?.currentRide === 'completed') {
            const riderRef = database().ref(
              `/users/${rideDetails?.riderDetails.riderId}`,
            );
            riderRef
              .update({
                rideStarted: false,
              })
              .then(() => {
                navigation.navigate('ThankYou');
                console.log('The ride ended successfully');
              })
              .catch(err => {
                Toast.show({
                  type: 'error',
                  text1: 'Oops',
                  text2: `${err.message} 😓`,
                });
              });
          } else {
            navigation.navigate('SelectHourBlock');
          }
        }}
      />

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
          latitude:
            (rideDetails?.rideDetails?.pickupCoords.latitude +
              rideDetails?.rideDetails?.dropoffCoords.latitude) /
            2,
          longitude:
            (rideDetails?.rideDetails?.pickupCoords.longitude +
              rideDetails?.rideDetails?.dropoffCoords.longitude) /
            2,
          latitudeDelta:
            Math.abs(
              rideDetails?.rideDetails?.pickupCoords.latitude -
                rideDetails?.rideDetails?.dropoffCoords.latitude,
            ) + 0.1,
          longitudeDelta:
            Math.abs(
              rideDetails?.rideDetails?.pickupCoords.longitude -
                rideDetails?.rideDetails?.dropoffCoords.longitude,
            ) + 0.1,
        }}>
        <MapViewDirections
          origin={rideDetails?.rideDetails?.pickupCoords}
          destination={rideDetails?.rideDetails?.dropoffCoords}
          onReady={fitToPath}
          apikey={API_KEY}
          strokeWidth={6}
          strokeColor={colors.themeBlue}
        />

        <Marker coordinate={rideDetails?.rideDetails?.pickupCoords}>
          <Image
            source={require('../../../assets/images/marker.png')}
            style={{height: 35, width: 35}}
          />
        </Marker>
        <Marker coordinate={rideDetails?.rideDetails?.dropoffCoords}>
          <Image
            source={require('../../../assets/images/startFlag.png')}
            style={{height: 35, width: 35}}
          />
        </Marker>
      </MapView>

      {/* MODAL */}
      <Modal
        onBackButtonPress={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
        hasBackdrop={false}
        coverScreen={false}
        isVisible={isModalVisible}
        style={{margin: 0}}>
        <View style={styles.thirdModalCont}>
          <View style={styles.secondModalSecondCont}>
            {rideDetails?.driverDetails?.driverProfileImage ? (
              <Image
                style={{marginLeft: 20, width: 50, height: 50, borderRadius: 8}}
                source={{
                  uri: `${endpoint}/assets/uploads/user/${rideDetails?.driverDetails?.driverProfileImage}`,
                }}
              />
            ) : (
              <Fontisto
                name="person"
                size={35}
                color={'black'}
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'lightgrey',
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 8,
                  overflow: 'hidden'
                }}
              />
            )}

            <View style={{marginLeft: 10, marginBottom: 5}}>
              <Text style={{color: 'grey', fontSize: hp('1.7%')}}>
                Driver Name
              </Text>
              <Text style={{color: colors.themeBlue, fontSize: hp('2%')}}>
                {rideDetails?.driverDetails.driverName}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
                marginBottom: 5,
              }}>
              <AntDesign name="star" size={15} color={'#DFC100'} />
              <Text
                style={{color: 'grey', fontSize: hp('1.6%'), marginLeft: 3}}>
                {averageRating}
              </Text>
            </View>

            <Text
              style={{
                color: colors.themeBlue,
                fontSize: hp('2%'),
                alignSelf: 'flex-end',
                margin: 5,
                width: '35%',
                textAlign: 'right',
              }}>
              Ride Hours: {rideDetails?.rideDetails?.hourBlock}
            </Text>
          </View>

          <View style={styles.secondModalMiddleCont}>
            <View style={{width: wp('40%')}}>
              <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
                Pickup Location
              </Text>
              <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: hp('2.1%'),
                  marginTop: 3,
                }}>
                {rideDetails?.rideDetails?.pickupLocation}
              </Text>
            </View>
            <View style={{width: wp('40%')}}>
              <Text style={{color: 'grey', fontSize: hp('1.9%')}}>
                Drop off location
              </Text>
              <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: hp('2.1%'),
                  marginTop: 3,
                  width: '100%',
                }}>
                {rideDetails?.rideDetails?.dropoffLocation}
              </Text>
            </View>
          </View>

          <View style={styles.secondModalBtnCont}>
            <TouchableOpacity style={styles.phoneBtn} onPress={onPhonePress}>
              <FontAwesome5 name="phone-alt" size={25} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneBtn} onPress={onMessagePress}>
              <MaterialCommunityIcons
                name="message"
                size={25}
                color={'white'}
              />
            </TouchableOpacity>
            <View
              style={{
                width: wp('48%'),
                alignSelf: 'center',
                marginVertical: 20,
              }}>
              <BtnComp
                btnText={'Request Extend Time'}
                onPress={() => setShowExtendTimeModal(true)}
                style={{borderWidth: 1, borderColor: colors.themeBlue}}
              />
            </View>
          </View>
        </View>

        <Modal
          onBackButtonPress={() => {
            setShowExtendTimeModal(false);
          }}
          isVisible={showExtendTimeModal}
          onBackdropPress={() => setShowExtendTimeModal(false)}>
          <View style={styles.extendHoursCont}>
            <Text style={styles.tipAmountHeading}>Extend your ride hours</Text>

            <View style={{width: '90%', alignSelf: 'center'}}>
              <Input
                keyboardType={'number-pad'}
                onChangeText={changedText => setHoursIncreased(changedText)}
                value={hoursIncreased}
                placeholder={'Please enter a whole number for hours.'}
                style={{color: 'black', fontSize: hp('2%'), width: '100%'}}
                containerStyle={{borderRadius: 8}}
              />
            </View>

            <BtnComp
              onPress={handleExtendTime}
              btnText={'Extend'}
              style={styles.extendTimeButton}
              textStyle={{color: 'white'}}
            />
          </View>
        </Modal>
      </Modal>

      {/* RIDE COMPLETION MODAL */}
      <Modal
        onBackButtonPress={() => {
          setRideCompleted(false);
          navigation.goBack();
        }}
        hasBackdrop={false}
        coverScreen={false}
        isVisible={rideCompleted}
        style={{margin: 0}}>
        <View style={styles.rideCompletedModal}>
          <View style={styles.profileInfoCont}>
            {rideDetails.driverDetails.driverProfileImage ? (
              <Image
                style={{width: 50, height: 50, borderRadius: 120}}
                source={{
                  uri: `${endpoint}/assets/uploads/user/${rideDetails.driverDetails.driverProfileImage}`,
                }}
              />
            ) : (
              <Fontisto
                name="person"
                size={35}
                color={'black'}
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'lightgrey',
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 8,
                  overflow: 'hidden'
                }}
              />
            )}

            <View style={{marginLeft: 10}}>
              <Text style={{color: 'grey', fontSize: hp('1.7%')}}>
                Driver Name
              </Text>
              <Text style={{color: colors.themeBlue, fontSize: hp('2%')}}>
                {rideDetails.driverDetails.driverName}
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
                {averageRating}
              </Text>
            </View>

            {/* <AntDesign
              name="hearto"
              size={25}
              color={'grey'}
              style={{position: 'absolute', top: 25, right: 25}}
            /> */}
          </View>

          <Text style={styles.heading}>Your Ride is Completed</Text>
          <Text style={styles.modalHeading}>
            TIP - Your gratitude is highly appreciated
          </Text>

          <View style={styles.tipAmountContainer}>
            <TouchableOpacity
              onPress={() => [setSelectedTip(20), setCustomTipAmount(0)]}
              style={[
                styles.unselectedTipOption,
                selectedTip === 20 ? {backgroundColor: colors.themeBlue} : null,
              ]}>
              <Text
                style={[
                  styles.unselectedTipText,
                  selectedTip === 20 ? {color: 'white'} : null,
                ]}>
                $20
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => [setSelectedTip(50), setCustomTipAmount(0)]}
              style={[
                styles.unselectedTipOption,
                selectedTip === 50 ? {backgroundColor: colors.themeBlue} : null,
              ]}>
              <Text
                style={[
                  styles.unselectedTipText,
                  selectedTip === 50 ? {color: 'white'} : null,
                ]}>
                $50
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => [setSelectedTip(100), setCustomTipAmount(0)]}
              style={[
                styles.unselectedTipOption,
                selectedTip === 100
                  ? {backgroundColor: colors.themeBlue}
                  : null,
              ]}>
              <Text
                style={[
                  styles.unselectedTipText,
                  selectedTip === 100 ? {color: 'white'} : null,
                ]}>
                $100
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTipModalVisible(true)}
              style={[
                styles.unselectedTipOption,
                {flexDirection: 'row'},
                customTipAmount ? {backgroundColor: colors.themeBlue} : null,
              ]}>
              <Text
                style={[
                  styles.unselectedTipText,
                  customTipAmount ? {color: 'white'} : null,
                ]}>
                {customTipAmount ? `$${customTipAmount}` : 'Custom Tip'}
              </Text>
              {customTipAmount ? (
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={'white'}
                  style={{marginLeft: 20}}
                />
              ) : null}
            </TouchableOpacity>
          </View>

          <View style={{width: wp('85%'), alignSelf: 'center', marginTop: 10}}>
            <Text style={{color: 'rgba(0,0,0,0.8)', fontSize: hp('1.9%')}}>
              Please rate your ride
            </Text>

            <AirbnbRating
              count={5}
              reviews={['Terrible', 'Bad', 'OK', 'Good', 'Amazing']}
              defaultRating={0}
              size={18}
              showRating={false}
              starContainerStyle={{alignSelf: 'flex-start', marginVertical: 8}}
              onFinishRating={number => setRating(number)}
            />

            <TextInput
              placeholder="Leave review"
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.ratingInput}
              value={reviewText}
              onChangeText={changedText => setReviewText(changedText)}
            />
          </View>

          <View style={styles.buttonsCont}>
            <View style={{width: wp('42%')}}>
              <BtnComp
                onPress={handleReviewSubmit}
                btnText={'Submit'}
                style={{borderWidth: 1, borderColor: colors.themeBlue}}
              />
            </View>
            <View style={{width: wp('42%')}}>
              <BtnComp
                onPress={() => {
                  const riderRef = database().ref(
                    `/users/${rideDetails?.riderDetails.riderId}`,
                  );
                  riderRef
                    .update({
                      rideStarted: false,
                    })
                    .then(() => {
                      navigation.navigate('ThankYou');
                      console.log('The ride ended successfully');
                    })
                    .catch(err => {
                      Toast.show({
                        type: 'error',
                        text1: 'Oops',
                        text2: `${err.message} 😓`,
                      });
                    });
                }}
                btnText={'Cancel'}
                style={styles.smallCancelBtn}
                textStyle={{color: colors.themeBlue, fontWeight: '400'}}
              />
            </View>
          </View>
        </View>

        {/* Modal to add a custom tip */}
        <Modal
          onBackButtonPress={() => {
            setTipModalVisible(false);
          }}
          isVisible={tipModalVisible}
          onBackdropPress={() => setTipModalVisible(false)}>
          <View style={styles.tipAmountCont}>
            <Text style={styles.tipAmountHeading}>Enter Tip Amount</Text>

            <View style={{width: wp('60%'), alignSelf: 'center'}}>
              <Input
                keyboardType={'number-pad'}
                onChangeText={changedText => setCustomTipInput(changedText)}
                value={customTipInput}
                placeholder={'$0'}
                style={{color: 'black', fontSize: hp('2%')}}
              />
            </View>

            <BtnComp
              onPress={() => {
                setCustomTipAmount(customTipInput);
                setSelectedTip(false);
                setTipModalVisible(false);
              }}
              btnText={'OK'}
              style={styles.tipAmountButtonStyling}
              textStyle={{color: 'white'}}
            />
          </View>
        </Modal>
      </Modal>
    </View>
  );
};

export default RidingScreen;

const styles = StyleSheet.create({
  offlineOrOnlineContainer: {
    width: wp('90%'),
    height: hp('6%'),
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: hp('10%'),
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
  },
  heading: {
    fontSize: hp('2.3%'),
    color: 'black',
    fontWeight: 'bold',
    width: wp('85%'),
    alignSelf: 'center',
    marginBottom: 8,
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
    // height: hp('42%'),
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
  },
  secondModalBtnCont: {
    width: wp('85%'),
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
    // height: hp('70%'),
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
    paddingLeft: 20,
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
  onlineText: {
    fontSize: hp('1.8%'),
    fontWeight: 500,
    color: '#65C466',
  },
  tipAmountCont: {
    width: wp('85%'),
    // height: hp('30%'),
    backgroundColor: 'white',
    borderRadius: 30,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  extendHoursCont: {
    width: wp('90%'),
    // height: hp('30%'),
    backgroundColor: 'white',
    borderRadius: 10,
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
  extendTimeButton: {
    backgroundColor: colors.themeBlue,
    width: wp('35%'),
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 8,
  },
  ratingInput: {
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 12,
    padding: 15,
    fontSize: hp('2%'),
  },
  tipAmountContainer: {
    width: wp('85%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  modalHeading: {
    fontSize: hp('2%'),
    color: 'black',
    width: wp('85%'),
    alignSelf: 'center',
    marginBottom: 15,
  },
});
