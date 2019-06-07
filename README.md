# AniFinder
Anime tracking app.

This project uses React Native to create mobile app to track anime that a user is watching or planning to watch. The app displays the shows in a list with information on when the next episode airs, where the show can be viewed, and how many episodes behind the user is.

Information for the anime and tracking of the shows is obtained from [anilist.co](anilist.co) through a GraphQL api.

#### App flow:

<img align="right" width="200" height="350" src="https://github.com/drewsonst/Images/raw/master/loadingScreen.png">

</br>
</br>

* LoadingScreen.js
  * Check for stored authorization token
    * If not sign into [anilist.co](anilist.co) using OAuth
    * Store the returned auth token and user ID in AsyncStorage
  * Send GraphQL query to obtain shows in the user's list and information on each show
  * Dispatch lists to redux store
  
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>

<img align="right" width="200" height="350" src="https://github.com/drewsonst/Images/raw/master/homeScreen.png">

</br>
</br>

* HomeScreen.js
  * Subscribe to watching and planning lists in the redux store
  * Display the currently watching and planned to watch lists in a SectionList
    * List is ordered by which episodes are next to air
    * Episodes that have aired but not been watched are moved to the top with a tag displaying the number of episodes behind
      * Press the notification to mark the episode as watched
        * Long press to dismiss all current notifs for that show
    * Press the show title or the image to link to the show's [anilist.co](anilist.co) page

</br>
</br>
</br>
</br>

<img align="right" width="200" height="350" src="https://github.com/drewsonst/Images/raw/master/finishedScreen.png">

</br>
</br>

* FinishedScreen.js
  * Subscribe to completed and dropped lists in the redux store
  * Display the completed and dropped lists in a SectionList
    * List is ordered alphabetically

</br>
</br>
</br>
</br>
</br>

* api.js
  * Handles all fetch requests to [anilist.co](anilist.co)

#### Libraries used:
  * expo: ^32.0.0
  * moment: ^2.24.0
  * react: 16.5.0
  * react-native: https://github.com/expo/react-native/archive/sdk-32.0.0.tar.gz
  * react-navigation: ^3.7.1
  * react-redux: ^5.0.7
  * redux: ^3.7.2
