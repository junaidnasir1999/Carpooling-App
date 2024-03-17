import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screens
import DrivingHistory from '../screens/AfterAuth/driver/DrivingHistory';
import DriverMain from '../screens/AfterAuth/driver/DriverMain';
import MyProfile from '../screens/AfterAuth/MyProfile';
import AcceptedRide from '../screens/AfterAuth/driver/AcceptedRide';
import DriverProfile from '../screens/AfterAuth/driver/DriverProfile';
import UpcomingRides from '../screens/AfterAuth/driver/UpcomingRides';
import DrivingScreen from '../screens/AfterAuth/driver/DrivingScreen';
import EditProfile from '../screens/AfterAuth/driver/EditProfile';
import QRScanner from '../screens/AfterAuth/driver/QRScanner';
import WatchTrainingVideos from '../screens/AfterAuth/driver/WatchTrainingVideos';


const Stack = createNativeStackNavigator();
const DriverStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='DriverMain' component={DriverMain} />
        <Stack.Screen name='DrivingHistory' component={DrivingHistory} />
        <Stack.Screen name='MyProfile' component={MyProfile} />
        <Stack.Screen name='AcceptedRide' component={AcceptedRide} />
        <Stack.Screen name='DriverProfile' component={DriverProfile} />
        <Stack.Screen name='UpcomingRides' component={UpcomingRides} />
        <Stack.Screen name='DrivingScreen' component={DrivingScreen} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='QRScanner' component={QRScanner} />
        <Stack.Screen name='WatchTrainingVideos' component={WatchTrainingVideos} />
    </Stack.Navigator>
  )
}

export default DriverStack