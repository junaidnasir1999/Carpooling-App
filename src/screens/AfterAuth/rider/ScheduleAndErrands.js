import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
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
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BtnComp from '../../../components/BtnComp';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';



const ScheduleAndErrands = ({navigation, route}) => {
  const {hours} = route.params;

  const {data} = useSelector(state => state.authData);
  const [startDate, setStartDate] = useState(addHoursToDate(new Date(), 1));
  const [calculatedEndDate, setCalculatedEndDate] = useState('')
  const [myLocation, setMyLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateEndTimeFormats = (startTime, numberOfHours) => {
    // Parse the start time string to a Date object
    const startDate = new Date(startTime);

    // Calculate the end time by adding the number of hours to the start time
    const endDate = new Date(startDate.getTime() + numberOfHours * 3600000); // 1 hour = 3600000 milliseconds

    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let monthShortNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    // Extract the components of the end time
    const endWeekDay = weekday[endDate.getDay()];
    const endMonth01 = monthShortNames[endDate.getMonth()];
    const endDate01 = endDate.getDate();
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const endSeconds = endDate.getSeconds();
    const endMilliseconds = endDate.getMilliseconds();

    // Convert the hours to 12-hour format and determine AM or PM
    const endHours12HourFormat = endHours % 12 === 0 ? 12 : endHours % 12;
    const amOrPm = endHours < 12 ? 'AM' : 'PM';

    // Format the end time as a string in 12-hour format (e.g., "11:27 PM")
    const endTime12HourFormat = `${endWeekDay} ${endMonth01} ${endDate01}   ${endHours12HourFormat}:${String(
      endMinutes,
    ).padStart(2, '0')} ${amOrPm}`;

    // Format the end time as a string in ISO 8601 format (e.g., "2023-07-25T20:20:08.053Z")
    const endYear = endDate.getUTCFullYear();
    const endMonth = String(endDate.getUTCMonth() + 1).padStart(2, '0');
    const endDay = String(endDate.getUTCDate()).padStart(2, '0');
    const endHoursISO = String(endDate.getUTCHours()).padStart(2, '0');
    const endMinutesISO = String(endDate.getUTCMinutes()).padStart(2, '0');
    const endSecondsISO = String(endSeconds).padStart(2, '0');
    const endMillisecondsISO = String(endMilliseconds).padStart(3, '0');
    const endTimeISO = `${endYear}-${endMonth}-${endDay}T${endHoursISO}:${endMinutesISO}:${endSecondsISO}.${endMillisecondsISO}Z`;

    return {endTime12HourFormat, endTimeISO};
  };

  useEffect(() => {
    // console.log(startDate.getDate(), new Date().getDate())
    if(startDate.getDate() === new Date().getDate()){
      setCalculatedEndDate(calculateEndTimeFormats(startDate, +hours).endTime12HourFormat)
    }
    setCalculatedEndDate(calculateEndTimeFormats(startDate, +hours).endTime12HourFormat)
  }, [startDate])

  useEffect(() => {
    const latitudeDelta = 0.005;
    const longitudeDelta = 0.005;

    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true)
      
      Geolocation.getCurrentPosition(position => {
          setLoading(false)
          setMyLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta,
            longitudeDelta,
          });
        },
        error => {
          setLoading(false)
          console.log("Error with fetching location =>   ", error)
        }
      )
    });

    return unsubscribe;
  }, [navigation]);

  function addHoursToDate(date, hours) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <View style={{width: wp('100%'), zIndex: 50}}>
        <ProfileHeader
          username={data.name}
          profileImage={data.profile_image}
          onPress={() => navigation.navigate('MyProfile')}
        />
      </View> */}
      <View style={styles.internalCont}>
        <AntDesign onPress={() => navigation.goBack()} name="arrowleft" size={25} color={'white'} style={{paddingRight: 16, paddingVertical: 5}} />
        <Text
          style={{
            color: 'white',
            width: wp('60%'),
            textAlign: 'right',
            fontSize: hp('2.7%'),
            fontWeight: 'bold',
            overflow: 'hidden'
          }}>
          Set up your Schedule and Start Time
        </Text>
      </View>

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 25}}>
        <View style={[styles.timePickerContainer, {overflow: 'hidden'}]}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '96%',
            }}>
            <Text style={{fontSize: hp('2.2%'), fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10}}>
              Start Time:
            </Text>
            <DatePicker
              mode="datetime"
              date={startDate}
              minimumDate={addHoursToDate(new Date(), 1)}
              onDateChange={date => setStartDate(date)}
              style={{height: hp('15%'), width: wp('76%')}}
            />
          </View>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              marginVertical: 10,
              height: 1,
              backgroundColor: 'lightgrey',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '96%',
              marginVertical: 15,
            }}>
            <Text style={{fontSize: hp('2.2%'), fontWeight: 'bold'}}>
              End Time:
            </Text>

            <Text
              style={{
                fontSize: hp('2.5%'),
                fontWeight: 'bold',
                color: 'black',
                width: '75%',
                textAlign: 'right',
              }}>
              {calculatedEndDate}
            </Text>
          </View>

          <BtnComp
            btnText={'Set Time'}
            onPress={() => {
              navigation.navigate('PickupLocationPicker', {
                myLocation,
                fromRideBooking: false,
                startTime: `${startDate}`,
                endTime: `${new Date(
                  calculateEndTimeFormats(startDate, +hours).endTimeISO,
                )}`,
                hourBlock: hours
              })   
            }

            }
            style={{
              backgroundColor: colors.themeBlue,
              width: '90%',
              marginVertical: 15,
            }}
          />
        </View>

      
      </ScrollView>

      <Modal
        coverScreen={false}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        isVisible={loading}
        style={{margin: 0}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={100} color={'white'} />
        </View>
      </Modal>
    </View>
  );
};

export default ScheduleAndErrands;

const styles = StyleSheet.create({
  internalCont: {
    width: wp('100%'),
    height: hp('15%'),
    backgroundColor: colors.themeBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -hp('5%'),
    marginBottom: 50,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
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
    borderRadius: 25,
    marginTop: hp('5%'),
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
