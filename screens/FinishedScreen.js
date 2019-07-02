import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Linking } from 'react-native'
import { connect } from 'react-redux'
import { updateList } from '../redux/actions'
import { fetchList, changeList } from '../api'
import AnimeSectionList from '../AnimeSectionList'

class FinishedScreen extends Component {
  state = {
    updating: false
  }

  fetchListAsync = async () => {
    const showList = await fetchList(this.props.user.userId)
    this.props.updateList(showList)
  }

  openPage = async mediaId => {
    const url = `https://anilist.co/anime/${mediaId}`
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  changeList = async (status, id) => {
    this.setState({ updating: true })
    await changeList(this.props.user.accessToken, id, status)
    const showList = await fetchList(this.props.user.userId)
    this.props.updateList(showList)
    this.setState({ updating: false })
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
          openPage={this.openPage}
          changeList={this.changeList}
          refresh={this.fetchListAsync}
          firstTitle='Completed'
          first={this.props.completed}
          secondTitle='Dropped'
          second={this.props.dropped}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  completed: state.list.completed,
  dropped: state.list.dropped,
  user: state.user,
})

export default connect(mapStateToProps, { updateList: updateList })(FinishedScreen)

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