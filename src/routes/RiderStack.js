import React, {useState, useEffect} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Home from '../screens/AfterAuth/rider/Home';
import RideBooking from '../screens/AfterAuth/rider/RideBooking';
import ThankYou from '../screens/AfterAuth/rider/ThankYou';
import PaymentMethod from '../screens/AfterAuth/rider/PaymentMethod';
import MyProfile from '../screens/AfterAuth/MyProfile';
import SelectHourBlock from '../screens/AfterAuth/rider/SelectHourBlock';
import ScheduleAndErrands from '../screens/AfterAuth/rider/ScheduleAndErrands';
import PickupLocationPicker from '../screens/AfterAuth/rider/PickupLocationPicker';
import DropoffLocationPicker from '../screens/AfterAuth/rider/DropoffLocationPicker';
import ChooseErrands from '../screens/AfterAuth/rider/ChooseErrands';
import AcceptedRideOfRider from '../screens/AfterAuth/rider/AcceptedRideOfRider';
import UpcomingRiderRides from '../screens/AfterAuth/rider/UpcomingRiderRides';
import RiderHistory from '../screens/AfterAuth/rider/RiderHistory';
import RidingScreen from '../screens/AfterAuth/rider/RidingScreen';
import EditRiderProfile from '../screens/AfterAuth/rider/EditRiderProfile';


const Stack = createNativeStackNavigator();

const RiderStack = () => {
  
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='SelectHourBlock' component={SelectHourBlock} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='RideBooking' component={RideBooking} />
        <Stack.Screen name='ThankYou' component={ThankYou} />
        <Stack.Screen name='PaymentMethod' component={PaymentMethod} />
        <Stack.Screen name='MyProfile' component={MyProfile} />
        <Stack.Screen name='ScheduleAndErrands' component={ScheduleAndErrands} />
        <Stack.Screen name='PickupLocationPicker' component={PickupLocationPicker} />
        <Stack.Screen name='DropoffLocationPicker' component={DropoffLocationPicker} />
        <Stack.Screen name='ChooseErrands' component={ChooseErrands} />
        <Stack.Screen name='AcceptedRideOfRider' component={AcceptedRideOfRider} />
        <Stack.Screen name='UpcomingRiderRides' component={UpcomingRiderRides} />
        <Stack.Screen name='RiderHistory' component={RiderHistory} />
        <Stack.Screen name='RidingScreen' component={RidingScreen} />
        <Stack.Screen name='EditRiderProfile' component={EditRiderProfile} />
    </Stack.Navigator>
  )
}

export default RiderStack