import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import colors from '../../../theme/colors';
import BtnComp from '../../../components/BtnComp';

const AddTrainingVideos = ({navigation, route}) => {
  const [selectedVideos, setSelectedVideos] = useState([]);


  const pickVideo = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'video',
    }).then(videos => {
      for (let i = 0; i < videos.length; i++) {
        createThumbnail({
          url: videos[i].path,
        })
          .then(thumbnail => {
            setSelectedVideos(oldVideos => [
              ...oldVideos,
              {video: videos[i].path, thumbnail: thumbnail.path},
            ]);
          })
          .catch(err => {
            console.log('err ====>>>> ', err);
          });
      }
    });
  };

  const removeVideo = thumbnailPath => {
    setSelectedVideos(oldVideos => {
      return oldVideos.filter(video => {
        return video.thumbnail !== thumbnailPath;
      });
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.heading}>Watch training videos</Text>
        </View>

        <View
          style={{
            width: wp('90%'),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 30,
            flexWrap: 'wrap',
          }}>
          {selectedVideos.map(video => {
            return (
              <View style={[styles.imagePickerCont, {overflow: 'hidden'}]}>
                <Image
                  source={{uri: `${video.thumbnail}`}}
                  style={{width: '100%', height: '100%'}}
                />
                <AntDesign
                  name="closecircle"
                  size={15}
                  color={'black'}
                  style={styles.crossIcon}
                  onPress={() => removeVideo(video.thumbnail)}
                />
                <AntDesign
                  name="playcircleo"
                  size={40}
                  color={colors.themeBlue}
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: 50,
                    overflow: 'hidden'
                  }}
                />
              </View>
            );
          })}

          {/* <TouchableOpacity style={styles.imagePickerCont} onPress={pickVideo}>
            <View
              style={styles.pickVideoContainer}>
              <Text
                style={{
                  fontSize: hp('4%'),
                  fontWeight: 'bold',
                  color: colors.themeBlue,
                }}>
                +
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>

        <View
          style={{
            width: wp('85%'),
            alignSelf: 'center',
            marginVertical: 40,
            // position: 'absolute',
            bottom: 0,
          }}>
          <BtnComp
            btnText={'Done'}
            onPress={() => {
              navigation.goBack()
                // navigation.navigate('DriverTermsAndConditions', {
                //   selectedOption,
                //   driverForm,
                //   pickedImage,
                //   imageMime,
                //   licenseImage,
                //   licenseMime,
                //   bankInfo,
                // });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTrainingVideos;

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 30,
  },
  topContainer: {
    width: wp('88%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('3%'),
  },
  imagePickerCont: {
    width: '48%',
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.themeBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickVideoContainer: {
    backgroundColor: '#E8F1FA',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 250,
  },
  crossIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
    overflow: 'hidden'
  }
});
