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
  openCamera
} from '../../../utils/functions';
import {useSelector} from 'react-redux';
import endpoint from '../../../utils/endpoint';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import axios from 'axios';
import {updateUserData} from '../../../redux/AuthSlice';
import {useDispatch} from 'react-redux';

const EditProfile = ({navigation}) => {
  const {data, token} = useSelector(state => state.authData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [pickedImage, setPickedImage] = useState(false);
  const [imageMime, setImageMime] = useState(false);
  const [licenseImage, setLicenseImage] = useState(false);
  const [licenseMime, setLicenseMime] = useState(false);

  const [driverForm, setDriverForm] = useState({
    name: data.name,
    phone: data.phone,
    social_security: data.social_security_for_background_check,
    accTitle: data.acc_title,
    accNumber: data.acc_num,
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

  const onDriverChangeText = (changedText, key) => {
    setDriverForm(oldForm => {
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
    licenseImage
      ? dataToBeAppend.append('driver_license', {
          name: 'image',
          type: licenseMime,
          uri: licenseImage,
        })
      : null;
    dataToBeAppend.append('name', driverForm.name);
    dataToBeAppend.append('phone', driverForm.phone);
    dataToBeAppend.append('acc_title', driverForm.accTitle);
    dataToBeAppend.append('acc_num', driverForm.accNumber);

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
                  name: driverForm.name,
                  phone: driverForm.phone,
                  profile_image: downloadProfile,
                })
                .then(() => {
                  setLoading(false);
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: `Profile Updated successfully 👋`,
                  });
                  navigation.navigate('DriverMain');
                });
            });
          } else {
            userRef
              .update({
                name: driverForm.name,
                phone: driverForm.phone,
              })
              .then(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: `Profile Updated successfully 👋`,
                });
                navigation.navigate('DriverMain');
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
              value={driverForm.name}
              onChangeText={changedText =>
                onDriverChangeText(changedText, 'name')
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

          <Text style={styles.subHeading}>Acc. Title:</Text>
          <View style={styles.inputCont}>
            <Input
              placeholder={'John Doe'}
              value={driverForm.accTitle}
              onChangeText={changedText =>
                onDriverChangeText(changedText, 'accTitle')
              }
              keyboardType={'email-address'}
            />
          </View>
          <Text style={styles.subHeading}>Acc. no/IBAN:</Text>
          <View style={styles.inputCont}>
            <Input
              placeholder={'063395144436'}
              value={driverForm.accNumber}
              onChangeText={changedText =>
                onDriverChangeText(changedText, 'accNumber')
              }
              keyboardType={'email-address'}
            />
          </View>

          <Text style={styles.subHeading}>Driver License</Text>
          <BtnComp
            btnText={'Update the image'}
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
          ) : (
            <Image
              source={{
                uri: `${endpoint}/assets/uploads/user/${data.driver_license}`,
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
        </>

        <View
          style={{width: wp('85%'), alignSelf: 'center', marginVertical: 30}}>
          <BtnComp btnText={'Update'} onPress={onEditProfile} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

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
