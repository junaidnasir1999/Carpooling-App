import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../theme/colors';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


const RideCard = ({hourBlock, startTime, endTime, pickupLocation, dropoffLocation, onCardPress, activeOpacity=0.6}) => {

  function convertToDateAndMonth(inputDateStr) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const parsedDate = new Date(inputDateStr);
    const dayOfWeek = daysOfWeek[parsedDate.getDay()];
    const month = months[parsedDate.getMonth()];
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
  
    return `${dayOfWeek}, ${month} ${day}, ${year}`;
  }

  function extractTime(inputDateStr){
    const parsedDate = new Date(inputDateStr);
    const hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    
    return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }
  
    
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onCardPress} style={{width: wp('88%'), alignSelf: 'center', borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.3)', paddingBottom: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name='calendar-range' size={25} color={colors.themeBlue} style={{marginRight: 10}} />
          <Text style={{color: 'black', fontSize: hp('2%')}}>{convertToDateAndMonth(startTime)}</Text>
        </View>        
        <Text style={{color: 'black', fontSize: hp('2%')}}>{`${hourBlock} hours`}</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name='clockcircleo' size={22} color={colors.themeBlue} style={{marginLeft: 3, marginRight: 10, overflow: 'hidden'}} />
          <Text style={{color: 'black', fontSize: hp('2%')}}>{`${extractTime(startTime)} - ${extractTime(endTime)}`}</Text>
        </View>        
        {/* <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
          defaultRating={5}
          reviewColor={colors.themeBlue}
          selectedColor={colors.themeBlue}
          size={15}
          showRating={false}
          starContainerStyle={{alignSelf: 'flex-start'}}
        /> */}
      </View>

      <View style={{flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <Ionicons name='location-outline' size={32} color={colors.themeBlue} style={{alignSelf: 'flex-start'}} />

        <View style={{flexDirection: 'row', width: '95%', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <View style={{width: wp('30%'), marginLeft: 10}}>
            <Text style={{color: 'grey', fontSize: hp('1.6%')}}>Pickup Location</Text>
            <Text style={{color: colors.themeBlue, fontSize: hp('1.8%'), marginTop: 3}}>{pickupLocation}</Text>
          </View>

          <FontAwesome name="long-arrow-right" size={30} color={'grey'} />

          <View style={{width: wp('30%'), marginLeft: 10}}>
            <Text style={{color: 'grey', fontSize: hp('1.6%')}}>Drop Off Location</Text>
            <Text style={{color: colors.themeBlue, fontSize: hp('1.8%'), marginTop: 3}}>{dropoffLocation}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RideCard

const styles = StyleSheet.create({})