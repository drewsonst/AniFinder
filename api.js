import { AuthSession } from 'expo'

apiID = 'ENTER API KEY FROM ANILIST.CO'

export const fetchList = async (userId) => {
  const query = `
    query($userId: Int){
      MediaListCollection(userId: $userId, type:ANIME){
        lists {
          name
          entries {
            id
            status
            progress
            media{
              id
              title{
                romaji
                english
              }
              coverImage {
                extraLarge
                large
                medium
                color
              }
              episodes
              averageScore
              nextAiringEpisode {
                episode
                airingAt
                timeUntilAiring
              }
              externalLinks {
                site
              }
            }
          }
        }
      }
    }`

  const variables = {
    userId: userId.toString()
  }
  const url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    }

  try {
    let res = await fetch(url, options)
    res = await res.json()
    let showList = res.data.MediaListCollection.lists.reduce((obj, item) => {
      obj[item.name.toLowerCase()] = item.entries
      return obj
    }, {})
    Object.keys(showList).map(key => {
      return (
        showList[key] = showList[key].map(item => {
          return ({
            ...item,
            behind: item.media.nextAiringEpisode //number of episodes behind the current episode
              ? item.media.nextAiringEpisode.episode - 1 - item.progress
              : item.media.episodes - item.progress,
            media: {
              ...item.media,
              coverImage: item.media.coverImage.large,
              externalLinks: item.media.externalLinks.filter(link =>
                /Hulu|Crunchyroll|Netflix|Hidive|Funimation|Amazon/.test(link.site)
              )
            }
          })
        }).sort((a, b) => {
          let x, y
          if (key === 'watching') {
            x = a.behind //most behind series on top
              ? b.behind
              : a.media.nextAiringEpisode //else sort by next airing date
                ? a.media.nextAiringEpisode.timeUntilAiring
                : null //if not currently airing push to bottom
            y = b.behind
              ? a.behind
              : b.media.nextAiringEpisode
                ? b.media.nextAiringEpisode.timeUntilAiring
                : null
          } else if (key === 'planning') { //sort by next airing date for upcomming shows or alphabetically for past shows
            x = a.media.nextAiringEpisode
              ? a.media.nextAiringEpisode.timeUntilAiring
              : a.media.title.english ? a.media.title.english : a.media.title.romaji
            y = b.media.nextAiringEpisode
              ? b.media.nextAiringEpisode.timeUntilAiring
              : b.media.title.english ? b.media.title.english : b.media.title.romaji
          } else { //all other lists sort alphabetically 
            x = a.media.title.english ? a.media.title.english : a.media.title.romaji
            y = b.media.title.english ? b.media.title.english : b.media.title.romaji
          }
          return (x === null) - (y === null) || +(x > y) || -(x < y) //sort by above, null pushed to bottom of list
        })
      )
    })
    return showList
  } catch (err) {
    console.log(err.message)
  }
}

export const addProgress = async (accessToken, id, status, progress) => {
  const query = `
    mutation ($id: Int, $status: MediaListStatus, $progress: Int) {
      SaveMediaListEntry (id: $id, status: $status, progress: $progress) {
          id
          status
          progress
      }
    }`

  const variables = {
    id: id,
    status: status,
    progress: progress
  }

  const url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    }
  try {
    await fetch(url, options)
  } catch (err) {
    console.log(err)
  }
}

export const changeList = async (accessToken, id, status) => {
  const query = `
    mutation ($id: Int, $status: MediaListStatus) {
      SaveMediaListEntry (id: $id, status: $status) {
          id
          status
          progress
      }
    }`

  const variables = {
    id: id,
    status: status,
  }

  const url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    }
  try {
    await fetch(url, options)
  } catch (err) {
    console.log(err)
  }
}

export const handleLogin = async () => {
  const redirectData = await AuthSession.startAsync({
    authUrl: `https://anilist.co/api/v2/oauth/authorize?client_id=${apiID}&response_type=token`,
  })
  if (redirectData.type === 'error') {
    console.log('Error ', redirectData.errorCode.toString())
    return null
  } else if (redirectData.params.access_token) {
    return redirectData.params.access_token.toString()
  } else if (redirectData.params.error) {
    console.log('Error ', redirectData.params.error.toString())
    return null
  } else {
    console.log('Error ', 'Something went wrong...')
    return null
  }
}

export const queryUserId = async accessToken => {
  let query =
    `query{
      Viewer{
        id
      }
    }`

  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      })
    }

  try {
    let res = await fetch(url, options)
    res = await res.json()
    return res.data.Viewer.id.toString()
  } catch (err) {
    console.log('Error ', err)
  }
}