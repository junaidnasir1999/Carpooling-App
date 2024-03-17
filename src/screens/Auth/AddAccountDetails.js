import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Input from '../../components/Input';
import BtnComp from '../../components/BtnComp';

const AddAccountDetails = ({navigation, route}) => {
  const {
    selectedOption,
    driverForm,
    pickedImage,
    imageMime,
    licenseImage,
    licenseMime,
  } = route.params;
  const [bankInfo, setBankInfo] = useState({
    title: '',
    accNumber: '',
  });

  const onChangeText = (changedText, key) => {
    setBankInfo(oldInfo => {
      return {...oldInfo, [key]: changedText};
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          width: wp('88%'),
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: hp('3%'),
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.heading}>Add Account Details</Text>
      </View>

      <Text style={styles.subHeading}>Acc. Title:</Text>
      <View style={styles.inputCont}>
        <Input
          placeholder={'John Doe'}
          value={bankInfo.title}
          onChangeText={changedText => onChangeText(changedText, 'title')}
          keyboardType={'email-address'}
        />
      </View>
      <Text style={styles.subHeading}>Acc. no/IBAN:</Text>
      <View style={styles.inputCont}>
        <Input
          placeholder={'063395144436'}
          value={bankInfo.accNumber}
          onChangeText={changedText => onChangeText(changedText, 'accNumber')}
          keyboardType={'email-address'}
        />
      </View>

      <View
        style={{
          width: wp('85%'),
          alignSelf: 'center',
          marginVertical: 30,
          position: 'absolute',
          bottom: 0,
        }}>
        <BtnComp
          btnText={'Next'}
          onPress={() => {
            if (bankInfo.title && bankInfo.accNumber)
              navigation.navigate('DriverTermsAndConditions', {
                selectedOption,
                driverForm,
                pickedImage,
                imageMime,
                licenseImage,
                licenseMime,
                bankInfo,
              });
            else alert('Please fill all the details');
          }}
        />
      </View>
    </View>
  );
};

export default AddAccountDetails;

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 30,
  },
  inputCont: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  subHeading: {
    color: '#7A86A1',
    fontSize: hp('2%'),
    width: wp('85%'),
    alignSelf: 'center',
    marginVertical: 5,
  },
});
