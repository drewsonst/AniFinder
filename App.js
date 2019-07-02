import React from 'react'
import { Provider } from 'react-redux'
import { createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import store from './redux/store'

import HomeScreen from './screens/HomeScreen'
import FinishedScreen from './screens/FinishedScreen'
import LoadingScreen from './screens/LoadingScreen'


const MainTabs = createBottomTabNavigator({
  Watching: HomeScreen,
  Finished: FinishedScreen,
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        let IconComponent = FontAwesome
        let iconName
        if (routeName === 'Watching') {
          iconName = 'eye'
        } else if (routeName === 'Finished') {
          iconName = `eye-slash`
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />
      },
    }),
    tabBarOptions: {
      activeTintColor: 'lightcyan',
      inactiveTintColor: '#476b6b',
      style: {
        height: 40,
        backgroundColor: '#191919'
      }
    },
  }
)

const AppNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    Main: MainTabs,
  },
  {
    initialRouteName: 'Loading',
  })

const AppContainer = createAppContainer(AppNavigator)


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}
