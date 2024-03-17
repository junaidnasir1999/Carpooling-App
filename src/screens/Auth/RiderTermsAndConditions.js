import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import endpoint from '../../utils/endpoint';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {signup} from '../../redux/AuthSlice';
import {useDispatch} from 'react-redux';
import colors from '../../theme/colors';
import auth from '@react-native-firebase/auth';

const source = {
  html: `
  <body>
  <h2>Contractual Relationship</h2>

  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis sem quis sem gravida laoreet. Cras elementum tempor luctus. Integer urna purus, feugiat ac congue eget, maximus in enim. Sed sit amet dictum neque. Vestibulum vel sapien auctor justo lacinia ullamcorper. Quisque vel facilisis velit. Vivamus sapien ante, consectetur vulputate quam id, scelerisque hendrerit tortor.

  Morbi et justo imperdiet, vulputate tortor scelerisque, commodo augue. Aliquam mollis, nulla nec tincidunt efficitur, nibh nulla semper ante, a gravida urna augue porta nibh. Etiam a laoreet velit. Nullam ac tortor est. Mauris condimentum mauris quis nunc fermentum ullamcorper. Fusce ac dictum ex. Duis quam nunc, cursus in placerat eu, hendrerit sit amet mi. Proin nibh augue, lobortis sed libero non, facilisis tincidunt neque. Vestibulum sit amet mollis odio, non pretium tellus. Fusce convallis fermentum enim. Donec sem nulla, tincidunt sed consectetur sed, tincidunt at eros. Curabitur at nisi eget dui porta suscipit viverra at orci. In laoreet metus non maximus malesuada. Phasellus a enim facilisis, pretium est non, blandit dolor. Nunc aliquam sagittis nibh. Fusce odio tellus, convallis id tempor quis, feugiat id nisl.
  
  Vestibulum facilisis consectetur lacus, a volutpat justo. Sed porttitor eros a fermentum rutrum. Nunc quis nibh at elit viverra dignissim a sed ipsum. Vivamus ut augue lectus. Mauris a ante non odio ornare aliquet a non leo. Nullam placerat pellentesque velit, vitae scelerisque eros. Integer fermentum dapibus pulvinar. Nunc tincidunt augue at lorem faucibus, ut hendrerit neque dictum. Maecenas nibh arcu, dignissim non diam ac, pretium egestas est. Curabitur eget interdum lacus. Nullam eget finibus mi. Maecenas bibendum ultrices purus, a imperdiet est eleifend a. Vestibulum non dolor eu augue placerat porttitor. Nam consectetur dolor justo, in efficitur dolor blandit quis.</p>
  
</body>
  `,
};

const RiderTermsAndConditions = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const {
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
  } = route.params;
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const Dispatch = useDispatch();

  const uploadProfileImage = async () => {
    const imageRef = Math.ceil(Math.random() * 100000);
    await storage().ref(`${imageRef}`).putFile(pickedImage);
    const uploadImageUrl = storage().ref(`${imageRef}`).getDownloadURL();
    return uploadImageUrl;
  };

  const handleSignup = () => {
    if (isChecked) {
      setLoading(true)
      auth().createUserWithEmailAndPassword(form.email, form.password)
      .then(({user}) => {

      const userId = user.uid;
      const userRef = database().ref(`/users/${userId}`);
      const uniqueReferralCode = Math.ceil(Math.random() * 100000);

      if (pickedImage) {
        uploadProfileImage().then(downloadProfile => {
          userRef
            .set({
              userId: userId,
              userType: selectedOption,
              profile_image: downloadProfile,
              name: `${form.firstName} ${form.lastName}`,
              email: form.email,
              phone: form.phone,

              vehicle_year: form.vehicle_year,
              vehicle_make: form.vehicle_make,
              vehicle_model: form.vehicle_model,
              vehicle_color: form.vehicle_color,
              vehicle_insurance: form.vehicle_insurance,
              vehicle_registration: form.vehicle_registration,
              qualities: selected,
              referralCode: uniqueReferralCode,
            })
            .then(async () => {
              await database()
                .ref('/referrals')
                .update({
                  [uniqueReferralCode]: userId,
                })
                .then(() => {
                  console.log('The referral has been regestered');
                })
                .catch(err => {
                  console.log(
                    'Some error occured creating referral--->   ',
                    err,
                  );
                });

              setLoading(false);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Your account created successfully 👋`,
              });

              await navigation.navigate('Login')
            });
        });
      } else {
        userRef
          .set({
            userType: selectedOption,
            profile_image: null,
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,

            vehicle_year: form.vehicle_year,
            vehicle_make: form.vehicle_make,
            vehicle_model: form.vehicle_model,
            vehicle_color: form.vehicle_color,
            vehicle_insurance: form.vehicle_insurance,
            vehicle_registration: form.vehicle_registration,
            qualities: selected,
            referralCode: uniqueReferralCode,
          })
          .then(async () => {
            await database()
              .ref('/referrals')
              .update({
                [uniqueReferralCode]: userId,
              })
              .then(() => {
                console.log('The referral has been regestered');
              })
              .catch(err => {
                console.log(
                  'Some error occured creating referral--->   ',
                  err,
                );
              });

            setLoading(false);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: `Your account created successfully 👋`,
            });

            await navigation.navigate('Login')
          });
      }

      })

    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: 'Please accept the terms & conditions 👋',
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{marginLeft: 15, marginVertical: 10, marginTop: 15, padding: 5, alignSelf: 'flex-start'}}>
          <AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <View style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginHorizontal: 25,
              marginTop: 10,
              paddingBottom: 280,
            }}>
            <RenderHtml
              tagsStyles={{
                p: {color: 'black'},
                h1: {color: 'black'},
                h2: {color: 'black'},
                h3: {color: 'black'},
                h4: {color: 'black'},
                h5: {color: 'black'},
                h6: {color: 'black'},
                h7: {color: 'black'},
                ul: {color: 'black'},
                li: {color: 'black'},
              }}
              contentWidth={width}
              source={source}
            />
          </ScrollView>
        </View>
        <View style={styles.bottomContainer}>
          <Text
            style={{fontSize: hp('2.1%'), color: 'black', fontWeight: 'bold', paddingBottom: 15}}>
            Please <Text style={{color: colors.themeBlue}}>Click here</Text> to read the{' '}
            <Text
              style={{
                color: colors.themeBlue,
                borderBottomColor: colors.themeBlue,
                borderBottomWidth: 1,
              }}>
              NDA (Non Disclosure Agreement)
            </Text>
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <BouncyCheckbox
              size={25}
              fillColor={'#000'}
              unfillColor="#FFFFFF"
              text="Remember me"
              isChecked={isChecked}
              disableText={true}
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{
                fontFamily: 'JosefinSans-Regular',
                color: colors.themeBlue,
              }}
              onPress={isChecked => setIsChecked(isChecked)}
            />
            <Text style={{marginLeft: 10, color: '#000', fontSize: hp('2%')}}>
              I Accept
            </Text>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={handleSignup}
            style={styles.btnContainer}>
            <Text style={{color: 'white', fontSize: hp('2%')}}>
              {loading ? <ActivityIndicator size={25} color={'white'} /> : 'Ok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RiderTermsAndConditions;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: wp('92%'),
    height: hp('95%'),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomContainer: {
    width: '100%',
    height: '27%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
  },
  btnContainer: {
    backgroundColor: 'black',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 250,
    marginTop: 10,
  },
});
