import { AuthSession } from 'expo'


export const fetchList = async (userId) => {
  const query = `
    query($userId: Int){
      MediaListCollection(userId: $userId, type:ANIME){
        lists {
          name
          entries {
            id
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
    let shortData = res.data.MediaListCollection.lists
    let showList = {
      watching: shortData[0].entries,
      planning: shortData[1] ? shortData[1].entries : [],
      dropped: shortData[2].entries,
      completed: shortData[3].entries,
    }
    Object.keys(showList).map(key => {
      return (
        showList[key] = showList[key].map(item => {
          return ({
            ...item,
            behind: item.media.nextAiringEpisode
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
            x = a.behind
              ? b.behind
              : a.media.nextAiringEpisode
                ? a.media.nextAiringEpisode.timeUntilAiring
                : null
            y = b.behind
              ? a.behind
              : b.media.nextAiringEpisode
                ? b.media.nextAiringEpisode.timeUntilAiring
                : null
          } else if (key === 'planning') {
            x = a.media.nextAiringEpisode ? a.media.nextAiringEpisode.timeUntilAiring : a.media.title.english
            y = b.media.nextAiringEpisode ? b.media.nextAiringEpisode.timeUntilAiring : b.media.title.english
          } else {
            x = a.media.title.english
            y = b.media.title.english
          }
          return (x === null) - (y === null) || +(x > y) || -(x < y)
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
    let res = await fetch(url, options)
    res = await res.json()
  } catch (err) {
    console.log(err)
  }
}

export const handleLogin = async () => {
  const redirectData = await AuthSession.startAsync({
    authUrl: `https://anilist.co/api/v2/oauth/authorize?client_id=1852&response_type=token`,
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