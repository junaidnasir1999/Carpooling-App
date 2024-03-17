import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import images from '../assets/images';
import BtnComp from './BtnComp';
import GeneralHeader from './GeneralHeader';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Input from './Input';
import {API_KEY} from '@env';

Geocoder.init(API_KEY, {language: 'en'});

const ErrandChoosingMaps = ({navigation, myLocation, chooseErrand}) => {
  const mapRef = useRef();
  const [showAddress, setShowAddress] = useState(true);
  const [dropOffLocation, setDropOffLocation] = useState(
    'Choose dropoff location',
  );
  const [region, setRegion] = useState(myLocation);
  const [errandName, setErrandName] = useState('');

  useEffect(() => {
    Geocoder.from(region.latitude, region.longitude)
      .then(json => {
        const addressComponent = json.results[0].formatted_address;
        // const cityName = json.results[0].address_components.find(comp => comp.types.includes('locality'))?.long_name;
        setDropOffLocation(addressComponent);
      })
      .catch(error => console.warn(error));
  }, [region]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowAddress(false);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowAddress(true);
        Keyboard.dismiss();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const goToMyLocation = () => {
    if (myLocation) {
      mapRef.current.animateToRegion(myLocation, 1000);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GeneralHeader
        heading={'Choose an errand'}
        onBackPress={() => navigation.goBack()}
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
        initialRegion={region}
        onRegionChangeComplete={region => {
          setRegion(region);
        }}
      />

      <Input
        placeholder="Errand Name"
        value={errandName}
        onChangeText={changedText => setErrandName(changedText)}
        containerStyle={{
          borderRadius: 8,
          width: '90%',
          borderWidth: 2,
          paddingVertical: 6,
          marginTop: 10,
          alignSelf: 'center',
        }}
      />

      <GooglePlacesAutocomplete
        styles={{
          container: {
            width: wp('90%'),
            alignSelf: 'center',
            margin: 10,
            marginTop: 5,
            zIndex: 2,
          },
          textInput: {
            height: 65,
            color: 'black',
            borderRadius: 8,
            fontSize: hp('2%'),
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: 'lightgrey',
          },
        }}
        fetchDetails={true}
        placeholder={'Search for a location'}
        onPress={(data, details = null) => {
          const locationCoords = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          mapRef.current.animateToRegion(locationCoords, 1000);
        }}
        query={{
          key: API_KEY,
          language: 'en',
        }}
      />

      {showAddress ? (
        <Text style={styles.locationPointerCont}>{dropOffLocation}</Text>
      ) : null}
      <View style={styles.markerFixed}>
        <Image style={styles.marker} source={images.pin} />
      </View>

      <TouchableOpacity onPress={goToMyLocation} style={styles.button}>
        <MaterialIcons name="my-location" size={35} color={'#68a2f9'} />
      </TouchableOpacity>
      {/* console.log(region, dropOffLocation) */}
      <BtnComp
        onPress={() =>
          chooseErrand(region.latitude, region.longitude, dropOffLocation, errandName)
        }
        btnText={'Select this location'}
        style={{
          position: 'absolute',
          bottom: 20,
          width: wp('90%'),
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default ErrandChoosingMaps;

const styles = StyleSheet.create({
  destinationContainer: {
    width: wp('90%'),
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: hp('6%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  locationPointerCont: {
    // left: '50%',
    // marginLeft: -24,
    marginTop: -20,
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 1,
    backgroundColor: 'white',
    maxWidth: wp('90%'),
    color: 'black',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  marker: {
    height: 48,
    width: 48,
  },
  button: {
    position: 'absolute',
    bottom: 95,
    right: 16,
    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#68a2f9',
  },
});
