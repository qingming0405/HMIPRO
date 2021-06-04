<template>
  <div class="message-box">
    <slot name="title">
      <div class='title'>
          {{message.title}}
          <slot name="operate"></slot>
      </div>
    </slot>
    <slot name="content">
      <textarea class='radius default-border content' v-model="message.val"></textarea>
    </slot>
  </div>
</template>

<script>

export default {
  name: 'MessageBox',
  props: {
    message: {
      type: Object,
      default: () => {
        return {
          title: '',
          val: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.message-box{
  font-size: 12px;

  .title {
    width: 100%;
    height: 20px;
    line-height: 20px;
    position: relative;
  }
  textarea {
    width: 100%;
    height: calc(100% - 20px);
    resize: none;
  }
}
  
</style>