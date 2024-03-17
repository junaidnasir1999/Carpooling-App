import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import Input from '../../../components/Input';
import colors from '../../../theme/colors';
import BtnComp from '../../../components/BtnComp';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {
  imagePicker,
  openCamera,
} from '../../../utils/functions';
import {useSelector} from 'react-redux';
import endpoint from '../../../utils/endpoint';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import axios from 'axios';
import {updateUserData} from '../../../redux/AuthSlice';
import {useDispatch} from 'react-redux';

const EditRiderProfile = ({navigation}) => {
  const {data, token} = useSelector(state => state.authData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [pickedImage, setPickedImage] = useState(false);
  const [imageMime, setImageMime] = useState(false);

  const [PRCImage, setPRCImage] = useState(false);
  const [PRCMime, setPRCMime] = useState(false);

  const [vehicleInsurance, setVehicleInsurance] = useState(false);
  const [insuranceMime, setInsuranceMime] = useState(false);

  const [vehicleRegistration, setVehicleRegistration] = useState(false);
  const [registrationMime, setRegistrationMime] = useState(false);

  const [form, setForm] = useState({
    name: data.name,
    phone: data.phone,
    vehicle_year: data.vehicle_year,
    vehicle_make: data.vehicle_make,
    vehicle_model: data.vehicle_model,
    vehicle_color: data.vehicle_color,
    vehicle_insurance: data.vehicle_insurance,
    vehicle_registration: data.vehicle_registration,
    social_security: data.social_security_for_background_check,
  });

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

  const uploadProfileImage = async () => {
    const imageRef = Math.ceil(Math.random() * 100000);
    await storage().ref(`${imageRef}`).putFile(pickedImage);
    const uploadImageUrl = storage().ref(`${imageRef}`).getDownloadURL();
    return uploadImageUrl;
  };

  const onEditProfile = () => {
    let dataToBeAppend = new FormData();

    pickedImage
      ? dataToBeAppend.append('profile_image', {
          name: 'image',
          type: imageMime,
          uri: pickedImage,
        })
      : null;

    PRCImage
      ? dataToBeAppend.append('permanent_resident_card', {
          name: 'image',
          type: PRCMime,
          uri: PRCImage,
        })
      : null;
  
    vehicleInsurance
      ? dataToBeAppend.append('vehicle_insurance', {
        name: 'image',
        type: insuranceMime,
        uri: vehicleInsurance
      })
      : null;

    vehicleRegistration
      ? dataToBeAppend.append('vehicle_registration', {
        name: 'image',
        type: registrationMime,
        uri: vehicleRegistration
      })
      : null;    

    dataToBeAppend.append('name', form.name);
    dataToBeAppend.append('phone', form.phone);
    dataToBeAppend.append('vehicle_year', form.vehicle_year);
    dataToBeAppend.append('vehicle_make', form.vehicle_make);
    dataToBeAppend.append('vehicle_model', form.vehicle_model);
    dataToBeAppend.append('vehicle_color', form.vehicle_color);
    dataToBeAppend.append('vehicle_insurance', form.vehicle_insurance);
    dataToBeAppend.append('vehicle_registration', form.vehicle_registration);
    dataToBeAppend.append(
      'social_security_for_background_check',
      form.social_security,
    );

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/update-info`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: dataToBeAppend,
    };

    setLoading(true);

    axios
      .request(config)
      .then(response => {
        if (response.data.success) {
          dispatch(updateUserData(response.data.data));
          const userId = data.id;
          const userRef = database().ref(`/users/${userId}`);

          if (pickedImage) {
            uploadProfileImage().then(downloadProfile => {
              userRef
                .update({
                  profile_image: downloadProfile,
                  name: form.name,
                  phone: form.phone,
                  vehicle_year: form.vehicle_year,
                  vehicle_make: form.vehicle_make,
                  vehicle_model: form.vehicle_model,
                  vehicle_color: form.vehicle_color,
                  vehicle_insurance: form.vehicle_insurance,
                  vehicle_registration: form.vehicle_registration,
                })
                .then(() => {
                  setLoading(false);
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: `Profile Updated successfully 👋`,
                  });
                  navigation.navigate('SelectHourBlock');
                });
            });
          } else {
            userRef
              .update({
                name: form.name,
                phone: form.phone,
                vehicle_year: form.vehicle_year,
                vehicle_make: form.vehicle_make,
                vehicle_model: form.vehicle_model,
                vehicle_color: form.vehicle_color,
                vehicle_insurance: form.vehicle_insurance,
                vehicle_registration: form.vehicle_registration,
              })
              .then(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: `Profile Updated successfully 👋`,
                });
                navigation.navigate('SelectHourBlock');
              });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: `${response.data.message} 👋`,
          });
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: `${response.data.message} 👋`,
        });
      });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={100} color={colors.themeBlue} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <ScrollView style={{flexGrow: 1}}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.heading}>Edit Profile</Text>
        </View>

        <TouchableOpacity onPress={pickImage}>
          {pickedImage ? (
            <Image source={{uri: pickedImage}} style={styles.imageStyling} />
          ) : data.profile_image ? (
            <Image
              source={{
                uri: `${endpoint}/assets/uploads/user/${data.profile_image}`,
              }}
              style={styles.imageStyling}
            />
          ) : (
            <Fontisto
              name="person"
              size={75}
              color={'black'}
              style={{
                alignSelf: 'center',
                backgroundColor: 'lightgrey',
                padding: 10,
                borderRadius: 8,
                overflow: 'hidden'
              }}
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

        <>
          <Text style={styles.subHeading}>Full Name</Text>
          <View style={styles.inputCont}>
            <Input
              placeholder={'Full Name'}
              value={form.name}
              onChangeText={changedText => onChangeText(changedText, 'name')}
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

          <Text style={styles.subHeading}>Vehicle Insurance</Text>
          <BtnComp
            btnText={'Update the image'}
            onPress={pickInsurance}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'grey',
              paddingVertical: 5,
              paddingHorizontal: 15,
              marginLeft: wp('7.5%'),
              marginTop: 10,
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
                marginTop: 10,
              }}
            />
          ) : (
            <Image
              source={{
                uri: `${endpoint}/assets/uploads/user/${data.vehicle_insurance}`,
              }}
              style={{
                width: wp('85%'),
                height: hp('15%'),
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 8,
                marginTop: 10,
              }}
            />
          )}

          <Text style={styles.subHeading}>Vehicle Registration</Text>
          <BtnComp
            btnText={'Update the image'}
            onPress={pickRegistration}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'grey',
              paddingVertical: 5,
              paddingHorizontal: 15,
              marginLeft: wp('7.5%'),
              marginTop: 10,
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
          ) : (
            <Image
              source={{
                uri: `${endpoint}/assets/uploads/user/${data.vehicle_registration}`,
              }}
              style={{
                width: wp('85%'),
                height: hp('15%'),
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 8,
                marginTop: 10,
              }}
            />
          )}

          {/* <Text style={styles.subHeading}>Permanent Residence Card</Text>
          <BtnComp
            btnText={'Update the image'}
            onPress={pickPRC}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'grey',
              paddingVertical: 5,
              paddingHorizontal: 15,
              marginLeft: wp('7.5%'),
              marginTop: 10,
            }}
          />
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
          ) : (
            <Image
              source={{
                uri: `${endpoint}/assets/uploads/user/${data.permanent_resident_card}`,
              }}
              style={{
                width: wp('85%'),
                height: hp('15%'),
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 8,
                marginTop: 10,
              }}
            />
          )} */}
        </>

        <View
          style={{width: wp('85%'), alignSelf: 'center', marginVertical: 30}}>
          <BtnComp btnText={'Update'} onPress={onEditProfile} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditRiderProfile;

const styles = StyleSheet.create({
  headingContainer: {
    width: wp('88%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('3%'),
  },
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
