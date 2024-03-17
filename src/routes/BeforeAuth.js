import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Signup from '../screens/Auth/Signup';
import Welcome from '../screens/Auth/Welcome';
import Login from '../screens/Auth/Login';
import QualitiesScreen from '../screens/Auth/QualitiesScreen';
import AddAccountDetails from '../screens/Auth/AddAccountDetails';
import DriverTermsAndConditions from '../screens/Auth/DriverTermsAndConditions';
import RiderTermsAndConditions from '../screens/Auth/RiderTermsAndConditions';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import CheckPin from '../screens/Auth/CheckPin';
import UpdateForgottenPassword from '../screens/Auth/UpdateForgottenPassword';
import RiderPdf from '../screens/Auth/RiderPdf';
import DriverPdf from '../screens/Auth/DriverPdf';

const Stack = createNativeStackNavigator();
const BeforeAuth = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Welcome' component={Welcome} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='QualitiesScreen' component={QualitiesScreen} />
        <Stack.Screen name='AddAccountDetails' component={AddAccountDetails} />
        <Stack.Screen name='DriverTermsAndConditions' component={DriverTermsAndConditions} />
        <Stack.Screen name='RiderTermsAndConditions' component={RiderTermsAndConditions} />
        <Stack.Screen name='ForgetPassword' component={ForgetPassword} />
        <Stack.Screen name='CheckPin' component={CheckPin} />
        <Stack.Screen name='UpdateForgottenPassword' component={UpdateForgottenPassword} />
        <Stack.Screen name='RiderPdf' component={RiderPdf} />
        <Stack.Screen name='DriverPdf' component={DriverPdf} />
    </Stack.Navigator>
  )
}

export default BeforeAuth