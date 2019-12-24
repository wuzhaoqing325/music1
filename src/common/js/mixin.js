import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const searchMixin = {
  data(){
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
     'searchHistory'
    ])
  },
  methods: {
      onQueryChange(query){
        this.query = query
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      saveSearch(){
        this.saveSearchHistory(this.query)
      },
        ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'playlist',
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
    ]),
    iconMode(){
        return this.mode === playMode.sequence ? 'icon-sequence': this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      }
  },
  methods: {
    changeMode(){
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        // list改变，currentIndex也改变，以保证currentSong不变（切换播放模式时，不换歌曲）
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        // 在list中找到当前歌曲的索引
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getFavoriteIcon(song){
        if(this.isFavorite(song)){
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      toggleFavorite(song){
        if(this.isFavorite(song)){
          this.deleteFavoriteList(song)
        } else {
          this.saveFavoriteList(song)
        }
      },
      isFavorite(song){
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST',
        setPlayingState: 'SET_PLAYING_STATE',
      }),
      ...mapActions([
          'saveFavoriteList',
          'deleteFavoriteList'
        ])
  }
}