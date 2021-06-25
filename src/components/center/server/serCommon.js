export default {
  name: 'server',
  data() {
    return {
      general: {}, // 总览
      systemInfo: [], //系统信息
      cpuInfo: [], //cpu信息
      memoryInfo: [], //内存信息
      diskInfo: [], //磁盘信息
      networkInfo: [] //网络信息
    };
  },
  watch: {
    "$store.state.serverMsg": {
      handler(value) {
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
    initParams() {
      this.general = {
        system: {status: 0, statusDesc: this.statusDesc(0), statusColor: this.statusColor(0)},
        cpu: {status: 0, statusDesc: this.statusDesc(0), statusColor: this.statusColor(0)},
        memory: {status: 0, statusDesc: this.statusDesc(0), statusColor: this.statusColor(0)},
        disk: {status: 0, statusDesc: this.statusDesc(0), statusColor: this.statusColor(0)},
        network: {status: 0, statusDesc: this.statusDesc(0), statusColor: this.statusColor(0)}
      }
      this.systemInfo = []
      this.cpuInfo = []
      this.memoryInfo = []
      this.diskInfo = []
      this.networkInfo = []
    },
    openChartList(type) {
      this.initParams()
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
    // 二维数组行列互换
    transColToRow(sourceArr) {
      let newArr = []
      for(let i=0; i<sourceArr.length; i++){
        for(let j = 0; j<sourceArr[i].length; j++) {
          if(typeof newArr[j] === 'undefined') {
            newArr[j] = []
          }
          newArr[j][i] = sourceArr[i][j]
        }
      }
      return newArr
    },
    statusDesc(status) {
      switch(status) {
        case 0:
          return this.$t('Common.normalText')
        case 1:
          return this.$t('Common.warnText')
        case 2:
          return this.$t('Common.alarmText')
      }
      return this.$t('Common.normalText')
    },
    statusColor(status) {
      switch(status) {
        case 0:
          return ''
        case 1:
          return 'warning-text'
        case 2:
          return 'alarm-text'
      }
      return ''
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
          let status
          if (diskInfo != undefined && diskInfo.length > 0) {
            status = diskInfo.status
            that.general.disk = {
              status,
              statusDesc: this.statusDesc(status),
              statusColor: this.statusColor(status)
            }
            let tempList = [];
            let obj = [
              this.$t('server.DiskName'),//"磁盘名称"
              this.$t('server.DiskType'),//"磁盘类型",
              this.$t('server.DiskCapacity'),//"磁盘容量",
              this.$t('server.AvailableSpace'),//"可用空间",
              this.$t('server.UsedSpace'),//"已用空间",
            ]
            tempList.push(obj)
            for (let i = 0; i < diskInfo.length; i++) {
              obj = [
                diskInfo[i].name,
                diskInfo[i].type,
                diskInfo[i].total,
                diskInfo[i].free,
                diskInfo[i].used,
              ];
              tempList.push(obj)
            }
            that.diskInfo = this.transColToRow(tempList)
          }
          if (systemInfo != undefined) {
            status = systemInfo.status
            that.general.system = {
              status,
              statusDesc: this.statusDesc(status),
              statusColor: this.statusColor(status)
            }
            that.systemInfo = [
              [this.$t('server.HostName'), systemInfo.hostName ],
              [this.$t('server.JVMMemory'), systemInfo.jvmTotal ],
              [this.$t('server.JVMRemainMemory'), systemInfo.jvmFree ],
              [this.$t('server.JAVAVersion'), systemInfo.jdkVersion ],
              [this.$t('server.JAVAPath'), systemInfo.jdkPath ],
              [this.$t('server.operateSystem'), systemInfo.operatingSystem ],
              ['CPUEndian', systemInfo.CPUEndian ]
            ];//'主机名称', 'JVM总内存', 'JVM剩余内存', 'JAVA版本', 'JAVA路径', '操作系统', 'CPUEndian'
          }
          if (cpu != undefined) {
            status = cpu.status
            that.general.cpu = {
              status,
              statusDesc: this.statusDesc(status),
              statusColor: this.statusColor(status)
            }
            that.cpuInfo = [
              [this.$t('server.CPUNumber'), cpu.processorCount ],
              [this.$t('server.CPUBrand'), cpu.cpuBrand ],
              [this.$t('server.CPUModel'), cpu.cpuType ],
              [this.$t('server.UserUtilization'), cpu.cpuUserUsed ],
              [this.$t('server.SystemUtilization'), cpu.cpuSystemUsed ],
              [this.$t('server.TotalUsage'), cpu.cpuTotalUsed ]
            ];//'CPU核心个数', 'CPU品牌', 'CPU型号', '用户使用率', '系统使用率', '总使用率'
          }
          if (memory != undefined) {
            status = memory.status
            that.general.memory = {
              status,
              statusDesc: this.statusDesc(status),
              statusColor: this.statusColor(status)
            }
            that.memoryInfo = [
              [ this.$t('server.TotalMemory'), memory.totalMemory ],
              [ this.$t('server.MemoryUsage'), memory.usedMemory ],
              [ this.$t('server.RemainMemory'), memory.freeMemory ],
              [ this.$t('server.MemoryUsage'), memory.usedRate ]
            ];//'内存总量', '内存使用量', '内存剩余量', '内存使用率'
          }
          
          if (networkInfo != undefined && networkInfo.length > 0) {
            status = networkInfo.status == 1 ? 2 : 0 // 0正常 1：网络异常
            that.general.network = {
              status,
              statusDesc: status === '1' ? this.$t('server.networkAbnormality') : this.$t('Common.normalText'),
              statusColor: this.statusColor(status)
            }
            let tempList = [];
            let obj = [
                this.$t('server.EquipName'),//"设备名称",
                this.$t('server.IPAddress'),//"IP地址",
                this.$t('server.SubnetMask'),//"子网掩码",
                this.$t('server.MACAddress'),//"MAC地址",
                this.$t('server.NetworkInfo'),//"网卡信息",
                this.$t('server.recevePacket'),//"接收总包数",
                this.$t('server.sentPacket'),//"发送总包数",
                this.$t('server.receveByte'),// "接收总字节数",
                this.$t('server.sentByte'),//"发送总字节数",
                this.$t('server.receveErrorPacket'),//"接收错误包数",
                this.$t('server.sentErrorPacket'),//"发送错误包数",
                this.$t('server.discardPacket'),//"接收丢弃包数",
            ];
            tempList.push(obj)
            for (let i = 0; i < networkInfo.length; i++) {
              let obj = {};
              obj = [
                networkInfo[i].deviceName,
                networkInfo[i].ip.join('/'),
                networkInfo[i].netMask.join('/'),
                networkInfo[i].macaddr,
                networkInfo[i].info,
                networkInfo[i].receivePackage,
                networkInfo[i].sendPackage,
                networkInfo[i].receiveByte,
                networkInfo[i].sendByte,
                networkInfo[i].receiveErrorPackage,
                networkInfo[i].sendErrorPackage,
                networkInfo[i].receiveDropPackage,
              ];
              tempList.push(obj)
            }
            that.networkInfo = this.transColToRow(tempList)
          }
        }
      })
    },
    csvRow(...args) {
      if(!args || args.length === 0){
        return ''
      }
      let len = args.length
      let str = ''
      for(let i=0; i<len; i++) {
        str += args[i]
        if(i === len-1){
          str += '\n'
        }
        else {
          str += ','
        }
      }
      return str
    },
    exportData() {
      // 构造数据
      let csv = "\ufeff"  
      csv += this.csvRow(this.$t("server.systemMessage"),this.general.system.statusDesc)
      for(let row of this.systemInfo){
        csv += this.csvRow(row)
      }

      csv += this.csvRow('')
      csv += this.csvRow(this.$t("server.CPUInfo"), this.general.cpu.statusDesc)
      for(let row of this.cpuInfo){
        csv += this.csvRow(row)
      }

      csv += this.csvRow('')
      csv += this.csvRow(this.$t("server.MemoryInfo"), this.general.memory.statusDesc)
      for(let row of this.memoryInfo){
        csv += this.csvRow(row)
      }

      csv += this.csvRow('')
      csv += this.csvRow(this.$t("server.DiskInfo"), this.general.disk.statusDesc)
      for(let row of this.diskInfo){
        csv += this.csvRow(row)
      }

      csv += this.csvRow('')
      csv += this.csvRow(this.$t("server.InternetInfo"), this.general.network.statusDesc)
      for(let row of this.networkInfo){
        csv += this.csvRow(row)
      }

      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = `${this.$t('HeaderEdge.secondLevel5_2')}.csv`;//监测报表
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    }
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "server"
    });
    this.initParams()
  }
}