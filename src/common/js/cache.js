import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen){
  // 找到这个值在数组中的位置
  const index = arr.findIndex(compare)
  if(index === 0){
    return
  }
  if(index > 0){
    arr.splice(index, 1)
  }
  // 在开头插入最新搜索的数据
  arr.unshift(val)
  // 当数组中的数据大于最大的长度，删除最老的数据
  if(maxLen && maxLen < arr.length){
    arr.pop()
  }
}

// 从数组中删除符合要求的数据，并返回该数组
function deleteFromArray(arr, compare){
  const index = arr.findIndex(compare)
  if(index > -1){
    arr.splice(index, 1)
  }
}


// 把query插入 storage,并把最新数组返回
export function saveSearch(query){
  // 如果有 SEARCH_KEY 返回其中的数据，没有的话返回[]
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(searches, query,item => {
      return item === query
    },SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从storage中删除query，并返回新数组
export function deleteSearch(query){
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空storage
export function clearSearch(){
  storage.remove(SEARCH_KEY)
  return []
}

// 获取storage中的搜索历史值
export function loadSearch(){
  return storage.get(SEARCH_KEY, [])
}

// 保存播放的歌曲
export function savePlay(song){
  let songs = storage.get(PLAY_KEY, [])

  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)
  return songs
}

// 加载播放歌曲
export function loadPlay(){
  return storage.get(PLAY_KEY, [])
}



// 保存最喜欢的歌曲
export function saveFavorite(song){
  let songs = storage.get(FAVORITE_KEY, [])

  insertArray(songs, song, item => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除最喜欢的歌曲
export function deleteFavorite(song){
  let songs = storage.get(FAVORITE_KEY, [])

  deleteFromArray(songs, item => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 加载最喜欢的歌曲
export function loadFavorite(){
  return storage.get(FAVORITE_KEY, [])
}