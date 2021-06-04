const popMixins = {
  data() {
    return {
      dragMsg: {
        el: null,
        x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
      },
      drag: 0,
      drop: 0
    }
  },
  mounted() {
    // window.onmousemove = this.moveElem
  },
  methods: {
    // 拖拽弹窗
    dragElem(e) {
      this.dragMsg.el = e.currentTarget.parentElement;
      this.dragMsg.x = e.clientX;
      this.dragMsg.y = e.clientY;

      //获取左部和顶部的偏移量
      this.dragMsg.offsetX = this.dragMsg.el.offsetLeft;
      this.dragMsg.offsetY = this.dragMsg.el.offsetTop;
      //开关打开
      this.dragMsg.isDown = true;
      document.onmousemove = this.moveElem
    },
    // 放下弹窗
    dropElem(e) {
      this.dragMsg.isDown = false;
      document.onmousemove = ''
    },
    // 移动弹窗
    moveElem(e) {
      if (this.dragMsg.isDown == null || this.dragMsg.isDown == false) {
        return;
      }
      //获取x和y
      var nx = e.clientX;
      var ny = e.clientY;
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (this.dragMsg.x - this.dragMsg.offsetX);
      var nt = ny - (this.dragMsg.y - this.dragMsg.offsetY);

      this.dragMsg.el.style.left = nl + "px";
      this.dragMsg.el.style.top = nt + "px";
    }
  }
}

export default popMixins