export default {
  name:'server',
  data() {
    return {
      systemInfo: [], //系统信息
      cpuInfo: [], //cpu信息
      memoryInfo: [], //内存信息
      diskInfo: [], //磁盘信息
      networkInfo: [] //网络信息
    };
  },
  watch: {
    "$store.state.serverMsg": {
      handler (value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift();
            this.openChartList(item.state);
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    openChartList (type){
      this.systemInfo = []
      this.cpuInfo = []
      this.memoryInfo = []
      this.diskInfo = []
      this.networkInfo = []
      switch (type) {
        case 0 /* 打开图表 */:
          this.getData();
          break;
        case 1 /* 切换图表 */:
          this.getData();
          break;
        case 2 /* 关闭图表 */:
          break;
        case 4 /* 图表跳转图谱 */:
          this.getData();
          break;
      }
    },
    getData() {
      let that = this;
      that.systemInfo.length = 0;
      this.$getApi.getServerInfo().then(res => {
        if (res && res.msg === 0) {
          let systemInfo = res.systemInfo;
          let cpu = res.cpu;
          let memory = res.memory;
          let diskInfo = res.diskInfo;
          let networkInfo = res.networkInfo;
          let systemInfoList = ['主机名称', 'JVM总内存', 'JVM剩余内存', 'JAVA版本', 'JAVA路径', '操作系统', 'CPUEndian'];
          let cpuInfoList = ['CPU核心个数', 'CPU品牌', 'CPU型号', '用户使用率', '系统使用率', '总使用率'];
          let memoryInfoList = ['内存总量', '内存使用量', '内存剩余量', '内存使用率'];
          that.diskInfo = [
            {
              name: "磁盘名称",
              type: "磁盘类型",
              total: "磁盘容量",
              free: "可用空间",
              used: "已用空间",
            }
          ];
          that.networkInfo = [
            {
              deviceName: "设备名称",
              ip: "IP地址",
              netMask: "子网掩码",
              macaddr: "MAC地址",
              info: "网卡信息",
              receivePackage: "接收总包数",
              sendPackage: "发送总包数",
              receiveByte: "接收总字节数",
              sendByte: "发送总字节数",
              receiveErrorPackage: "接收错误包数",
              sendErrorPackage: "发送错误包数",
              receiveDropPackage: "接收丢弃包数",
            }
          ];
          if (systemInfo != undefined) {
            for (let i = 0; i < systemInfoList.length; i++) {
              let obj = {};
              obj.title = systemInfoList[i];
              switch (systemInfoList[i]) {
                case '主机名称':
                  obj.info = systemInfo.hostName;
                  break;
                case 'JVM总内存':
                  obj.info = systemInfo.jvmTotal;
                  break;
                case 'JVM剩余内存':
                  obj.info = systemInfo.jvmFree;
                  break;
                case 'JAVA版本':
                  obj.info = systemInfo.jdkVersion;
                  break;
                case 'JAVA路径':
                  obj.info = systemInfo.jdkPath;
                  break;
                case '操作系统':
                  obj.info = systemInfo.operatingSystem;
                  break;
                case 'CPUEndian':
                  obj.info = systemInfo.CPUEndian;
                  break;
              }
              that.systemInfo.push(obj);
            }
          }
          if (cpu != undefined) {
            for (let i = 0; i < cpuInfoList.length; i++) {
              let obj = {};
              obj.title = cpuInfoList[i];
              switch (cpuInfoList[i]) {
                case 'CPU核心个数':
                  obj.info = cpu.processorCount;
                  break;
                case 'CPU品牌':
                  obj.info = cpu.cpuBrand;
                  break;
                case 'CPU型号':
                  obj.info = cpu.cpuType;
                  break;
                case '用户使用率':
                  obj.info = cpu.cpuUserUsed;
                  break;
                case '系统使用率':
                  obj.info = cpu.cpuSystemUsed;
                  break;
                case '总使用率':
                  obj.info = cpu.cpuTotalUsed;
                  break;
              }
              that.cpuInfo.push(obj);
            }
          }
          if (memory != undefined) {
            for (let i = 0; i < memoryInfoList.length; i++) {
              let obj = {};
              obj.title = memoryInfoList[i];
              switch (memoryInfoList[i]) {
                case '内存总量':
                  obj.info = memory.totalMemory;
                  break;
                case '内存使用量':
                  obj.info = memory.usedMemory;
                  break;
                case '内存剩余量':
                  obj.info = memory.freeMemory;
                  break;
                case '内存使用率':
                  obj.info = memory.usedRate;
                  break;
              }
              that.memoryInfo.push(obj);
            }
          }
          if (diskInfo != undefined && diskInfo.length > 0) {
            for (let i = 0; i < diskInfo.length; i++) {
              let obj = {};
              obj = {
                name: diskInfo[i].name,
                type: diskInfo[i].type,
                total: diskInfo[i].total,
                free: diskInfo[i].free,
                used: diskInfo[i].used,
              };
              that.diskInfo.push(obj);
            }
          }
          if (networkInfo != undefined && networkInfo.length > 0) {
            for (let i = 0; i < networkInfo.length; i++) {
              let obj = {};
              obj = {
                deviceName: networkInfo[i].deviceName,
                ip: networkInfo[i].ip.join('/'),
                netMask: networkInfo[i].netMask.join('/'),
                macaddr: networkInfo[i].macaddr,
                info: networkInfo[i].info,
                receivePackage: networkInfo[i].receivePackage,
                sendPackage: networkInfo[i].sendPackage,
                receiveByte: networkInfo[i].receiveByte,
                sendByte: networkInfo[i].sendByte,
                receiveErrorPackage: networkInfo[i].receiveErrorPackage,
                sendErrorPackage: networkInfo[i].sendErrorPackage,
                receiveDropPackage: networkInfo[i].receiveDropPackage,
              };
              that.networkInfo.push(obj);
            }
          }
        }
      })
    }
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "server"
    });
  }
}