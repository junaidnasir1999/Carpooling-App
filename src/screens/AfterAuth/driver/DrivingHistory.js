import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GeneralHeader from '../../../components/GeneralHeader';
import RideCard from '../../../components/RideCard';

const historyData = [
  {id: 0},
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
];

const DrivingHistory = ({navigation, route}) => {
  const {ridesHistory} = route.params;

  
  const renderUpcoming = ({item}) => {
    return (
      <View style={{marginVertical: 15}}>
        <RideCard
          hourBlock={item.rideDetails.hourBlock}
          startTime={item.rideDetails.startTime}
          endTime={item.rideDetails.endTime}
          pickupLocation={item.rideDetails.pickupLocation}
          dropoffLocation={item.rideDetails.dropoffLocation}
          activeOpacity={1}
          // onCardPress={() => navigation.navigate('AcceptedRide', {rideDetails: item, fromUpcoming: false})}
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
              heading={'Ride History'}
              onBackPress={() => navigation.goBack()}
            />
          );
        }}
        keyExtractor={item => item.rideDetails.startTime}
        data={ridesHistory}
        renderItem={renderUpcoming}
      />
    </View>
  );
};

export default DrivingHistory;

const styles = StyleSheet.create({});
