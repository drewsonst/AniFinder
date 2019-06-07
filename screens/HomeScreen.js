import React from 'react'
import { Linking, ActivityIndicator, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { fetchList, addProgress } from '../api'
import { updateList } from '../redux/actions'
import AnimeSectionList from '../AnimeSectionList'


class HomeScreen extends React.Component {
  state = {
    updating: false
  }

  fetchListAsync = async () => {
    const showList = await fetchList(this.props.user.userId)
    this.props.updateList(showList)
  }

  addProgress = async (id, dismiss) => {
    this.setState({ updating: true })
    let found = this.props.watching.find(item => (item.id === id))
    let progress, status
    if (dismiss) {
      progress = found.media.nextAiringEpisode
        ? found.media.nextAiringEpisode.episode - 1
        : found.media.episodes === null
          ? found.media.episodes : 0
      status = 'CURRENT'
    } else {
      progress = found.progress + 1
      status = found.media.episodes === null ? 'CURRENT' : progress < found.media.episodes ? 'CURRENT' : 'COMPLETED'
    }
    await addProgress(this.props.user.accessToken, id, status, progress)
    const showList = await fetchList(this.props.user.userId)
    this.props.updateList(showList)
    this.setState({ updating: false })
  }

  openPage = async mediaId => {
    const url = `https://anilist.co/anime/${mediaId}`
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.updating &&
          <View style={styles.updateOverlay}>
            <ActivityIndicator size="large" />
          </View>
        }
        <AnimeSectionList
          addProgress={this.addProgress}
          openPage={this.openPage}
          refresh={this.fetchListAsync}
          firstTitle='Watching'
          first={this.props.watching}
          secondTitle='Planning'
          second={this.props.planning}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  watching: state.list.watching,
  planning: state.list.planning,
  user: state.user,
})

export default connect(mapStateToProps, { updateList: updateList })(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateOverlay: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})