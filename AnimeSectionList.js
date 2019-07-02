import React from 'react'
import { View, Text, StyleSheet, SectionList, RefreshControl } from 'react-native'
import moment from "moment"

import AnimeCell from './AnimeCell'

class AnimeSectionList extends React.Component {

  state = {
    refreshing: false,
  }

  renderItem = ({ item, section }) => (
    <AnimeCell
      item={item}
      section={section}
      addProgress={this.props.addProgress}
      dismissNotif={this.props.dismissNotif}
      openPage={this.props.openPage}
      changeList={this.props.changeList}
    />
  )

  renderSeparator = () => (
    <View
      style={styles.seperator}
    />
  )

  keyExtractor = item => item.id.toString()

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.props.refresh().then(() => {
      this.setState({ refreshing: false })
    })
  }

  render() {
    return (
      <>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>
              {title}
            </Text>
          )}
          sections={[
            { title: this.props.firstTitle, data: this.props.first },
            { title: this.props.secondTitle, data: this.props.second },
          ]}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={this.renderSeparator}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </>
    )
  }
}

export default AnimeSectionList

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 'bold',
    color: 'lightcyan',
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'darkcyan'
  },
  seperator: {
    height: 1,
    width: '83%',
    marginLeft: '17%',
    backgroundColor: 'lightsteelblue',
    opacity: 0.5
  }
})
