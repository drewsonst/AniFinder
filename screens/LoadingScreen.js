import React from 'react'
import { View, AsyncStorage, ImageBackground, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Asset, Font } from 'expo'
import { handleLogin, queryUserId, fetchList } from '../api'
import { updateList, updateUser } from '../redux/actions'
import { connect } from 'react-redux'

let userId = null
let accessToken = null

class LoadingScreen extends React.Component {

  componentDidMount() {
    this.cacheAssets()
    this.retrieveData()
  }

  cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
  }

  cacheAssets = async () => {
    const imageAssets = this.cacheImages([
      require('../assets/hulu_icon.png'),
      require('../assets/crunchyroll_icon.jpg'),
      require('../assets/netflix_icon.png'),
      require('../assets/hidive_icon.jpg'),
      require('../assets/funi_icon.jpg'),
      require('../assets/prime_icon.png'),
    ]);
    const fontAssets = this.cacheFonts([FontAwesome.font])
    await Promise.all([...imageAssets, ...fontAssets])
  }

  retrieveData = async () => {
    let authSuccess = await this.getAuth()
    authSuccess = true
    this.props.updateUser({ userId, accessToken })
    let listSuccess = await this.fetchListAsync()
    authSuccess && listSuccess
      ? this.props.navigation.navigate('Main')
      : Alert.alert('Error', 'Something went wrong. Go fix it')
  }

  getAuth = async () => {
    let success = false
    try {
      accessToken = await AsyncStorage.getItem('accessToken')
      userId = await AsyncStorage.getItem('userId')
      accessToken && userId
        ? success = true
        : success = await this.handleAuthApi()
    } catch (err) {
      Alert.alert('Error', err.toString())
    }
    return success
  }

  handleAuthApi = async () => {
    accessToken = await handleLogin()
    userId = accessToken ? await queryUserId(accessToken) : null
    if (!accessToken || !userId) { return false }
    try {
      await AsyncStorage.setItem('accessToken', accessToken)
      await AsyncStorage.setItem('userId', userId)
      return true
    } catch (err) {
      Alert.alert('Error', err.toString())
      return false
    }
  }

  fetchListAsync = async () => {
    const showList = await fetchList(userId)
    if (showList) {
      this.props.updateList(showList)
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/splash.png')} style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
          <ActivityIndicator size="large" style={{ marginTop: 150 }} />
        </ImageBackground>
      </View>
    )
  }
}

export default connect(null, { updateList: updateList, updateUser: updateUser })(LoadingScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})