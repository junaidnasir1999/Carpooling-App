import {StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useRef} from 'react';

import MapView from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API_KEY} from '@env';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const LocationChooser = ({handleLocation}) => {
  const mapRef = useRef();
  const [region, setRegion] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: 25.1948475,
    longitude: 55.2682899,
  });

  return (
    <View
      style={{
        width: wp('100%'),
        height: hp('58%'),
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }}>
      {/* <MapView
        ref={mapRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        initialRegion={region}
        onRegionChangeComplete={region => {
          setRegion(region);
        }}
      /> */}

      {/* <View style={{width: wp('90%'), backgroundColor: 'blue', margin: 15}}> */}
      <GooglePlacesAutocomplete
        // currentLocation={true}
        // currentLocationLabel='Current location'
        styles={{
          container: {
            width: wp('85%'),
            alignSelf: 'center',
            margin: 10,
            height: hp('30%'),
            marginTop: 20,
          },
          textInput: {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            height: 60,
            color: 'black',
            borderRadius: 10
          },
        }}
        fetchDetails={true}
        placeholder={'choose pickup location'}
        onPress={(data, details = null) => {
          const locationCoords = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          handleLocation(locationCoords);
        }}
        query={{
          key: API_KEY,
          language: 'en',
        }}
      />
      {/* </View> */}
    </View>
  );
};

export default LocationChooser;

const styles = StyleSheet.create({});
