import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BeforeAuth from './BeforeAuth';
import RiderStack from './RiderStack';
import DriverStack from './DriverStack';
import ChatScreen from '../screens/AfterAuth/ChatScreen';

import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
const index = () => {
  const {userLoggedIn, data} = useSelector(state => state.authData)
  
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {
            !userLoggedIn ? (
              <Stack.Screen name='BeforeAuth' component={BeforeAuth} />
            ) : data?.type === 'rider' ? (
              <Stack.Screen name='RiderStack' component={RiderStack} />
            ) : (
              <Stack.Screen name='DriverStack' component={DriverStack} />
            )
          }
          <Stack.Screen name='ChatScreen' component={ChatScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default index