import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import Input from '../../components/Input';
import colors from '../../theme/colors';
import BtnComp from '../../components/BtnComp';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import images from '../../assets/images';
import {
  imagePicker,
  validateEmail,
  validatePassword,
  openCamera
} from '../../utils/functions';

const Signup = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [pickedImage, setPickedImage] = useState(false);
  const [imageMime, setImageMime] = useState(false);

  const [PRCImage, setPRCImage] = useState(false);
  const [PRCMime, setPRCMime] = useState(false);

  const [licenseImage, setLicenseImage] = useState(false);
  const [licenseMime, setLicenseMime] = useState(false);

  const [vehicleInsurance, setVehicleInsurance] = useState(false);
  const [insuranceMime, setInsuranceMime] = useState(false);

  const [vehicleRegistration, setVehicleRegistration] = useState(false);
  const [registrationMime, setRegistrationMime] = useState(false);

  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    social_security: '',
  });
  const [driverForm, setDriverForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    social_security: '',
    phone: '',
  });
  const [selectedOption, setSelectedOption] = useState('rider');

  const pickImage = () => {
    Alert.alert('Choose an option', '', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Open Camera',
        onPress: () => {
          openCamera()
            .then(image => {
              setPickedImage(image.path);
              setImageMime(image.mime);
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
            imagePicker()
              .then(image => {
                setPickedImage(image.path);
                setImageMime(image.mime);
              })
              .catch(err => {
                console.log(err);
              });
        }
      },
    ])
  };

  const pickPRC = () => {
    imagePicker()
      .then(image => {
        setPRCImage(image.path);
        setPRCMime(image.mime);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const pickLicense = () => {
    Alert.alert('Choose an option', '', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Open Camera',
        onPress: () => {
          openCamera()
            .then(image => {
              setLicenseImage(image.path);
              setLicenseMime(image.mime);
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
            imagePicker()
              .then(image => {
                setLicenseImage(image.path);
                setLicenseMime(image.mime);
              })
              .catch(err => {
                console.log(err);
              });
        }
      },
    ])
    
  };

  const pickInsurance = () => {
    Alert.alert('Choose an option', '', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Open Camera',
        onPress: () => {
          openCamera()
            .then(image => {
              setVehicleInsurance(image.path);
              setInsuranceMime(image.mime);
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
            imagePicker()
              .then(image => {
                setVehicleInsurance(image.path);
                setInsuranceMime(image.mime);
              })
              .catch(err => {
                console.log(err);
              });
        }
      },
    ])

  };

  const pickRegistration = () => {
    Alert.alert('Choose an option', '', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Open Camera',
        onPress: () => {
          openCamera()
            .then(image => {
              setVehicleRegistration(image.path);
              setRegistrationMime(image.mime);
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
            imagePicker()
              .then(image => {
                setVehicleRegistration(image.path);
                setRegistrationMime(image.mime);
              })
              .catch(err => {
                console.log(err);
              });
        }
      },
    ])

  };

  const onChangeText = (changedText, key) => {
    setForm(oldForm => {
      return {...oldForm, [key]: changedText};
    });
  };
  const onDriverChangeText = (changedText, key) => {
    setDriverForm(oldForm => {
      return {...oldForm, [key]: changedText};
    });
  };

  const onRiderSignupPress = () => {
    if (
      form.firstName &&
      form.lastName &&
      form.email &&
      form.password &&
      form.confirmPassword &&
      form.phone &&
      form.vehicle_year &&
      form.vehicle_make &&
      form.vehicle_model &&
      form.vehicle_color &&
      // PRCImage &&
      vehicleInsurance &&
      vehicleRegistration
    ) {
      if (validateEmail(form.email) && validatePassword(form.password)) {
        if (form.password === form.confirmPassword) {
          navigation.navigate('QualitiesScreen', {
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
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: 'The password and confirm password does not match 👋',
          });
        }
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: "You can't leave any field empty 👋",
      });
    }
  };

  const onDriverSignupPress = () => {
    if (
      driverForm.firstName &&
      driverForm.lastName &&
      driverForm.email &&
      driverForm.password &&
      driverForm.confirmPassword &&
      driverForm.phone &&
      driverForm.social_security &&
      licenseImage
    ) {
      if (
        validateEmail(driverForm.email) &&
        validatePassword(driverForm.password)
      ) {
        if (driverForm.password === driverForm.confirmPassword) {
          navigation.navigate('AddAccountDetails', {
            selectedOption,
            driverForm,
            pickedImage,
            imageMime,
            licenseImage,
            licenseMime,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: 'The password and confirm password does not match 👋',
          });
        }
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: "You can't leave any field empty 👋",
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <StatusBar backgroundColor={'#F5F5F5'} barStyle={'dark-content'} />
      <ScrollView style={{flexGrow: 1}}>
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
          <Text style={styles.heading}>Sign Up</Text>
        </View>

        <View style={styles.optionCont}>
          <TouchableOpacity
            onPress={() => setSelectedOption('driver')}
            activeOpacity={1}
            style={[
              styles.option,
              selectedOption === 'driver'
                ? {backgroundColor: colors.themeBlue}
                : null,
            ]}>
            <Text
              style={[
                {fontSize: hp('1.8%')},
                selectedOption === 'driver'
                  ? {color: 'white'}
                  : {color: colors.themeBlue},
              ]}>
              As a Driver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption('rider')}
            activeOpacity={1}
            style={[
              styles.option,
              selectedOption === 'rider'
                ? {backgroundColor: colors.themeBlue}
                : null,
            ]}>
            <Text
              style={[
                {fontSize: hp('1.8%')},
                selectedOption === 'rider'
                  ? {color: 'white'}
                  : {color: colors.themeBlue},
              ]}>
              As a Rider
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage}>
          {pickedImage ? (
            <Image source={{uri: pickedImage}} style={styles.imageStyling} />
          ) : (
            <Fontisto
              name="person"
              size={75}
              color={'black'}
              style={{alignSelf: 'center', marginTop: 30, overflow: 'hidden'}}
            />
          )}
        </TouchableOpacity>
        <Text
          style={{
            color: '#7A86A1',
            fontSize: hp('2%'),
            alignSelf: 'center',
            marginVertical: 10,
          }}>
          Profile Picture
        </Text>

        {selectedOption === 'rider' ? (
          <>
            <Text style={styles.subHeading}>First Name</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'First Name'}
                value={form.firstName}
                onChangeText={changedText =>
                  onChangeText(changedText, 'firstName')
                }
              />
            </View>

            <Text style={styles.subHeading}>Last Name</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'Last Name'}
                value={form.lastName}
                onChangeText={changedText =>
                  onChangeText(changedText, 'lastName')
                }
              />
            </View>

            <Text style={styles.subHeading}>Your email</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'johndoe@example.com'}
                value={form.email}
                onChangeText={changedText => onChangeText(changedText, 'email')}
                keyboardType={'email-address'}
              />
            </View>

            <Text style={styles.subHeading}>Password</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'7+ Characters'}
                value={form.password}
                onChangeText={changedText =>
                  onChangeText(changedText, 'password')
                }
                passwordField={true}
                secureTextEntry={secureTextEntry}
                onEyePress={() => setSecureTextEntry(!secureTextEntry)}
              />
            </View>

            <Text style={styles.subHeading}>Confirm Password</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'7+ Characters'}
                value={form.confirmPassword}
                onChangeText={changedText =>
                  onChangeText(changedText, 'confirmPassword')
                }
                passwordField={true}
                secureTextEntry={confirmSecureTextEntry}
                onEyePress={() =>
                  setConfirmSecureTextEntry(!confirmSecureTextEntry)
                }
              />
            </View>

            <Text style={styles.subHeading}>Phone</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'+123456789'}
                keyboardType={'number-pad'}
                value={form.phone}
                onChangeText={changedText => onChangeText(changedText, 'phone')}
              />
            </View>

            <Text style={styles.subHeading}>Vehicle Year</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'e.g., 2004, 2008'}
                keyboardType={'number-pad'}
                value={form.vehicle_year}
                onChangeText={changedText =>
                  onChangeText(changedText, 'vehicle_year')
                }
              />
            </View>

            <Text style={styles.subHeading}>Vehicle Make</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'e.g., Toyota, Ford, Honda'}
                value={form.vehicle_make}
                onChangeText={changedText =>
                  onChangeText(changedText, 'vehicle_make')
                }
              />
            </View>

            <Text style={styles.subHeading}>Vehicle Model</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'e.g., Camry, Civic, Focus'}
                value={form.vehicle_model}
                onChangeText={changedText =>
                  onChangeText(changedText, 'vehicle_model')
                }
              />
            </View>

            <Text style={styles.subHeading}>Vehicle Color</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'e.g., blue, grey, purple'}
                value={form.vehicle_color}
                onChangeText={changedText =>
                  onChangeText(changedText, 'vehicle_color')
                }
              />
            </View>

            {/* <Text style={styles.subHeading}>
              Social Security for background check
            </Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'Social Security Number'}
                keyboardType={'number-pad'}
                value={form.social_security}
                onChangeText={changedText =>
                  onChangeText(changedText, 'social_security')
                }
              />
            </View> */}

            <Text style={[styles.subHeading, {marginTop: 30}]}>Vehicle Insurance</Text>
            <BtnComp
              btnText={'Choose an image'}
              onPress={pickInsurance}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'grey',
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginLeft: wp('7.5%'),
                marginTop: 5,
              }}
            />
            {vehicleInsurance ? (
              <Image
                source={{uri: vehicleInsurance}}
                style={{
                  width: wp('85%'),
                  height: hp('15%'),
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  borderRadius: 8,
                  marginTop: 5,
                }}
              />
            ) : null}

            <Text style={[styles.subHeading, {marginTop: 30}]}>Vehicle Registration</Text>
            <BtnComp
              btnText={'Choose an image'}
              onPress={pickRegistration}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'grey',
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginLeft: wp('7.5%'),
                marginTop: 5,
              }}
            />
            {vehicleRegistration ? (
              <Image
                source={{uri: vehicleRegistration}}
                style={{
                  width: wp('85%'),
                  height: hp('15%'),
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  borderRadius: 8,
                  marginTop: 10,
                }}
              />
            ) : null}

            {/* <Text style={[styles.subHeading, {marginTop: 30}]}>Permanent Residence Card</Text>
            <BtnComp
              btnText={'Choose an image'}
              onPress={pickPRC}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'grey',
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginLeft: wp('7.5%'),
                marginTop: 5,
              }}
            /> */}
            {PRCImage ? (
              <Image
                source={{uri: PRCImage}}
                style={{
                  width: wp('85%'),
                  height: hp('15%'),
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  borderRadius: 8,
                  marginTop: 10,
                }}
              />
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.subHeading}>First Name</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'First Name'}
                value={driverForm.firstName}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'firstName')
                }
              />
            </View>

            <Text style={styles.subHeading}>Last Name</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'Last Name'}
                value={driverForm.lastName}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'lastName')
                }
              />
            </View>

            <Text style={styles.subHeading}>Your email</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'johndoe@example.com'}
                value={driverForm.email}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'email')
                }
                keyboardType={'email-address'}
              />
            </View>

            <Text style={styles.subHeading}>Password</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'7+ Characters'}
                value={driverForm.password}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'password')
                }
                passwordField={true}
                secureTextEntry={secureTextEntry}
                onEyePress={() => setSecureTextEntry(!secureTextEntry)}
              />
            </View>

            <Text style={styles.subHeading}>Confirm Password</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'7+ Characters'}
                value={driverForm.confirmPassword}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'confirmPassword')
                }
                passwordField={true}
                secureTextEntry={confirmSecureTextEntry}
                onEyePress={() =>
                  setConfirmSecureTextEntry(!confirmSecureTextEntry)
                }
              />
            </View>

            <Text style={styles.subHeading}>Phone Number</Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'+123456789'}
                keyboardType={'number-pad'}
                value={driverForm.phone}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'phone')
                }
              />
            </View>

            <Text style={styles.subHeading}>
              Social Security for background check
            </Text>
            <View style={styles.inputCont}>
              <Input
                placeholder={'Social Security Number'}
                keyboardType={'number-pad'}
                value={driverForm.social_security}
                onChangeText={changedText =>
                  onDriverChangeText(changedText, 'social_security')
                }
              />
            </View>

            <Text style={styles.subHeading}>Driver License</Text>
            <BtnComp
              btnText={'Choose an image'}
              onPress={pickLicense}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'grey',
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginLeft: wp('7.5%'),
                marginTop: 10,
              }}
            />
            {licenseImage ? (
              <Image
                source={{uri: licenseImage}}
                style={{
                  width: wp('85%'),
                  height: hp('15%'),
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  borderRadius: 8,
                  marginTop: 10,
                }}
              />
            ) : null}
          </>
        )}

        <View
          style={{width: wp('85%'), alignSelf: 'center', marginVertical: 30}}>
          <BtnComp
            btnText={'Next'}
            onPress={() =>
              selectedOption === 'rider'
                ? onRiderSignupPress()
                : onDriverSignupPress()
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

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
  optionCont: {
    flexDirection: 'row',
    width: wp('88%'),
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    borderRadius: 250,
    justifyContent: 'space-between',
    marginVertical: 15,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
  },
  imageStyling: {
    width: 105,
    height: 105,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 12,
  },
});
