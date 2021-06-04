<template>
  <div
    id="app"
    class="White-content edge-content scroll-style-edge"
    data-theme="default-theme"
  >
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
  name: 'App',
  data() {
    return {}
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="scss">
.el-input {
  width: 100% !important;
}
.el-input__inner {
  height: 20px;
  width: 100% !important;
  border: 1px solid #ccc !important;
}
.el-input__icon {
  line-height: 20px;
}
</style>
