<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 黄色进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')
  const progressBtnWidth = 16
  
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch = {}
    },
    methods: {
      progressTouchStart(e){
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        // 黄色进度条长度
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        // 移动的距离
        const deltaX = e.touches[0].pageX - this.touch.startX
        // offsetWidth在0和this.$refs.progressBar.clientWidth - progressBtnWidth中取值
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        // 黄色进度条长度+移动的距离
        this._offset(offsetWidth)
      },
      progressTouchEnd(){
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e){
        const rect = this.$refs.progressBar.getBoundingClientRect()
        // 点击事件距离屏幕左侧的距离 - progressBar距离屏幕左侧的距离
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击progressBtn时，e.offsetX获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      // 向外部传递进度的改变
      _triggerPercent(){
        // 总长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange',percent)
      },
      _offset(offsetWidth){
        // 黄色进度条的宽度
        this.$refs.progress.style.width = `${offsetWidth}px`
        // 按钮的偏移
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent){
        // 没有拖动的时候，newPercent 才更新
        if(newPercent >= 0 && !this.touch.initiated){
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newPercent
          this._offset(offsetWidth)
        }
      }
    }
  };
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
@import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>