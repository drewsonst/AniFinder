import React from 'react'
import { View, Text, Image, StyleSheet, SectionList, RefreshControl, TouchableOpacity } from 'react-native'
import moment from "moment"

class AnimeSectionList extends React.Component {

  state = {
    refreshing: false,
  }

  renderItem = ({ item, section }) => {
    const date = item.media.nextAiringEpisode ?
      moment.unix(item.media.nextAiringEpisode.airingAt) :
      null
    const next = item.media.nextAiringEpisode ?
      new moment.duration(item.media.nextAiringEpisode.timeUntilAiring * 1000) :
      null

    const renderIcons = ({ site }) => {
      let uri = ''
      switch (site) {
        case "Hulu":
          icon = require('./assets/hulu_icon.png')
          break
        case "Crunchyroll":
          icon = require('./assets/crunchyroll_icon.jpg')
          break
        case "Netflix":
          icon = require('./assets/netflix_icon.png')
          break
        case "Hidive":
          icon = require('./assets/hidive_icon.jpg')
          break
        case "Funimation":
          icon = require('./assets/funi_icon.jpg')
          break
        case "Amazon":
          icon = require('./assets/prime_icon.png')
          break
        default:

      }
      return <Image key={site} style={styles.icon} source={icon} />
    }

    Behind = () => {
      if (section.title === 'Watching' && item.behind != 0) {
        return (
          <TouchableOpacity onPress={addProgress} onLongPress={dismissNotif} style={styles.behindCell}>
            <Text style={styles.behind}>{item.behind}</Text>
          </TouchableOpacity>
        )
      } else { return null }
    }

    addProgress = () => {
      this.props.addProgress(item.id, false)
    }

    dismissNotif = () => {
      this.props.addProgress(item.id, true)
    }

    openPage = () => {
      this.props.openPage(item.media.id)
    }

    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity onPress={openPage} style={styles.poster}>
          <Image style={{ height: '100%', width: '100%' }} source={{ uri: item.media.coverImage }} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={openPage}>
            <Text style={styles.title} >
              {item.media.title.english ? item.media.title.english : item.media.title.romaji}
              <Text style={styles.title} style={{ fontSize: 15 }}>  {item.media.averageScore && `(${item.media.averageScore}%)`}</Text>
            </Text>
            <Text style={styles.subTitle} >
              {item.media.title.romaji ? item.media.title.romaji : item.media.title.english}
            </Text>
          </TouchableOpacity>
          <Text style={styles.episode} >
            Episode {date ? `${item.media.nextAiringEpisode.episode}: ${date.format('ddd, MM/DD, a')} (${next.humanize()})` : 'N/A'}
          </Text>
          <View style={{ flexDirection: 'row' }} >
            {item.media.externalLinks.map(renderIcons)}
          </View>
        </View>
        <Behind />
      </View>
    )
  }

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '83%',
        marginLeft: '17%',
        backgroundColor: 'lightsteelblue',
        opacity: 0.5
      }}
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
            <Text style={{
              fontWeight: 'bold',
              color: 'lightcyan',
              fontSize: 20,
              borderBottomWidth: 2,
              borderBottomColor: 'darkcyan'
            }}>
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
  cellContainer: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5
  },
  poster: {
    width: '20%',
    height: 125,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flexDirection: 'column',
    width: '73%',
    paddingTop: 10,
    paddingLeft: 10
  },
  behindCell: {
    marginTop: 15,
    height: 28,
    width: 28,
    marginLeft: -12,
    backgroundColor: '#c4301f',
    borderWidth: 3,
    borderColor: '#8e2013',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  behind: {
    alignSelf: 'center',
    fontSize: 15,
    color: 'lightsteelblue',
  },
  icons: {
    paddingVertical: 10,
  },
  title: {
    flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'lightsteelblue'
  },
  subTitle: {
    flexWrap: 'wrap',
    fontSize: 12,
    fontStyle: 'italic',
    color: 'lightsteelblue',
    opacity: 0.7
  },
  episode: {
    paddingTop: 10,
    color: 'lightcyan'
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 5,
  },
})
