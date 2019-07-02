import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import moment from "moment"

const AnimeCell = props => {
  const date = props.item.media.nextAiringEpisode ?
    moment.unix(props.item.media.nextAiringEpisode.airingAt) :
    null
  const next = props.item.media.nextAiringEpisode ?
    new moment.duration(props.item.media.nextAiringEpisode.timeUntilAiring * 1000) :
    null

  const renderIcons = ({ site }) => {
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
    if (props.section.title === 'Watching' && props.item.behind != 0) {
      return (
        <TouchableOpacity onPress={addProgress} onLongPress={dismissNotif} style={styles.behindCell}>
          <Text style={styles.behind}>{props.item.behind}</Text>
        </TouchableOpacity>
      )
    } else { return null }
  }

  Controls = () => (
    <View style={styles.controls}>
      {props.section.title !== 'Watching' &&
        <TouchableOpacity onPress={() => { props.changeList('CURRENT', props.item.id) }}>
          <Text style={styles.controlIcons}>{'\u25B6'}</Text>
        </TouchableOpacity>}
      {props.section.title !== 'Planning' &&
        <TouchableOpacity onPress={() => { props.changeList('PLANNING', props.item.id) }}>
          <Text style={styles.controlIcons}>{'\u27A5'}</Text>
        </TouchableOpacity>}
      {props.section.title !== 'Completed' &&
        <TouchableOpacity onPress={() => { props.changeList('COMPLETED', props.item.id) }}>
          <Text style={styles.controlIcons}>{'\u2714'}</Text>
        </TouchableOpacity>}
      {props.section.title !== 'Dropped' &&
        <TouchableOpacity onPress={() => { props.changeList('DROPPED', props.item.id) }}>
          <Text style={styles.controlIcons}>{'\u2716'}</Text>
        </TouchableOpacity>}
    </View>
  )

  addProgress = () => {
    props.addProgress(props.item.id, false)
  }

  dismissNotif = () => {
    props.addProgress(props.item.id, true)
  }

  openPage = () => {
    props.openPage(props.item.media.id)
  }

  return (
    <View style={styles.cellContainer}>
      <TouchableOpacity onPress={openPage} style={styles.poster}>
        <Image style={{ height: '100%', width: '100%' }} source={{ uri: props.item.media.coverImage }} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={openPage}>
          <Text style={styles.title} >
            {props.item.media.title.english ? props.item.media.title.english : props.item.media.title.romaji}
            <Text style={styles.title} style={{ fontSize: 15 }}>  {props.item.media.averageScore && `(${props.item.media.averageScore}%)`}</Text>
          </Text>
          <Text style={styles.subTitle} >
            {props.item.media.title.romaji ? props.item.media.title.romaji : props.item.media.title.english}
          </Text>
        </TouchableOpacity>
        <Text style={styles.episode} >
          Episode {date ? `${props.item.media.nextAiringEpisode.episode}: ${date.format('ddd, MM/DD, a')} (${next.humanize()})` : 'N/A'}
        </Text>
        <View style={{ flexDirection: 'row' }} >
          {props.item.media.externalLinks.map(renderIcons)}
          <Controls />
        </View>
      </View>
      <Behind />
    </View>
  )
}

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
  controls: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginTop: 20,
    marginBottom: 10,
  },
  controlIcons: {
    fontSize: 15,
    marginHorizontal: 7,
    color: 'lightcyan',
  },
})

export default AnimeCell
