import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { updateList } from '../redux/actions'
import { fetchList } from '../api'
import AnimeSectionList from '../AnimeSectionList'

class FinishedScreen extends Component {

  fetchListAsync = async () => {
    const showList = await fetchList(this.props.userId)
    this.props.updateList(showList)
  }

  render() {
    return (
      <View style={styles.container}>
        <AnimeSectionList
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
  userId: state.user.userId,
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
})