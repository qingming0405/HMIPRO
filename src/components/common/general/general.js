import { event } from "jquery";
import { round, cloneObj, sortMachine } from "utils/utils.js";
const general = {
  data () {
    return {
      t_root: null, //图标的组织类型
      searchKey: "",
      macList: [],
      searchmac: [],
      timer: {}, //定时器,
      downShow: false,
      itemize: [
        { name: this.$t('Common.allText'), number: 0, type: 0, chooseflag: true },//全部
        { name: this.$t('Common.normalText'), number: 0, type: 1, chooseflag: false },//正常
        { name: this.$t('Common.warnText'), number: 0, type: 2, chooseflag: false },//预警
        { name: this.$t('Common.alarmText'), number: 0, type: 3, chooseflag: false },//报警
        { name: this.$t('Common.offlineText'), number: 0, type: 4, chooseflag: false },//离线
        { name: this.$t('Common.focausText'), number: 0, type: 5, chooseflag: false },//关注
        // { name: '自检异常', number: 0,type:6, chooseflag: false },
      ],
      isRequstDown: true,
      isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
      general: {},
      currentKey: ''
    };
  },
  watch: {
    //监听搜索输入的searchKey，根据searchKey对searchmac进行过滤
    searchKey: {
      handler (value) {
        this.searchByPinyin(value);
      }
    }
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let [, , tId] = key.split('_')
      let tree, title = ''
      for (let i in this.general) {
        this.general[i].isShow = false
        clearInterval(this.timer[i])
      }
      if (type === 0) {
        tree = cloneObj(this.$store.state.checkMsg.tree, true)
        title = cloneObj(this.$store.state.chooseTitle.generalTitle, true)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        tree = this.general[key].tree
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.general, key, {
            title,//总貌图标题
            t_root: tree.t_root, //图标的组织类型
            macList: [],
            searchmac: [],
            downShow: false,
            itemize: this.itemize,
            tree: tree,
            isRequstDown: true,
            isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
            isShow: true,
          })
          if (tree.t_root == 2) {
            let isShowTree = false
            let data = []
            // 判断是否为杭海城际
            let isHanghai = config.gjModel === 1
            console.log(tree.children)
            if (isHanghai && tree.children && tree.children.length > 0) {
              isShowTree = true
              data = tree.children
            }
            this.general[key].isShowTree = isShowTree
            this.general[key].tree = data
            this.general[key].treeData = []
          }
          this.$nextTick(() => {
            if (this.$refs[`general_scroll${this.currentKey}`][0]) {
              this.$refs[`general_scroll${this.currentKey}`][0].addEventListener(
                "scroll",
                this.isShowDropdownIcon
              );
            }
          })
          break
        case 1 /* 切换图表 */:
          this.general[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.general, key)
          break;
        case 4 /* 从其他图表跳转已存在图标 */:
          this.general[key].isShow = true
          break;
      }
      if (type === 0 || type === 1 || type === 4) {
        let requestData
        // if (tree.t_root === 3 || tree.t_root === 0 || tree.t_root === 1) {
        requestData = {
          t_id: tree.t_id,
          t_root: tree.t_root, //mac.baseInfo.ch_class
          needChild: 1
        };
        // } else {
        //   requestData = {
        //     t_id: tree.t_id,
        //     t_root: tree.t_root //mac.baseInfo.ch_class
        //   };
        // }
        for (let i in this.timer) {
          clearInterval(this.timer[i])
        }
        let fn = () => {
          this.getMacData(requestData);
          return fn;
        };
        this.timer[key] = setInterval(fn(), 6000);
      }
    },
    resize () {
      let dom = this.$refs.general_content[0] || this.$refs.general_content
      let width = dom.clientWidth
      if (width === 1640) {
        dom.style = 'grid-column-gap:28px'
      } else if (width === 1850) {
        dom.style = 'grid-column-gap:13px'
      } else if (width === 1179) {
        dom.style = 'grid-column-gap:25px'
      } else if (width === 1326) {
        dom.style = 'grid-column-gap:7px'
      }
      this.$nextTick(this.isShowDropdownIcon);
    },
    // 获取当前组织下的机组
    getMacData (requestData) {
      const param = this.general[this.currentKey]
      // 判断当前页面是否为总貌图页面
      let generalRouter = ['tyGeneral', 'fdGeneral', '', 'gjGeneral', '']
      if (param.isShow && this.$store.state.chooseTitle && generalRouter[Number(requestData.t_root) + 1] == this.$store.state.chooseTitle.name) {
        if (param.isRequstDown) {
          param.isRequstDown = false
          this.$getApi.queryAllMachineByTid(requestData).then(res => {
            param.isRequstDown = true
            if (res) {
              if (param.isDataRight) {
                this.setMacData(res);
                let status;
                param.itemize.forEach(item => {
                  //目前筛选状态
                  if (item.chooseflag == true) {
                    status = item.type;
                  }
                });
                param.searchmac = sortMachine(this.getStatus(status));
                //刷新时查询是否存在内容
                if (this.searchKey != "") {
                  this.searchByPinyin(this.searchKey);
                }
                // 若general_scroll可滚动且未滚到底部
                this.$nextTick(this.isShowDropdownIcon);
              } else if (param.isShow) {
                clearInterval(this.timer[this.currentKey])
                let fn = () => {
                  this.getMacData(requestData)
                  return fn
                }
                this.timer[this.currentKey] = setInterval(fn(), 6000)
                param.isDataRight = true
              }
            }
          });
        }
      } else {
        clearInterval(this.timer[this.currentKey])
      }
    },
    /* 处理请求来的数据 */
    setMacData (res) {
      const param = this.general[this.currentKey]
      param.macList = []
      let focusNum = 0;
      let stutas = config.generalStutas
      if (stutas) {
        param.itemize[1].number = 0
      }
      res.machines.forEach(item => {
        let obj = {};
        obj.chooseflag = false; //是否选中
        // 总貌图状态配置
        if (stutas && item.alarmStatus == 0) {
          item.alarmStatus = 1
        }
        obj.alarmStatus = item.alarmStatus;
        obj.isShow = true; //控制是否显示
        obj.dgm_id = item.dgm_id;
        obj.t_id = item.t_id;
        obj.mac_id = item.mac_id;
        obj.isFocus = item.isFocus ? true : false;
        obj.name = item.mac_me;
        obj.m_me = item.mac_me;
        item.fullTName && (obj.fullTName = item.fullTName);
        if (item.running_status !== undefined) {
          obj.running_status = this.setRunstation(item.running_status);
        }
        if (item.speed !== undefined) {
          obj.speed = item.speed < 100000000 ? round(item.speed, 2) : 0;
        }
        if (item.isFocus === 1) {
          focusNum++;
        }
        switch (item.alarmStatus) {
          case 0://离线
            obj.status = this.$t('Common.offlineText');
            obj.type = 4;
            break;
          case 1://正常
            obj.status = this.$t('Common.normalText');
            obj.type = 1;
            param.itemize[1].number++
            break;
          case 2://预警
            obj.status = this.$t('Common.warnText');
            obj.type = 2;
            break;
          case 3://报警
            obj.status = this.$t('Common.alarmText');
            obj.type = 3;
            break;
        }

        param.macList.push(obj);
      });
      param.macList.sort(this.compareByMacName);
      /* 设置状态的数组 */
      this.setTitleTips(res, focusNum);
    },
    /* 油田的状态 */
    setRunstation (status) {
      let val;
      switch (status) {
        case 0://未接入
          val = this.$t('YtFocus.runStatus1');
          break;
        case 1://运行
          val = this.$t('YtFocus.runStatus2');
          break;
        case 2://停机
          val = this.$t('YtFocus.runStatus3');
          break;
      }
      return val;
    },
    /* 设置标题头的状态 */
    setTitleTips (res, focusNum) {
      let status = config.generalStutas
      const param = this.general[this.currentKey]
      param.itemize.forEach(item => {
        if (item.type === 0) {
          item.number = res.machines.length;
        } else if (item.type === 1) {
          if (!status) {
            item.number = res.normal;
          }
        } else if (item.type === 2) {
          item.number = res.h;
        } else if (item.type === 3) {
          item.number = res.hh;
        } else if (item.type === 4) {
          if (!status) {
            item.number = res.offLine;
          }
        } else if (item.type === 5) {
          item.number = focusNum;
        }
      });
    },
    //点击机组修改border
    choosemac (e) {
      let dom = e.currentTarget;
      let doms = document.getElementsByClassName("view-content");
      for (let i = 0; i < doms.length; i++) {
        doms[i].style.border = "";
      }
      dom.style.border = "1px solid #00fcf9";
    },
    //点击收藏
    collection (item) {
      const param = this.general[this.currentKey]
      let requestData = {
        t_id: item.t_id,
        mac_id: item.mac_id,
        t_root: param.t_root,
        id: item.mac_id,
        isFocus: item.isFocus ? 0 : 1
      };
      console.log(requestData, param)
      this.$getApi.updateHmiFoucsStatus(requestData).then(res => {
        item.isFocus = !item.isFocus;
        if (res) {
          /* 收藏成功 */
          param.itemize.forEach(item1 => {
            if (item1.name === "关注") {
              if (item.isFocus) {
                item1.number++;
              } else {
                item1.number--;
              }
            }
          });
        } else {
          item.isFocus = !item.isFocus;
          this.$pop(this.$t('Common.failTips'));//操作失败
        }
        if (!param.isRequstDown) {
          param.isDataRight = false
        }
      });
    },
    //双击进入mac的model页
    toMacModel (item, toPage) {
      let macArray = this.$store.state.mac[item.t_id];
      let choosemac = this.$store.state.checkMsg.mac;
      let choosetree = cloneObj(this.$store.state.checkMsg.tree);
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.machine_id == item.mac_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = this.$store.state.tree;
            treeArray.forEach(tree => {
              if (choosemac.t_id == tree.t_id) {
                this.$store.commit("getCheckMsg", {
                  msg: cloneObj(tree),
                  type: "tree"
                });
                this.$store.commit("getCheckMsg", {
                  msg: cloneObj(choosemac),
                  type: "mac"
                });
                resolve('成功')
              }
            });
          }
          resolve('成功')
        } else {
          for (let i = 0; i < macArray.length; i++) {
            if (macArray[i].mac_id == item.mac_id) {
              /* 设置当前的机组 */
              if (macArray[i].t_id != choosetree.t_id) {
                let treeArray = this.$store.state.tree;
                treeArray.forEach(tree => {
                  if (macArray[i].t_id == tree.t_id) {
                    this.$store.commit("getCheckMsg", {
                      msg: cloneObj(tree),
                      type: "tree"
                    });
                  }
                });
              }
              this.$store.commit("getCheckMsg", {
                msg: macArray[i],
                type: "mac"
              });
              resolve('成功')
              break;
            }
          }
        }

      }).then(() => {
        this.$bus.$emit(
          'generalRouting',
          toPage,
          '设备模型',
          'icon-shijingsanwei-'
        )
      })
    },
    /* 匹配拼音,匹配到返回true,否则返回flase */
    matchPinyin (matchVal, val) {
      return this.pinyin.match(matchVal, val);
    },
    //排序
    compareByMacName (obj1, obj2) {
      let val1 = obj1.name;
      let val2 = obj2.name;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    },
    turnPage () {
      this.isShowDropdownIcon();
      let dom = this.$refs[`general_scroll${this.currentKey}`][0];
      //可以滚动
      if (dom.scrollTop < dom.scrollHeight) {
        dom.scrollTop = dom.scrollTop + 100;
      }
    },
    //判断当前的下拉图标是否显示
    isShowDropdownIcon () {
      let dom = this.$refs[`general_scroll${this.currentKey}`][0];
      const param = this.general[this.currentKey]
      param.downShow = true;
      if (dom && dom.scrollHeight - dom.scrollTop - dom.clientHeight <= 0) {
        param.downShow = false;
      }
    },
    /* 头部标签根据状态筛选*/
    filterByStatus (title) {
      const param = this.general[this.currentKey]
      /* 根据状态筛选 */
      param.itemize.forEach(i => {
        i.chooseflag = false;
      });
      title.chooseflag = true;
      let status = title.type;
      param.searchmac = sortMachine(this.getStatus(status));
      //刷新时查询是否存在内容
      if (this.searchKey != "") {
        let data = param.searchmac;
        let searchFiled = {
          name: data.name
        };
        param.searchmac.forEach(el => {
          //如果有子组织（暂时不考虑）
          if (!this.matchPinyin(el.name, this.searchKey)) {
            el.isShow = false;
          } else {
            el.isShow = true;
          }
        });
      }
      // 若general_scroll可滚动且未滚到底部
      param.downShow = false;
      this.$nextTick(() => {
        let dom = this.$refs[`general_scroll${this.currentKey}`][0];
        dom.scrollTop = 0;
        if (
          dom.scrollHeight > dom.clientHeight &&
          dom.scrollHeight - dom.scrollTop - dom.clientHeight > 10
        ) {
          param.downShow = true;
        }
      });
    },
    /* 更具头部标签来筛选应该显示的机组 */
    getStatus (status) {
      let filterMacList = [];
      const param = this.general[this.currentKey]
      param.macList.forEach(item => {
        item = cloneObj(item);
        switch (status) {
          case 0:
            filterMacList.push(item);
            break;
          case 1:
            if (item.alarmStatus === 1) {
              filterMacList.push(item);
            }
            break;
          case 2:
            if (item.alarmStatus === 2) {
              filterMacList.push(item);
            }
            break;
          case 3:
            if (item.alarmStatus === 3) {
              filterMacList.push(item);
            }
            break;
          case 4:
            if (item.alarmStatus === 0) {
              filterMacList.push(item);
            }
            break;
          case 5:
            if (item.isFocus) {
              filterMacList.push(item);
            }
            break;
        }
      });
      return filterMacList;
    },
    /* 更具拼音来筛选 */
    searchByPinyin (val) {
      const param = this.general[this.currentKey]
      param.searchmac.forEach(item => {
        if (this.pinyin.match(item.name, val)) {
          item.isShow = true;
        } else {
          item.isShow = false;
        }
      });
    }
  },
  deactivated () {
    // 当不在活跃状态时，清除定时器
    clearInterval(this.timer[this.currentKey]);
  },
};
export default general;
