import AlarmRetrieval from "./AlarmRetrieval.vue";
// import CompareRetrieval from './DataRetrieval.vue';
import DipRetrieval from "./DipRetrieval.vue";
import HistoryRetrieval from "./HistoryRetrieval.vue";
import MonitorRetrieval from "./MonitorRetrieval.vue";
import OverturnRetrieval from "./OverturnRetrieval.vue";
import RealRetrieval from "./RealRetrieval.vue";
import ScatterRetrieval from "./ScatterRetrieval.vue";
import SpectrumRetrieval from "./SpectrumRetrieval.vue";
import SystemRetrieval from "./SystemRetrieval.vue";
import TrendRetrieval from "./TrendRetrieval.vue";
import WaveRetrieval from "./WaveRetrieval.vue";
import Wave3dRetrieval from "./Wave3dRetrieval.vue";
import circleRetrieval from "./circleRetrieval.vue";
import MaintainRetrieval from "./MaintainRetrieval";
import TmsTrendRetrieval from "./TmsTrendRetrieval";
import Tmswave3dRetrieval from "./Tmswave3dRetrieval";
import RailRetrieval from "./railRetrieval";
import PunchCardRetrieval from "./PunchCardRetrieval";
import SingkeBarRetrieval from "./singleBarRetrieval";
import FullSpectrumRetrieval from './FullSpectrumRetrieval';
import StartStopRetrieval from './StartStopRetreval';
import BodeRetrieval from './BodeRetrieval';
import diagnosisTrendRetrieval from './diagnosisTrendRetrieval';

const DataRetrieval = {
  install (Vue, store) {
    Vue.prototype.$retrieval = options => {
      const components = {
        alarm: AlarmRetrieval,
        dip: DipRetrieval,
        history: HistoryRetrieval,
        monitor: MonitorRetrieval,
        overturn: OverturnRetrieval,
        real: RealRetrieval,
        scatter: ScatterRetrieval,
        spectrum: SpectrumRetrieval,
        system: SystemRetrieval,/* 踏面磨损趋势图、级联图,单面动平衡，双面动平衡，转速时间图，奈奎斯特图数据检索使用系统日志的 */
        trend: TrendRetrieval,
        wave: WaveRetrieval,
        wave3d: Wave3dRetrieval,
        circle: circleRetrieval,/* 对比分析图、圆周图 */
        maintain: MaintainRetrieval,
        tmsTrend: TmsTrendRetrieval,
        tmswave3d: Tmswave3dRetrieval,
        rail: RailRetrieval,
        punchCard: PunchCardRetrieval,
        singleBar: SingkeBarRetrieval,//单值棒图，多值棒图
        fullSpectrum: FullSpectrumRetrieval,//全频谱图，多频谱图，专家系统 轴心位置图 极坐标图
        startStop: StartStopRetrieval,//启停机数据列表
        bode: BodeRetrieval,//伯德图
        diagnosisTrend: diagnosisTrendRetrieval,//智能诊断趋势
      };
      let key = options.key || options; //如果是对象，取里面的key，如果是字符串，取自己的值
      let msg;
      components[key].store = store;
      const testInstance = Vue.extend(components[key]);
      const init = () => {
        msg = new testInstance();
        const dom = msg.$mount().$el;
        document.getElementById("app").appendChild(dom);
      };
      init();
      if (Object.prototype.toString.call(options).slice(8, -1) === "Object") {
        Object.assign(msg, options);
        msg.initParams(options.params); //传过来的数据直接当参数，进入初始化方法
      }
      return msg.openRetrieval(); //返回一个Promise
    };
  }
};

export default DataRetrieval;
