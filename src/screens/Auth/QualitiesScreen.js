import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../theme/colors';
import BtnComp from '../../components/BtnComp';

const QualitiesScreen = ({navigation, route}) => {
  const {
    selectedOption,
    form,
    pickedImage,
    imageMime,
    PRCImage,
    PRCMime,
    vehicleInsurance,
    insuranceMime,
    vehicleRegistration,
    registrationMime,
  } = route.params;
  const [selected, setSelected] = useState([]);

  const handleSelectedOption = item => {
    if (selected.includes(item)) {
      const index = selected.indexOf(item);
      selected.splice(index, 1);
      setSelected([...selected]);
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <ScrollView style={{flexGrow: 1}}>
        <View
          style={{
            width: wp('88%'),
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginVertical: hp('3%'),
          }}>
          <TouchableOpacity
            style={{padding: 3}}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.heading}>
            Tell us your personality traits and style of living to match you
            with best drivers
          </Text>
        </View>

        <View
          style={{
            width: wp('88%'),
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('direct')}
            style={[
              selected.includes('direct')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 100, height: 100},
            ]}>
            <Text style={styles.text}>Direct</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('decisive')}
            style={[
              selected.includes('decisive')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 80, height: 80},
            ]}>
            <Text style={styles.text}>Decisive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('determined')}
            style={[
              selected.includes('determined')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 120, height: 120},
            ]}>
            <Text style={styles.text}>Determined</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('orderly')}
            style={[
              selected.includes('orderly')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 80, height: 80},
            ]}>
            <Text style={styles.text}>Orderly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('approachable')}
            style={[
              selected.includes('approachable')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 140, height: 140},
            ]}>
            <Text style={styles.text}>Approachable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('logical')}
            style={[
              selected.includes('logical')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 80, height: 80},
            ]}>
            <Text style={styles.text}>Logical</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('attentive')}
            style={[
              selected.includes('attentive')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 100, height: 100},
            ]}>
            <Text style={styles.text}>Attentive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('precise')}
            style={[
              selected.includes('precise')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 80, height: 80},
            ]}>
            <Text style={styles.text}>Precise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('warm')}
            style={[
              selected.includes('warm')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 100, height: 100},
            ]}>
            <Text style={styles.text}>Warm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('energetic')}
            style={[
              selected.includes('energetic')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 120, height: 120},
            ]}>
            <Text style={styles.text}>Energetic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('friendly')}
            style={[
              selected.includes('friendly')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 100, height: 100},
            ]}>
            <Text style={styles.text}>Friendly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('accepting')}
            style={[
              selected.includes('accepting')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 120, height: 120},
            ]}>
            <Text style={styles.text}>Accepting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('cheerful')}
            style={[
              selected.includes('cheerful')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 80, height: 80},
            ]}>
            <Text style={styles.text}>Cheerful</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('nightlife')}
            style={[
              selected.includes('nightlife')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 120, height: 120},
            ]}>
            <Text style={styles.text}>Nightlife</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('luxury')}
            style={[
              selected.includes('luxury')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 140, height: 140},
            ]}>
            <Text style={styles.text}>Luxury Outing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('sightsee')}
            style={[
              selected.includes('sightsee')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 100, height: 100},
            ]}>
            <Text style={styles.text}>Sightsee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleSelectedOption('corporate')}
            style={[
              selected.includes('corporate')
                ? styles.selectedContainer
                : styles.blueContainer,
              {width: 120, height: 120},
            ]}>
            <Text style={styles.text}>Corporate</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{width: wp('85%'), alignSelf: 'center', marginVertical: 30}}>
          <BtnComp
            btnText={'Submit'}
            onPress={() =>
              navigation.navigate('RiderTermsAndConditions', {
                selectedOption,
                form,
                pickedImage,
                imageMime,
                PRCImage,
                PRCMime,
                selected,
                vehicleInsurance,
                insuranceMime,
                vehicleRegistration,
                registrationMime,
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default QualitiesScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('3%'),
    // fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    width: wp('70%'),
  },
  blueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.themeBlue,
    borderRadius: 250,
    marginVertical: 5,
  },
  selectedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 250,
    marginVertical: 5,
  },
  text: {
    fontSize: hp('1.8%'),
    color: 'white',
    textAlign: 'center',
  },
});
