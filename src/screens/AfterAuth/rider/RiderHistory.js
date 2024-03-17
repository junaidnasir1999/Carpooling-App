import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GeneralHeader from '../../../components/GeneralHeader';
import AcceptedRiderRide from '../../../components/AcceptedRiderRide';

const RiderHistory = ({navigation, route}) => {
  const {ridesHistory} = route.params;
  
  const renderHistory = ({item}) => {
    return (
      <View style={{marginTop: 15}}>
          <AcceptedRiderRide
            riderName={item.driverDetails.driverName}
            profileImage={item.driverDetails.driverProfileImage}
            bookingHours={item.rideDetails.hourBlock}
            pickupLocation={item.rideDetails.pickupLocation}
            dropoffLocation={item.rideDetails.dropoffLocation}
            startTime={item.rideDetails.startTime}
            compType={'history'}
          />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <GeneralHeader
              heading={'Rides History'}
              onBackPress={() => navigation.goBack()}
            />
          );
        }}
        keyExtractor={item => item.rideDetails.startTime}
        data={ridesHistory}
        renderItem={renderHistory}
      />
    </View>
  );
};

export default RiderHistory;

const styles = StyleSheet.create({});
