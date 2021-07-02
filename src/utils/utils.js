import { $t } from '../common/i18n';
import i18n from '../common/i18n';

function trans (args) {
  if (localStorage.getItem('language')) {
    if (i18n.locale != localStorage.getItem('language')) {
      i18n.locale = localStorage.getItem('language')
    }
  }
  return $t(args)
}
const codeObj = {
  /* 测点类型对应特征值 */
  1: [
    /* 转速 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    {
      filed: "speed_value",
      name: trans('eigenvalue.posSpeed'),
      code: 16000
    } /* 转速测点转速值 */,
    { filed: "speed_dc", name: trans('eigenvalue.SpeedDC'), code: 28000 } /* 转速直流量 */
  ],
  2: [
    /* 过程量 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 } /* 过程量值 */
  ],
  3: [
    /* 振动 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
    { filed: "vib_p", name: trans('eigenvalue.overturn_p'), code: 3000 } /* 振动峰值 */,
    { filed: "vib_pp", name: trans('eigenvalue.ppValue'), code: 4000 } /* 振动峰峰值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    {
      filed: "vib_pf",
      name: trans('eigenvalue.crestFactor'),
      code: 15000
    } /* 峰值因数=振动峰值/振动有效值 */,
    { filed: "gap", name: trans('eigenvalue.offsetVoltage'), code: 14000 } /* 偏置电压 */,
    { filed: "vib_k", name: trans('eigenvalue.Kurtosis'), code: 24000 } /* 峭度 */,
    { filed: "vib_cf", name: trans('eigenvalue.margin'), code: 25000 } /* 裕度 */,
    { filed: "vib_sf", name: trans('eigenvalue.skewness'), code: 26000 } /* 歪度 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "vib_rms1", name: trans('eigenvalue.onexamplitude'), code: 53000 } /* 1x幅值 */,
    { filed: "vib_rms2", name: trans('eigenvalue.onexphase'), code: 54000 } /* 1x相位 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 },
    { filed: "temperature", name: trans('eigenvalue.temperature'), code: 57000 },
    { filed: "temperature_rise", name: trans('eigenvalue.temperatureRise'), code: 57001 }
  ],
  4: [
    /* 包络 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络解调值 */,
    { filed: "spm_pp", name: trans('eigenvalue.EnvelopeEigenvalues'), code: 6000 } /* 包络特征值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "temperature", name: trans('eigenvalue.temperature'), code: 57000 },
    { filed: "temperature_rise", name: trans('eigenvalue.temperatureRise'), code: 57001 },
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "sv0", name: trans('eigenvalue.onexamplitude'), code: 55000 } /* 1x幅值 */,
    { filed: "sv1", name: trans('eigenvalue.onexphase'), code: 56000 } /* 1x相位 */,
    { filed: "sv0", name: trans('eigenvalue.ExternalRingOfCage'), code: 52001 } /* 保持架对外环频率 */,
    { filed: "sv1", name: trans('eigenvalue.cageToInnerRing'), code: 52002 } /* 保持架对内环频率 */,
    { filed: "sv2", name: trans('eigenvalue.OuterRingInnerRaceway'), code: 52003 } /* 外环内滚道频率 */,
    { filed: "sv3", name: trans('eigenvalue.InnerRingOuterRaceway'), code: 52004 } /* 内环外滚道频率 */,
    { filed: "sv4", name: trans('eigenvalue.RollRder'), code: 52005 } /* 滚单频率 */,
    { filed: "sv5", name: trans('eigenvalue.RollDouble'), code: 52006 } /* 滚双频率 */,
    { filed: "sv6", name: trans('eigenvalue.Tread'), code: 52007 } /* 踏面频率 */,
    { filed: "sv7", name: trans('eigenvalue.AdjacentShaftGear'), code: 52008 } /* 邻轴齿轮频率 */,
    { filed: "sv8", name: trans('eigenvalue.MainShaftGear'), code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv10", name: "2-"+trans('eigenvalue.ExternalRingOfCage'), code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv11", name: "2-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv12", name: "2-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv13", name: "2-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv14", name: "2-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv15", name: "2-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv16", name: "2-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv17", name: "2-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv18", name: "2-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv20", name: "3-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv21", name: "3-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv22", name: "3-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv23", name: "3-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv24", name: "3-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv25", name: "3-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv26", name: "3-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv27", name: "3-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv28", name: "3-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv30", name: "4-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv31", name: "4-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv32", name: "4-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv33", name: "4-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv34", name: "4-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv35", name: "4-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv36", name: "4-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv37", name: "4-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv38", name: "4-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv40", name: "5-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv41", name: "5-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv42", name: "5-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv43", name: "5-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv44", name: "5-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv45", name: "5-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv46", name: "5-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv47", name: "5-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv48", name: "5-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv50", name: "6-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv51", name: "6-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv52", name: "6-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv53", name: "6-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv54", name: "6-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv55", name: "6-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv56", name: "6-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv57", name: "6-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv58", name: "6-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv60", name: "7-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv61", name: "7-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv62", name: "7-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv63", name: "7-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv64", name: "7-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv65", name: "7-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv66", name: "7-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv67", name: "7-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 5 2008 } /* 邻轴齿轮频率 */,
    // { filed: "sv68", name: "7-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv70", name: "8-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv71", name: "8-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv72", name: "8-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv73", name: "8-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv74", name: "8-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv75", name: "8-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv76", name: "8-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv77", name: "8-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv78", name: "8-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv80", name: "9-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv81", name: "9-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv82", name: "9-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv83", name: "9-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv84", name: "9-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv85", name: "9-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv86", name: "9-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv87", name: "9-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv88", name: "9-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "sv90", name: "10-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv91", name: "10-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv92", name: "10-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv93", name: "10-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv94", name: "10-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv95", name: "10-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv96", name: "10-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv97", name: "10-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv98", name: "10-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 }
  ],
  5: [
    /* 数字量 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "digital_value", name: trans('eigenvalue.DigitalValue'), code: 7000 } /* 数字量值 */
  ],
  6: [
    /* 晃度 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "rock_rms", name: trans('eigenvalue.EffectiveValue'), code: 9000 } /* 晃度有效值 */,
    { filed: "rock_p", name: trans('eigenvalue.EffectiveValue'), code: 10000 } /* 晃度峰值 */,
    { filed: "rock_pp", name: trans('eigenvalue.ppValue'), code: 11000 } /* 晃度峰峰值 */,
    { filed: "rock_s", name: trans('eigenvalue.overturn_s'), code: 29000 } /* 晃度位移 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 }
  ],
  7: [
    /* 温度 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "value", name: trans('eigenvalue.temperatureValue'), code: 23000 } /* 温度值 */
  ],
  8: [
    /* 振动阶次 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
    { filed: "vib_p", name: trans('eigenvalue.EffectiveValue'), code: 3000 } /* 振动峰值 */,
    { filed: "vib_pp", name: trans('eigenvalue.ppValue'), code: 4000 } /* 振动峰峰值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    {
      filed: "vib_pf",
      name: trans('eigenvalue.EnergyEffecValue'),
      code: 15000
    } /* 峰值因数=振动峰值/振动有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "vib_k", name: trans('eigenvalue.Kurtosis'), code: 24000 } /* 峭度 */,
    { filed: "vib_cf", name: trans('eigenvalue.margin'), code: 25000 } /* 裕度 */,
    { filed: "vib_sf", name: trans('eigenvalue.margin'), code: 26000 } /* 歪度 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "temperature", name: trans('eigenvalue.temperature'), code: 57000 },
    { filed: "temperature_rise", name: trans('eigenvalue.temperatureRise'), code: 57001 },
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 }
  ],
  9: [
    /* 包络阶次 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络有效值 */,
    { filed: "spm_pp", name: trans('eigenvalue.EnvelopeEigenvalues'), code: 6000 } /* 包络峰峰值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "temperature", name: trans('eigenvalue.temperature'), code: 57000 },
    { filed: "temperature_rise", name: trans('eigenvalue.temperatureRise'), code: 57001 },
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 },
    // { filed: "part_name0", name: "部件1", code: -1 },/* 部件1 */
    { filed: "sv0", name: trans('eigenvalue.ExternalRingOfCage'), code: 52001 } /* 保持架对外环频率 */,
    { filed: "sv1", name: trans('eigenvalue.cageToInnerRing'), code: 52002 } /* 保持架对内环频率 */,
    { filed: "sv2", name: trans('eigenvalue.OuterRingInnerRaceway'), code: 52003 } /* 外环内滚道频率 */,
    { filed: "sv3", name: trans('eigenvalue.InnerRingOuterRaceway'), code: 52004 } /* 内环外滚道频率 */,
    { filed: "sv4", name: trans('eigenvalue.RollRder'), code: 52005 } /* 滚单频率 */,
    { filed: "sv5", name: trans('eigenvalue.RollDouble'), code: 52006 } /* 滚双频率 */,
    { filed: "sv6", name: trans('eigenvalue.Tread'), code: 52007 } /* 踏面频率 */,
    { filed: "sv7", name: trans('eigenvalue.AdjacentShaftGear'), code: 52008 } /* 邻轴齿轮频率 */,
    { filed: "sv8", name: trans('eigenvalue.MainShaftGear'), code: 52009 } /* 本轴齿轮频率 */
    // { filed: "part_name1", name: "部件2", code: -1 },/* 部件2 */
    // { filed: "sv10", name: "2-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv11", name: "2-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv12", name: "2-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv13", name: "2-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv14", name: "2-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv15", name: "2-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv16", name: "2-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv17", name: "2-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv18", name: "2-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name2", name: "部件3", code: -1 },/* 部件3 */
    // { filed: "sv20", name: "3-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv21", name: "3-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv22", name: "3-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv23", name: "3-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv24", name: "3-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv25", name: "3-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv26", name: "3-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv27", name: "3-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv28", name: "3-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name3", name: "部件4", code: -1 },/* 部件4 */
    // { filed: "sv30", name: "4-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv31", name: "4-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv32", name: "4-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv33", name: "4-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv34", name: "4-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv35", name: "4-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv36", name: "4-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv37", name: "4-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv38", name: "4-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name4", name: "部件5", code: -1 },/* 部件5 */
    // { filed: "sv40", name: "5-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv41", name: "5-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv42", name: "5-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv43", name: "5-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv44", name: "5-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv45", name: "5-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv46", name: "5-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv47", name: "5-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv48", name: "5-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name5", name: "部件6", code: -1 },/* 部件6 */
    // { filed: "sv50", name: "6-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv51", name: "6-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv52", name: "6-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv53", name: "6-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv54", name: "6-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv55", name: "6-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv56", name: "6-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv57", name: "6-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv58", name: "6-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name6", name: "部件7", code: -1 },/* 部件7 */
    // { filed: "sv60", name: "7-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv61", name: "7-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv62", name: "7-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv63", name: "7-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv64", name: "7-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv65", name: "7-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv66", name: "7-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv67", name: "7-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv68", name: "7-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name7", name: "部件8", code: -1 },/* 部件8 */
    // { filed: "sv70", name: "8-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv71", name: "8-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv72", name: "8-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv73", name: "8-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv74", name: "8-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv75", name: "8-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv76", name: "8-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv77", name: "8-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv78", name: "8-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name8", name: "部件9", code: -1 },/* 部件9 */
    // { filed: "sv80", name: "9-保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv81", name: "9-保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv82", name: "9-"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv83", name: "9-"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv84", name: "9-"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv85", name: "9-"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv86", name: "9-"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv87", name: "9-"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv88", name: "9-"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
    // { filed: "part_name9", name: "部件10", code: -1 },/* 部件10 */
    // { filed: "sv90", name: "10保持架对外环", code: 52001 } /* 保持架对外环频率 */,
    // { filed: "sv91", name: "10保持架对内环", code: 52002 } /* 保持架对内环频率 */,
    // { filed: "sv92", name: "10"+trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道 code: 52003 } /* 外环内滚道频率 */,
    // { filed: "sv93", name: "10"+trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道 code: 52004 } /* 内环外滚道频率 */,
    // { filed: "sv94", name: "10"+trans('eigenvalue.RollRder'),//滚单 code: 52005 } /* 滚单频率 */,
    // { filed: "sv95", name: "10"+trans('eigenvalue.RollDouble'),//滚双 code: 52006 } /* 滚双频率 */,
    // { filed: "sv96", name: "10"+trans('eigenvalue.Tread'),//踏面 code: 52007 } /* 踏面频率 */,
    // { filed: "sv97", name: "10"+trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮 code: 52008 } /* 邻轴齿轮频率 */,
    // { filed: "sv98", name: "10"+trans('eigenvalue.MainShaftGear'),//本轴齿轮 code: 52009 } /* 本轴齿轮频率 */,
  ],
  10: [
    /* 工艺量 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "value", name: trans('eigenvalue.ProcessQuantity'), code: 27000 } /* 工艺量 */
  ],
  11: [
    /* 倾覆 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },//时间
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "overturn_rms", name: trans('eigenvalue.EffectiveValue'), code: 20000 } /* 倾覆值 */,
    { filed: "overturn_p", name: trans('eigenvalue.EffectiveValue'), code: 30000 } /* 倾覆峰值 */,
    { filed: "overturn_pp", name: trans('eigenvalue.ppValue'), code: 31000 } /* 倾覆峰峰值 */,
    { filed: "overturn_s", name: trans('eigenvalue.overturn_s'), code: 32000 } /* 倾覆位移值 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 }
  ],
  12: [
    /* 倾角 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "rock_rms", name: trans('eigenvalue.EffectiveValue'), code: 33000 } /* 倾角有效值 */,
    { filed: "rock_p", name: trans('eigenvalue.EffectiveValue'), code: 34000 } /* 倾角峰值 */,
    { filed: "rock_pp", name: trans('eigenvalue.ppValue'), code: 35000 } /* 倾角峰峰值 */,
    { filed: "rock_avg", name: trans('eigenvalue.average'), code: 36000 } /* 倾角平均值 */,
    { filed: "rock_s", name: trans('eigenvalue.overturn_s'), code: 47000 } /* 倾角位移值 */,
    { filed: "temperature", name: trans('eigenvalue.temperatureValue'), code: 51000 } /* 温度值 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 }
  ],
  13: [
    /* 合成倾角 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "overturn_rms", name: trans('eigenvalue.EffectiveValue'), code: 37000 } /* 合成倾角有效值 */,
    { filed: "overturn_p", name: trans('eigenvalue.EffectiveValue'), code: 38000 } /* 合成倾角峰值 */,
    { filed: "overturn_pp", name: trans('eigenvalue.ppValue'), code: 39000 } /* 合成倾角峰峰值 */,
    {
      filed: "rock_avg",
      name: [trans('eigenvalue.average'), trans('eigenvalue.SettlementAngle')],
      code: 40000
    } /* 合成倾角平均值/沉降角度 */,
    { filed: "rock_pp", name: trans('eigenvalue.rock_pp'), code: 43000 } /* （合成）沉降量 */,
    {
      filed: "rock_rms",
      name: trans('eigenvalue.rock_rms'),
      code: 41000
    } /* （合成）平均值相位 */,
    { filed: "rock_p", name: trans('eigenvalue.rock_p'), code: 42000 } /* （合成）峰值相位 */,
    { filed: "overturn_s", name: trans('eigenvalue.overturn_s'), code: 48000 } /* （合成）倾角位移值 */,
    { filed: "temperature", name: trans('eigenvalue.temperatureValue'), code: 51000 } /* 温度值 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 }
  ],
  14: [
    /* 螺栓 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed_value", name: trans('eigenvalue.PreloadValue'), code: 44000 } /* 预紧力值 */,
    { filed: "speed_dc", name: trans('eigenvalue.temperatureValue'), code: 45000 } /* 温度值 */
  ],
  15: [
    /* 冲击 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络解调值 */,
    { filed: "spm_pp", name: trans('eigenvalue.EnvelopeEigenvalues'), code: 6000 } /* 包络特征值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "sv0", name: trans('eigenvalue.onexamplitude'), code: 55000 } /* 1x幅值 */,
    { filed: "sv1", name: trans('eigenvalue.onexphase'), code: 56000 } /* 1x相位 */,
    { filed: "sv0", name: trans('eigenvalue.ExternalRingOfCage'), code: 52001 } /* 保持架对外环频率 */,
    { filed: "sv1", name: trans('eigenvalue.cageToInnerRing'), code: 52002 } /* 保持架对内环频率 */,
    { filed: "sv2", name: trans('eigenvalue.OuterRingInnerRaceway'), code: 52003 } /* 外环内滚道频率 */,
    { filed: "sv3", name: trans('eigenvalue.InnerRingOuterRaceway'), code: 52004 } /* 内环外滚道频率 */,
    { filed: "sv4", name: trans('eigenvalue.RollRder'), code: 52005 } /* 滚单频率 */,
    { filed: "sv5", name: trans('eigenvalue.RollDouble'), code: 52006 } /* 滚双频率 */,
    { filed: "sv6", name: trans('eigenvalue.Tread'), code: 52007 } /* 踏面频率 */,
    { filed: "sv7", name: trans('eigenvalue.AdjacentShaftGear'), code: 52008 } /* 邻轴齿轮频率 */,
    { filed: "sv8", name: trans('eigenvalue.MainShaftGear'), code: 52009 } /* 本轴齿轮频率 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 }
  ],
  16: [
    /* 冲击阶次 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络有效值 */,
    { filed: "spm_pp", name: trans('eigenvalue.EnvelopeEigenvalues'), code: 6000 } /* 包络峰峰值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 },
    { filed: "sv0", name: trans('eigenvalue.ExternalRingOfCage'), code: 52001 } /* 保持架对外环频率 */,
    { filed: "sv1", name: trans('eigenvalue.cageToInnerRing'), code: 52002 } /* 保持架对内环频率 */,
    { filed: "sv2", name: trans('eigenvalue.OuterRingInnerRaceway'), code: 52003 } /* 外环内滚道频率 */,
    { filed: "sv3", name: trans('eigenvalue.InnerRingOuterRaceway'), code: 52004 } /* 内环外滚道频率 */,
    { filed: "sv4", name: trans('eigenvalue.RollRder'), code: 52005 } /* 滚单频率 */,
    { filed: "sv5", name: trans('eigenvalue.RollDouble'), code: 52006 } /* 滚双频率 */,
    { filed: "sv6", name: trans('eigenvalue.Tread'), code: 52007 } /* /踏面频率 */,
    { filed: "sv7", name: trans('eigenvalue.AdjacentShaftGear'), code: 52008 } /* 邻轴齿轮频率 */,
    { filed: "sv8", name: trans('eigenvalue.MainShaftGear'), code: 52009 } /* 本轴齿轮频率 */
  ],
  17: [
    /* 轨道波磨 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
    { filed: "vib_p", name: trans('eigenvalue.EffectiveValue'), code: 3000 } /* 振动峰值 */,
    { filed: "vib_pp", name: trans('eigenvalue.ppValue'), code: 4000 } /* 振动峰峰值 */,
    {
      filed: "vib_pf",
      name: trans('eigenvalue.EnergyEffecValue'),
      code: 15000
    } /* 峰值因数=振动峰值/振动有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "vib_k", name: trans('eigenvalue.Kurtosis'), code: 24000 } /* 峭度 */,
    { filed: "vib_cf", name: trans('eigenvalue.margin'), code: 25000 } /* 裕度 */,
    { filed: "vib_sf", name: trans('eigenvalue.margin'), code: 26000 } /* 歪度 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    {
      filed: "from_sta",
      name: trans('eigenvalue.LastStationName'),//上一站名称
      code: 57002,
      check: false
    },
    { filed: "to_sta", name: trans('eigenvalue.nextStationName'), code: 57003, check: false },//下一站名称
    {
      filed: "from_distance",
      name: trans('eigenvalue.lastStaDistance'),//上一站距离
      code: 57004,
      check: false
    },
    {
      filed: "to_distance",
      name: trans('eigenvalue.nestStaDistance'),//下一站距离
      code: 57005,
      check: false
    }
  ],
  200: [
    /* 长采样 目前完全与振动一致 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 } /* 转速（振动和包络字段） */,
    { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
    { filed: "vib_p", name: trans('eigenvalue.EffectiveValue'), code: 3000 } /* 振动峰值 */,
    { filed: "vib_pp", name: trans('eigenvalue.ppValue'), code: 4000 } /* 振动峰峰值 */,
    { filed: "pow_rms", name: trans('eigenvalue.EnergyEffecValue'), code: 19000 } /* 能量有效值 */,
    {
      filed: "vib_pf",
      name: trans('eigenvalue.EnergyEffecValue'),
      code: 15000
    } /* 峰值因数=振动峰值/振动有效值 */,
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 } /* 偏置电压 */,
    { filed: "vib_k", name: trans('eigenvalue.Kurtosis'), code: 24000 } /* 峭度 */,
    { filed: "vib_cf", name: trans('eigenvalue.margin'), code: 25000 } /* 裕度 */,
    { filed: "vib_sf", name: trans('eigenvalue.margin'), code: 26000 } /* 歪度 */,
    { filed: "sv", name: trans('eigenvalue.SVvalue'), code: 46000 } /* 冲击值 */,
    { filed: "vib_rms1", name: trans('eigenvalue.onexamplitude'), code: 53000 } /* 1x幅值 */,
    { filed: "vib_rms2", name: trans('eigenvalue.onexphase'), code: 54000 } /* 1x相位 */,
    {
      filed: "vib_vsx1",
      name: trans('eigenvalue.frequencyRange') + "1-1",
      code: 12001
    } /* 可选频段频谱幅值可选频段n */,
    {
      filed: "vib_vsx1_scale",
      name: trans('eigenvalue.frequencyRange') + "1-2",
      code: 13001
    } /* 可选频段频谱幅值最大值与频谱幅值的比值可选频段n */,
    { filed: "vib_vsx2", name: trans('eigenvalue.frequencyRange') + "2-1", code: 12002 },
    { filed: "vib_vsx2_scale", name: trans('eigenvalue.frequencyRange') + "2-2", code: 13002 },
    { filed: "vib_vsx3", name: trans('eigenvalue.frequencyRange') + "3-1", code: 12003 },
    { filed: "vib_vsx3_scale", name: trans('eigenvalue.frequencyRange') + "3-2", code: 13003 },
    { filed: "vib_vsx4", name: trans('eigenvalue.frequencyRange') + "4-1", code: 12004 },
    { filed: "vib_vsx4_scale", name: trans('eigenvalue.frequencyRange') + "4-2", code: 13004 },
    { filed: "vib_vsx5", name: trans('eigenvalue.frequencyRange') + "5-1", code: 12005 },
    { filed: "vib_vsx5_scale", name: trans('eigenvalue.frequencyRange') + "5-2", code: 13005 },
    { filed: "vib_vsx6", name: trans('eigenvalue.frequencyRange') + "6-1", code: 12006 },
    { filed: "vib_vsx6_scale", name: trans('eigenvalue.frequencyRange') + "6-2", code: 13006 },
    { filed: "vib_vsx7", name: trans('eigenvalue.frequencyRange') + "7-1", code: 12007 },
    { filed: "vib_vsx7_scale", name: trans('eigenvalue.frequencyRange') + "7-2", code: 13007 },
    { filed: "vib_vsx8", name: trans('eigenvalue.frequencyRange') + "8-1", code: 12008 },
    { filed: "vib_vsx8_scale", name: trans('eigenvalue.frequencyRange') + "8-2", code: 13008 }
  ],
  99: [
    /* 故障信息 */
    { filed: "proVal", name: trans('eigenvalue.faultMessage'), code: 999 },//故障信息
  ],
  // 智子测点
  201: [
    { filed: 'saveTime_Com', name: trans('Common.time'), code: 0, check: true },
    { filed: 'value', name: trans('eigenvalue.WiseValue'), code: 58000, check: true }, /* 智子值  智子值用来做故障预测 */
  ]
};
// dgmtype为10时取codeObj1
const codeObj1 = {
  2: [
    /* 过程量 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 } /* 过程量值 */
  ],
  3: [
    /* 振动 */
    { filed: "saveTime_Com", name: trans('eigenvalue.time'), code: 0 },
    { filed: "vib_rms", name: trans('eigenvalue.accelerationValue'), code: 57006 } /* 加速度有效值 */,
    { filed: "vib_rms1", name: trans('eigenvalue.speedValue'), code: 57007 } /* 速度有效值 */,
    { filed: "vib_rms2", name: trans('eigenvalue.displacementValue'), code: 57008 } /* 位移有效值 */,
    { filed: "vib_k", name: trans('eigenvalue.Kurtosis'), code: 57009 } /* 峭度 */,
    { filed: "sv", name: trans('eigenvalue.envelope'), code: 57010 } /* 包络 */
  ],
  // 智子测点
  201: [
    { filed: 'saveTime_Com', name: trans('eigenvalue.time'), code: 0, check: true },
    { filed: 'value', name: trans('eigenvalue.WiseValue'), code: 58000, check: true }, /* 智子值用来做故障预测 */
  ]
};
// dgmType = 11,DS8000
const codeObj2 = {
  2: [
    //过程量
    { filed: "time", name: trans('eigenvalue.time'), code: 0 },
    { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 }
  ],
  3: [
    //振动
    { filed: "time", name: trans('eigenvalue.time'), code: 0 },
    { filed: "rms", name: trans('eigenvalue.EffectiveValue'), code: 57011 },
    { filed: "speed", name: trans('eigenvalue.speed'), code: 1000 },
    { filed: "rv", name: trans('eigenvalue.rv'), code: 57012 },
    { filed: "average", name: trans('eigenvalue.vibChMeanValue'), code: 57013 },
    { filed: "direc", name: trans('eigenvalue.direc'), code: 57014 },//通频值
    { filed: "gap", name: trans('eigenvalue.EnergyEffecValue'), code: 14000 },
    { filed: "vbmax", name: trans('eigenvalue.MaxVectorSpectrum'), code: 57014 },//矢量谱最大值
    { filed: "p1x", name: trans('eigenvalue.onexphase'), code: 57015 },
    { filed: "p2x", name: trans('eigenvalue.twoxphase'), code: 57016 },//2x相位
    { filed: "v1x", name: trans('eigenvalue.onexamplitude'), code: 57017 },
    { filed: "v2x", name: trans('eigenvalue.twoxamplitude'), code: 57018 },//2x幅值
    { filed: "v3x", name: trans('eigenvalue.halfxamplitude'), code: 57019 },//0.5x幅值
    { filed: "vsx1", name: trans('eigenvalue.option1amplitude'), code: 57020 },//可选频段1幅值
    { filed: "vsx2", name: trans('eigenvalue.option2amplitude'), code: 57021 },//可选频段2幅值
    { filed: "opt_freq_hi_1", name: trans('eigenvalue.opt_freq_hi_1'), code: 57022 },//可选频段高1
    { filed: "opt_freq_hi_2", name: trans('eigenvalue.opt_freq_hi_2'), code: 57023 },//可选频段高2
    { filed: "opt_freq_low_1", name: trans('eigenvalue.opt_freq_l_1'), code: 57024 },//可选频段低1
    { filed: "opt_freq_low_2", name: trans('eigenvalue.opt_freq_l_2'), code: 57025 }//可选频段低2
  ],
  10: [
    /* 工艺量 */
    { filed: "time", name: trans('eigenvalue.time'), code: 0 },
    { filed: "value", name: trans('eigenvalue.ProcessQuantity'), code: 27000 } /* 工艺量 */
  ],
  19: [
    // 键相
  ],
  // 智子测点
  201: [
    { filed: 'saveTime_Com', name: trans('eigenvalue.time'), code: 0, check: true },
    { filed: 'value', name: trans('eigenvalue.WiseValue'), code: 58000, check: true }, /* 智子值用来做故障预测 */
  ]
};
// 获取code对象
export function getCodeObj (dgmType, tRoot = 255) {
  switch (Number(dgmType)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return codeObj;
    case 10: // WL9100时取codeObj2
      return codeObj1;
    case 11:
      return codeObj2;
    default:
      return codeObj;
  }
}

/* 实时数据、历史数据设置特征值表头
  tRoot      Number     组织类型
  dgmType    Number     采集器类型
  pType      Number     测点类型
  posLog     Number     测点安装位置
  type       Boolean    是否需要全部特征值
 */
function setHead (tRoot, dgmType, pType, posLoc = 1, type = false) {
  const head = [];
  const codeObj = getCodeObj(dgmType);
  let eigenvalue = codeObj[pType];
  dgmType = Number(dgmType);
  pType = Number(pType);
  posLoc = Number(posLoc);
  if (eigenvalue && eigenvalue.length > 0) {
    for (let i = 0, l = eigenvalue.length; i < l; i++) {
      const value = eigenvalue[i];
      if (dgmType != 11) {
        // 52001-52009在TMS的包络、包络阶次，冲击，冲击阶次时使用；t_root == 2
        if (
          tRoot !== 2 &&
          tRoot !== null &&
          (value.code === 46000 ||
            (value.code >= 52001 && value.code <= 52009) ||
            value.code == -1)
        ) {
          continue;
        }
        if (tRoot != 2 && (value.code == 57000 || value.code == 57001)) {
          continue;
        }
        //dgmType为1时（TMS）1x幅值，1x相位存在
        if (dgmType != 1) {
          if (pType == 3 || pType == 200) {
            if (value.code == 53000 || value.code == 54000) {
              continue;
            }
          }
          if (pType == 4 || pType == 15) {
            if (value.code == 55000 || value.code == 56000) {
              continue;
            }
          }
        }
        const filed = value.filed;
        const code = value.code;
        let isShow = filed.indexOf("vib_vsx") === -1;
        // 52001-52009默认不勾选
        if (
          tRoot == 2 &&
          tRoot !== null &&
          ((value.code >= 52001 && value.code <= 52009) || value.code == -1)
        ) {
          isShow = false;
        }
        if (dgmType == 1) {
          if (pType == 3 && (value.code === 25000 || value.code === 26000)) {
            isShow = false;
          }
          if (
            pType == 4 &&
            (value.code === 52001 ||
              value.code === 52002 ||
              value.code === 14000 ||
              value.code === 6000)
          ) {
            //增加判断采集器类型為1時，pType=4下的svg0，svg1为55000、56000
            // 2000v1的包络测点无偏置电压、包络特征值
            continue;
          }
          if (pType == 3 && value.code === 24000) {
            // 2000V1（dgmType == 1）振动测点无峭度
            continue;
          }
          if (
            pType == 11 &&
            value.code != 0 &&
            value.code != 1000 &&
            value.code != 20000
          ) {
            /* 2000v1采集器倾覆测点只存在转速有效值 */
            continue;
          }
        } else if (dgmType == 4 && !isShow) {
          continue;
        } else if (dgmType !== 1) {
          //判断采集器类型不為1時，pType=4下的svg0，svg1為52001、52002
          if (pType == 4 && (value.code === 55000 || value.code === 56000)) {
            continue;
          }
        }
        if (value.name == trans('eigenvalue.EnergyEffecValue')) {
          isShow = false;
        }
        let name = value.name;
        // 增加沉降测点（基础沉降）的单独处理:平均值应改为：沉降角度，位移应改为：沉降量。
        /* 若posLoc == "2" ? "沉降测点" : "倾角测点" */
        if (Number(pType) == 13) {
          if (!type) {
            if (posLoc === 2) {
              if (code === 48000) continue;
              else if (code === 40000) name = name[1];
            } else if (posLoc !== 2) {
              if (code === 43000) continue;
              else if (code === 40000) name = name[0];
            }
          } else if (code === 40000) {
            head.push({
              isShow,
              val: `${name[0]}/${name[1]}`,
              filed: filed,
              code: code
            });
          }
        }
        head.push({
          isShow,
          val: name,
          filed: filed,
          code: code
        });
      } else {
        const filed = value.filed;
        const code = value.code;
        let isShow =
          filed.indexOf("opt_freq") === -1 && filed.indexOf("vsx") === -1;
        let name = value.name;
        head.push({
          isShow,
          val: name,
          filed: filed,
          code: code
        });
      }
    }
  }
  // 若风电、水泥、TMS时pType为5时增加数字量类型
  if (Number(pType) === 5 && dgmType != 11 && dgmType != 10) {
    head.push({
      isShow: true,
      val: trans('eigenvalue.digitalquantitiesTypes'),//数字量类型
      filed: "type",
      code: 18000
    });
  }
  return head;
}
const defaultCode = {
  /* 趋势图默认code */
  1: {
    filed: "speed_value",
    name: trans('eigenvalue.posSpeed'),//测点转速值
    code: 16000
  } /* 转速测点转速值 */,
  2: { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 } /* 过程量值 */,
  3: { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
  4: { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络解调值 */,
  5: { filed: "digital_value", name: trans('eigenvalue.DigitalValue'), code: 7000 } /* 数字量值 */,
  6: { filed: "rock_rms", name: trans('eigenvalue.EffectiveValue'), code: 9000 } /* 晃度有效值 */,
  7: { filed: "value", name: trans('eigenvalue.temperatureValue'), code: 23000 } /* 温度值 */,
  8: { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 振动有效值 */,
  9: { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络有效值 */,
  10: { filed: "value", name: trans('eigenvalue.ProcessQuantity'), code: 27000 } /* 工艺量 */,
  11: { filed: "overturn_rms", name: trans('eigenvalue.EffectiveValue'), code: 20000 } /* 倾覆值 */,
  12: { filed: "rock_rms", name: trans('eigenvalue.EffectiveValue'), code: 33000 } /* 倾角有效值 */,
  13: {
    filed: "overturn_rms", name: trans('eigenvalue.EffectiveValue'), code: 37000
  } /* 合成倾角有效值 */,
  14: { filed: "speed_value", name: trans('eigenvalue.PreloadValue'), code: 44000 } /* 预紧力值 */,
  15: { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 冲击测点 */,
  16: { filed: "spm_rms", name: trans('eigenvalue.envelopeDemodulationValue'), code: 5000 } /* 包络有效值 */,
  17: { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 轨道波磨测点 */,
  200: { filed: "vib_rms", name: trans('eigenvalue.EffectiveValue'), code: 2000 } /* 长采样有效值 */,
  99: {
    filed: "proVal",
    name: trans('eigenvalue.faultMessage'),
    code: 999
  } /* 转速测点转速值 */,
  201: { filed: 'value', name: trans('eigenvalue.WiseValue'), code: 58000, check: true }
};
const defaultCode_1 = {
  /* WL9100默认code */
  2: { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 } /* 过程量值 */,
  3: { filed: "vib_rms", name: trans('eigenvalue.accelerationValue'), code: 57006 } /* 振动有效值 */
};
// 8000
const defaultCode_2 = {
  2: { filed: "value", name: trans('eigenvalue.ProcessValue'), code: 8000 },
  3: { filed: "direc", name: trans('eigenvalue.direc'), code: 57014 } /* 振动通频值 */,
  10: { filed: "value", name: trans('eigenvalue.ProcessQuantity'), code: 27000 } /* 工艺量 */,
  19: {}
};
export function getdefaultCode (dgmType) {
  switch (Number(dgmType)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return defaultCode;
    case 10: // WL9100时取
      return defaultCode_1;
    case 11:
      return defaultCode_2;
    default:
      return defaultCode;
  }
}

/* 实时汇总列表传给后台的值 */
const defaultCode1 = {
  1: "speed_value",
  2: "value",
  3: "vib_rms",
  4: "spm_rms",
  5: "digital_value",
  6: "rock_rms",
  7: "value",
  8: "vib_rms",
  9: "spm_rms",
  10: "value",
  11: "overturn_rms",
  12: "rock_rms",
  13: "overturn_rms",
  14: "speed_value",
  17: "vib_rms",
  200: "vib_rms",
  201: "value",
};

const posTypeName = {
  /* 测点类型 */
  1: trans('posTypeName.speedPos'),//转速测点
  2: trans('posTypeName.processPos'),//过程量测点
  3: trans('posTypeName.vibPos'),//振动测点
  4: trans('posTypeName.EnvelopePos'),//包络测点
  5: trans('posTypeName.DigitalPos'),//数字量测点
  6: trans('posTypeName.SloshnessPos'),//晃度测点
  7: trans('posTypeName.temperaturePos'),//温度测点
  8: trans('posTypeName.vibOrderPos'),//振动阶次测点
  9: trans('posTypeName.EnvelopeOrderPos'),//包络阶次测点
  10: trans('posTypeName.ProcessPos'),//工艺量测点
  11: trans('posTypeName.OverturnPos'),//倾覆测点
  12: trans('posTypeName.inclinationPos'),//倾角测点
  13: trans('posTypeName.SyntheticAnglePos'),//合成倾角测点
  14: trans('posTypeName.boltPos'),//螺栓测点
  200: trans('posTypeName.LongsamplePos')//长采样测点
};
/* 测点,图谱打开测点类型限制 */
const matchingRules = {
  //  测点和图谱的匹配规则
  // alarm: { excludingPosType:[1]},
  dip: { includePosType: [13] }, //倾角分布图
  overturn: { includePosType: [13] }, //机舱轨迹图
  dashboard: { includePosType: [11] }, //危险转速区间图
  trend: { excludingPosType: [200, 19] }, //趋势图
  scatter: { excludingPosType: [200] }, //散点图
  wave: { excludingPosType: [1, 2, 5, 7, 10, 11, 13, 19, 201] }, //波形频谱图 8000键相(postype === 19)
  wave3d: { excludingPosType: [1, 2, 5, 7, 10, 11, 13, 14, 17, 19, 201] }, //波形频谱图 只有2000V2(dgm_type == 2)的转速(pos_type==1)存在波形图
  realSummary: { excludingPosType: [201] },//实时数据汇总列表
  real: { excludingPosType: [200] }, //实时数据列表
  history: { excludingPosType: [200] }, //历史数据列表
  railCorrugation: { includePosType: [17] } /* 轨道波磨地图 */,
  tmswave3d: { includePosType: [17] } /* 轨道波磨地图 */,
  tmstrend: { includePosType: [17] } /* 轨道波磨地图 */,
  punchCard: { includePosType: [10] }, //电流卡片
  census: { excludingPosType: [201] }, //统计报表
  maintain: { excludingPosType: [201] }, //设备维护记录
  equipmentParameters: { excludingPosType: [201] }, //设备参数
  monitor: { excludingPosType: [201] }, //监测报表
  //8000
  alarm1: { includePosType: [3] } /* 报警日志 */,
  bode: { includePosType: [3] } /* 伯德图 */,
  axisPosition: { includePosType: [3] } /* 轴心位置图 */,
  speedTime: { includePosType: [3] } /* 转速时间 */,
  fullSpectrum: { includePosType: [3] } /* 全频谱图 */,
  hologram: { includePosType: [3] } /* 全息谱图 */,
  cascade: { includePosType: [3] } /* 级联图 */,
  SpectrumWaterfall: { includePosType: [3] } /* 频谱瀑布图 */,
  ssSpectrumWaterfall: { includePosType: [3] } /* 启停机频谱瀑布图 */,
  multiSpectrum: { includePosType: [3] } /* 多频谱图 */,
  singledynamicBalance: { includePosType: [3] } /* 单面动平衡 */,
  doubledynamicBalance: { includePosType: [3] } /* 双面动平衡 */,
  polarDiagram: { includePosType: [3] } /* 极坐标图 */,
  axisLocus: { includePosType: [3] } /* 轴心轨迹 */,
  multiTrack: { includePosType: [3] } /* 多轨迹图 */,
  nyquist: { includePosType: [3] } /* nyquist图 */,
  wearTrend: { includePosType: [9] }/* 踏面预测趋势图 */,
};
/* 图谱测点类型判断的条件 */
export function matchRule (
  posType,
  chartName,
  dgmType = null,
  t_root = null,
  pos
) {
  /* dgm_type 采集器类型 */
  /* flag 图谱是否能够打开 ，true能， false 不能 */
  let flag = true;
  posType = parseInt(posType);
  let matchRule = matchingRules[chartName];
  /* 没有匹配规则直接通过 */
  if (!matchRule) return flag;
  /* 匹配规则， */
  if (matchRule.includePosType) {
    /* 不在包含的测点类型里面 */
    !matchRule.includePosType.includes(posType) && (flag = false);
  } else {
    /* 在排除的测点类型里面 */
    matchRule.excludingPosType.includes(posType) && (flag = false);
  }
  if (chartName == "wave") {
    // TMS存在转速波形
    //波形只有2000V2(dgm_type == 3)、MHD(dgm_type == 4)、TMS(dgm_type == 7)、2000E(dgm_type == 9)、YHC5000(dgm_type == 13)的转速(pos_type==1)存在波形图
    let dgmTypeList = [3, 4, 7, 9, 13]
    if (dgmTypeList.indexOf(Number(dgmType) !== -1) && posType == 1) {
      flag = true;
    }
  }
  /*  if (chartName == "punchCard" && flag) {
    if (pos) {
      if (pos.sensor_id == "101" && pos.dataaddress == "0304") {
        flag = true;
      } else {
        flag = false;
      }
    }
  } */
  return flag;
}
// 处理时间格式
function getTime (date) {
  let time = new Date(date);
  const YY = time.getFullYear();
  let MM = time.getMonth() + 1;
  MM < 10 && (MM = "0" + MM);
  let DD = time.getDate();
  DD < 10 && (DD = "0" + DD);
  let hh = time.getHours();
  hh < 10 && (hh = "0" + hh);
  let mm = time.getMinutes();
  mm < 10 && (mm = "0" + mm);
  let ss = time.getSeconds();
  ss < 10 && (ss = "0" + ss);
  return `${YY}-${MM}-${DD}  ${hh}:${mm}:${ss}`;
}
// 保留小数
function round (num, dig = 255) {
  let val = Math.abs(num);
  // 若数据过大或者过小时
  if (String(num).indexOf('e') !== -1) {
    let stringNum = String(num)
    let [a, b] = stringNum.split('e')
    if (b.indexOf('+') !== -1) {
      let len = 10 ** 3;
      return Math.round(a * len) / len + 'e' + b;
    }
  }
  if (val >= 10 ** 8 || val === 0) {
    return val;
  }
  if (dig === 255) {
    dig = 0;
    let value = val;
    while (value < 1) {
      value *= 10;
      dig++;
    }
    dig += 2;
    val >= 1000 && (dig = 0);
    val >= 10 && (dig = 1);
  }

  let len = 10 ** dig;
  return Math.round(num * len) / len;
}
// 根据时间类型判断时间
function getTimeOfType (type, date) {
  const time = new Date(date);
  let YY = time.getFullYear();
  let MM = time.getMonth() + 1;
  let DD = time.getDate();
  let hh = time.getHours();
  let mm = time.getMinutes();
  let ss = time.getSeconds();
  switch (type) {
    case 0 /* 前一天 */:
      if (DD === 1) {
        MM--;
        DD = new Date(YY, MM, 0).getDate();
      } else {
        DD--;
      }
      return {
        start: new Date(`${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`).valueOf(),
        end: time.valueOf()
      };
    case 1 /* 前一周 */:
      if (DD <= 7) {
        MM--;
        DD = new Date(YY, MM, 0).getDate() + DD - 7;
        if (MM === 0) {
          YY--;
          MM = 12;
        }
      } else {
        DD -= 7;
      }
      return {
        start: new Date(`${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`).valueOf(),
        end: time.valueOf()
      };
    case 2 /* 前一月 */:
      if (MM === 1) {
        YY--;
        MM = 12;
      } else {
        MM--;
      }
      return {
        start: new Date(`${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`).valueOf(),
        end: time.valueOf()
      };
    case 3 /* 前一季 */:
      if (MM <= 3) {
        YY--;
        MM += 9;
      } else {
        MM -= 3;
      }
      return {
        start: new Date(`${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`).valueOf(),
        end: time.valueOf()
      };
    case 4 /* 前一年 */:
      return {
        start: new Date(`${YY - 1}-${MM}-${DD} ${hh}:${mm}:${ss}`).valueOf(),
        end: time.valueOf()
      };
  }
}
// 筛选工况报警
function setConditionAlarm () {
  const data = [...arguments];
  const codeArr = data[0]; /* 特征值列表 */
  const phaseArr = data[1]; /* 相位特征值列表 */
  const alarm = data[2]; /* 其它工况 */
  const condition = data[3]; /* 工况信息 */
  const offset = Number(data[4]); /* 偏置角度 */
  const list = data[5]; /* 测点历史数据 */
  const posList1 = data[6] || []; /* 工况绑定测点1数据 */
  const posList2 = data[7] || []; /* 工况绑定测点2数据 */
  const conditionPos = [1, 2, 3, 4]; /* 工况1-4 */
  const conditionArr = [1, 2]; /* 工况绑定测点1, 2 */
  const conditionData = []; /* 工况数据 */
  const posType = []; /* 工况绑定的测点类型 */
  if (condition) {
    for (let value of conditionArr) {
      let data = [];
      for (let val of conditionPos) {
        if (
          condition &&
          condition[`pos_name${value}`] !== "无" &&
          condition[`pos_id${value}`] > -1 &&
          condition[`condition_${value}_${val}`] === 1
        ) {
          data.push({
            name: `工况${val}`,
            flag: val,
            limit: condition[`conditionL_${value}_${val}`],
            high: condition[`conditionH_${value}_${val}`]
          });
        }
      }
      posType.push(condition[`pos_type${value}`]);
      conditionData.push(data);
    }
  } else {
    conditionData.push([]);
  }
  const viewData = Object.create(null);
  const colorList = ["#000000", "#3300CC", "#CCCC00", "#993366", "#00CC99"];
  const avgPhaseArr = [40000, 43000, 48000];
  for (let i = 0, l = codeArr.length; i < l; i++) {
    const cValue = codeArr[i];
    const code = cValue.code;
    if (!alarm[code]) continue;
    viewData[code] = Object.create(null);
    let j = 0;
    let len = conditionData[0].length;
    for (; j < len; j++) {
      const value = conditionData[0][j];
      viewData[code][`o${value.flag}`] = {
        alarm: {
          h: alarm[code][`h_limit_${value.flag}`],
          hh: alarm[code][`hh_limit_${value.flag}`]
        },
        name: value.name,
        isShow: true,
        x: [],
        y: [],
        time: [],
        color: colorList[j]
      };
    }
    viewData[code].o5 = {
      alarm: {
        h: alarm[code].h_limit_5,
        hh: alarm[code].hh_limit_5
      },
      name: trans('Common.OtherCond'),//其它工况
      isShow: true,
      x: [],
      y: [],
      time: [],
      color: colorList[j]
    };
    const phaseValue = avgPhaseArr.includes(code) ? 41000 : 42000;
    let phaseFiled = "";
    for (let value of phaseArr) {
      if (value.code === phaseValue) {
        phaseFiled = value.filed;
        break;
      }
    }
    for (j = 0, len = list.length; j < len; j++) {
      const listValue = list[j];
      const phaseValue = round(Math.abs(listValue[phaseFiled] + offset) % 360);
      let value;
      if (cValue.filed == "overturn_s") {
        value = unitTransformation(listValue[cValue.filed]);
      } else {
        value = listValue[cValue.filed];
      }
      const time = listValue.saveTime_Com || listValue.savetime_com;
      let cv1 = -1;
      let cv2 = -1;
      let cv = -1;
      for (let m = 0, n = posList1.length; m < n; m++) {
        const pl = posList1[m];
        const times = pl.saveTime_Com || pl.savetime_com;
        if (times === time) {
          const plv = pl[defaultCode[posType[0]].filed];
          for (let o = 0, p = conditionData[0].length; o < p; o++) {
            const val = conditionData[0][o];
            if (val.limit <= plv && val.high > plv) {
              cv1 = o;
              break;
            }
          }
          break;
        }
      }
      for (let m = 0, n = posList2.length; m < n; m++) {
        const pl = posList2[m];
        const times = pl.saveTime_Com || pl.savetime_com;
        if (times === time) {
          const plv = pl[defaultCode[posType[1]].filed];
          for (let o = 0, p = conditionData[1].length; o < p; o++) {
            const val = conditionData[1][o];
            if (val.limit <= plv && val.high > plv) {
              cv2 = o;
              break;
            }
          }
          break;
        }
      }
      if (cv1 === -1) {
        cv = cv2;
      } else if (cv2 === -1) {
        cv = cv1;
      } else if (cv1 === cv2) {
        cv = cv1;
      } else {
        cv = 4;
      }
      cv === -1 && (cv = 4);
      const cid = cv + 1;
      viewData[cValue.code][`o${cid}`].x.push(value);
      viewData[cValue.code][`o${cid}`].y.push(phaseValue);
      viewData[cValue.code][`o${cid}`].time.push(time);
    }
  }
  return viewData;
}
// 判断数据是否为原始类型
function isStatic (val) {
  return (
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean" ||
    typeof val === "undefined" ||
    val === null
  );
}

// 复制对象
function cloneObj (val, deep) {
  if (isStatic(val)) return val;
  if (Array.isArray(val)) {
    return val.map(item => (deep ? cloneObj(item, deep) : item));
  } else if (typeof val === "object") {
    const wType = ["Error", "Date", "RegExp"];
    var type = Object.prototype.toString.call(val).slice(8, -1);
    if (wType.includes(type)) return new window[type](val);
    var tag = {};
    for (let key in val) {
      tag[key] = deep ? cloneObj(val[key], deep) : val[key];
    }
    return tag;
  }
}
// 单位处理
function getUnit (code, pos) {
  let unit = ''
  switch (code) {
    case -1:
      return;
    case 0:
      unit = "t(s)";
      break;
    case 1000:
      unit = "rpm";
      break;
    case 14000:
      unit = "V";
      break;
    case 15000:
      return "";
    case 16000:
      unit = "rpm";
      break;
    case 17000:
    case 18000:
      unit = "";
      break;
    case 24000:
    case 25000:
    case 26000:
      return "";
    case 20000:
    case 30000:
    case 31000:
      unit = "g";
      break;
    case 21000:
      unit = "m/s";
      break;
    case 22000:
      unit = "W";
      break;
    case 28000:
      unit = "V";
      break;
    case 29000:
    case 32000:
      unit = pos.units.sUnitName || "mm";
      break;
    case 33000:
    case 34000:
    case 35000:
    case 36000:
    case 37000:
    case 38000:
    case 39000:
    case 40000:
      unit = pos.units.sUnitName || "°";
      break;
    case 41000:
    case 42000:
      unit = "∠°";
      break;
    case 43000:
      unit = "mm";
      break;
    case 47000:
    case 48000:
      unit = "m";
      break;
    case 45000:
    case 51000:
      unit = "℃";
      break;
    case 52000:
      unit = "dB";
      break;
    case 54000:
    case 56000:
      unit = "°";
      break;
    case 46000: //冲击值
      unit = "dB";
      break;
    case 57000:
    case 57001: //温升单位与温度一致
      // 温度在tms时从temp_units中取tms设置单位
      if (pos.t_root != 2) {
        unit = "℃";
      } else {
        let unitName
        if (pos.temp_units) {
          //如果byUnitName存在取unitName
          if (pos.temp_units.unitName) {
            unitName = pos.temp_units.unitName[0]; //默认取第一个
          }
          unit = unitName;
        } else {
          unit = "";
        }
      }
      break;
    case 57002:
    case 57003:
    case 57004:
    case 57005:
      unit = "";
      break;
    case 57006:
      unit = "m/s²";
      break;
    case 57007:
      unit = "mm/s";
      break;
    case 57008:
      unit = "μm";
      break;
    case 57009:
      unit = "";
      break;
    case 57010:
      unit = "gD";
      break;
    case 57015:
    case 57016:
      unit = "°";
      break;
    case 57022:
    case 57023:
    case 57024:
    case 57025:
      unit = "Hz";
      break;
    case 58000://智子测点单位为空
      unit = "";
      return unit;
    default:
      if (code >= 12000 && code < 14000) {
        unit = "g";
      }
  }
  if (unit == '') {
    const type = pos.position_type;
    if (type === 4 || type === 9) {
      unit = "gD";
    }
    if (type === 12 || type === 13) {
      unit = "°";
    }
    // 倾覆
    if (type === 11) {
      unit = getUnit(defaultCode[pos.ch_type].code);
    }
    let unitName = "";
    if (pos.units) {
      //如果byUnitName存在取unitName
      if (pos.units.unitName) {
        unitName = pos.units.unitName[0]; //默认取第一个
        if (unitName == "m/s?") {
          unitName = "m/s²";
        }
      }
      unit = unitName;
    } else {
      unit = "";
    }
  }
  const integralDgmType = [3, 4, 9] //需要积分的采集器type
  const integralPosType = [3]//需要积分的测点type
  if (integralDgmType.includes(Number(pos.dgm_type)) !== -1 && integralPosType.includes(Number(pos.position_type)) !== -1) {
    if (pos.units) {
      if (pos.units.byIntegral !== null && pos.units.byIntegral !== undefined) {
        unit = getUnit1(pos.units.byIntegral, unit)
      }
    }
  }
  return unit
}
// 积分单位
function getUnit1 (byIntergal, unit) {
  //构造积分后单位
  if (unit == "§") {
    unit = "gD";
  } else if (unit == "m/s?") {
    unit = "m/s²";
  }
  var unit1 = unit;
  switch (unit) {
    case "μm": //位移
      break;
    case "mm/s": //速度
      if (byIntergal == 1) {
        unit1 = "μm";
      }
      break;
    case "m/s²": //加速度且不积分
      break;
    case "g": //加速度
      if (byIntergal == 2) {
        unit1 = "μm";
      } else if (byIntergal == 1) {
        unit1 = "mm/s";
      }
      break;
  }
  return unit1;
}
/* 沉降量 位移 单位转换为m /1000 保留两位小数 */
export function unitTransformation (num) {
  if (num !== null) {
    if (num >= 10 ** 8 || num === 0) {
    } else {
      // 若数据过大或者过小时
      if (String(num).indexOf('e') !== -1) {
        let stringNum = String(num)
        let [a, b] = stringNum.split('e')
        if (b.indexOf('+') !== -1) {
          let len = 10 ** 3;
          return Math.round(a * len) / len + 'e+' + Number(b-3);
        }
      }
      num = round(num / 1000, 2);
    }
  }
  return num;
}

// 判断是否为振动系测点
function isVibOfPos (posType) {
  const vibObj = {
    3: 1,
    4: 1,
    6: 1,
    8: 1,
    9: 1,
    12: 1
  };
  return Boolean(vibObj[posType]);
}
///////////////////////////////////////////////////////////实时数据相关 start/////////////////////////////////////////////////////////////////
// 数据类型代码
export function realCode (position_type, pos_loc) {
  position_type = Number(position_type)
  pos_loc = Number(pos_loc)
  switch (position_type) {
    case 1:
      return 'speed'
    case 2:
      return 'sta'
    case 3:
      return 'vib'
    case 4:
      return 'spm'
    case 5:
      return 'digital'
    case 7:
      return 'temp'
    case 8:
      return 'vib_order'
    case 9:
      return 'spm_order'
    case 10:
      return 'mod'
    case 6:
    case 11:
      return 'overturn'
    case 12:
    case 13:
      return pos_loc === 2 ? 'settle' : 'dip'
    case 14:
      return 'bolt'
    case 15: // 冲击
      return 'sv'
    case 16:
      return 'sv_order'
    case 17: // 轨道波磨
      return 'rail'
    case 18: // 脱轨监测
      return 'derail'
    case 19:
      return 'keyphase'
  }
  return ''
}
// 数据类型名称
export function realCodeName (code) {
  switch (code) {
    case 'speed':
      return trans('eigenvalue.speed')//转速
    case 'sta':
      return trans('eigenvalue.ProcessValue')//过程量
    case 'vib':
      return trans('eigenvalue.vibration')//振动
    case 'spm':
      return trans('eigenvalue.envelope')//包络
    case 'digital':
      return trans('eigenvalue.digital')//数字量
    case 'temp':
      return trans('eigenvalue.temperature')//温度
    case 'vib_order':
      return trans('eigenvalue.VibOrder')//振动阶次
    case 'spm_order':
      return trans('eigenvalue.EnvelopeOrder')//包络阶次
    case 'mod':
      return trans('eigenvalue.ProcessQuantity')//'工艺量'
    case 'overturn':
      return trans('eigenvalue.Overturned')//倾覆
    case 'settle':
      return trans('eigenvalue.sink')//沉降
    case 'dip':
      return trans('eigenvalue.inclination')//倾角
    case 'bolt':
      return trans('eigenvalue.bolt')//螺栓
    case 'sv':
      return trans('eigenvalue.Shock')//冲击
    case 'sv_order':
      return trans('eigenvalue.ImpactOrder')//冲击阶次
    case 'rail':
      return trans('eigenvalue.OrbitalCorrugation')//轨道波磨
    case 'derail':
      return trans('eigenvalue.DerailmentMonitor')//脱轨监测
    case 'keyphase':
      return trans('eigenvalue.BondPhase')//键相
  }
  return ''
}
// 通过测点查询数据类型名称
export function realCodeNameByPos (position_type, pos_loc) {
  let code = realCode(position_type, pos_loc)
  return realCodeName(code)
}
// 特征值列表
export function realCodeList (t_root, dgm_type, position_type, pos_loc = 1) {
  const head1 = setHead(t_root, dgm_type, position_type, pos_loc)
  let head2 = head1;
  // 走行部处理
  if (
    t_root == 2 &&
    (position_type == 4 ||
      position_type == 9 ||
      position_type == 15 ||
      position_type == 16)
  ) {
    head2 = head1.filter(function (item) {
      return item.code < 52001 || item.code > 52009;
    });
    head2.push(
      {
        filed: "part_name0",
        val: trans('eigenvalue.part') + "1",
        code: -1,
        isShow: false
      } /* 部件1 */,
      {
        filed: "sv0",
        val: "1-" + trans('eigenvalue.ExternalRingOfCage'),//保持架对外环
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv1",
        val: "1-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv2",
        val: "1-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv3",
        val: "1-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv4",
        val: "1-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv5",
        val: "1-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv6",
        val: "1-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv7",
        val: "1-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv8",
        val: "1-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name1",
        val: trans('eigenvalue.part') + "2",
        code: -1,
        isShow: false
      } /* 部件2 */,
      {
        filed: "sv10",
        val: "2-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv11",
        val: "2-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv12",
        val: "2-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv13",
        val: "2-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv14",
        val: "2-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv15",
        val: "2-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv16",
        val: "2-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv17",
        val: "2-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv18",
        val: "2-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name2",
        val: trans('eigenvalue.part') + "3",
        code: -1,
        isShow: false
      } /* 部件3 */,
      {
        filed: "sv20",
        val: "3-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv21",
        val: "3-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv22",
        val: "3-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv23",
        val: "3-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv24",
        val: "3-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv25",
        val: "3-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv26",
        val: "3-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv27",
        val: "3-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv28",
        val: "3-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name3",
        val: trans('eigenvalue.part') + "4",
        code: -1,
        isShow: false
      } /* 部件4 */,
      {
        filed: "sv30",
        val: "4-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv31",
        val: "4-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv32",
        val: "4-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv33",
        val: "4-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv34",
        val: "4-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv35",
        val: "4-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv36",
        val: "4-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv37",
        val: "4-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv38",
        val: "4-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name4",
        val: trans('eigenvalue.part') + "5",
        code: -1,
        isShow: false
      } /* 部件5 */,
      {
        filed: "sv40",
        val: "5-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv41",
        val: "5-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv42",
        val: "5-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv43",
        val: "5-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv44",
        val: "5-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv45",
        val: "5-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv46",
        val: "5-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv47",
        val: "5-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv48",
        val: "5-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name5",
        val: trans('eigenvalue.part') + "6",
        code: -1,
        isShow: false
      } /* 部件6 */,
      {
        filed: "sv50",
        val: "6-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv51",
        val: "6-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv52",
        val: "6-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv53",
        val: "6-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv54",
        val: "6-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv55",
        val: "6-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv56",
        val: "6-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv57",
        val: "6-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv58",
        val: "6-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name6",
        val: trans('eigenvalue.part') + "7",
        code: -1,
        isShow: false
      } /* 部件7 */,
      {
        filed: "sv60",
        val: "7-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv61",
        val: "7-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv62",
        val: "7-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv63",
        val: "7-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv64",
        val: "7-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv65",
        val: "7-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv66",
        val: "7-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv67",
        val: "7-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv68",
        val: "7-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name7",
        val: trans('eigenvalue.part') + "8",
        code: -1,
        isShow: false
      } /* 部件8 */,
      {
        filed: "sv70",
        val: "8-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv71",
        val: "8-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv72",
        val: "8-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv73",
        val: "8-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv74",
        val: "8-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv75",
        val: "8-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv76",
        val: "8-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv77",
        val: "8-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv78",
        val: "8-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name8",
        val: trans('eigenvalue.part') + "9",
        code: -1,
        isShow: false
      } /* 部件9 */,
      {
        filed: "sv80",
        val: "9-" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv81",
        val: "9-" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv82",
        val: "9-" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv83",
        val: "9-" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv84",
        val: "9-" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv85",
        val: "9-" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv86",
        val: "9-" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv87",
        val: "9-" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv88",
        val: "9-" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */,
      {
        filed: "part_name9",
        val: trans('eigenvalue.part') + "10",
        code: -1,
        isShow: false
      } /* 部件10 */,
      {
        filed: "sv90",
        val: "10" + trans('eigenvalue.ExternalRingOfCage'),
        code: 52001,
        isShow: false
      } /* 保持架对外环频率 */,
      {
        filed: "sv91",
        val: "10" + trans('eigenvalue.cageToInnerRing'),//保持架对外环
        code: 52002,
        isShow: false
      } /* 保持架对内环频率 */,
      {
        filed: "sv92",
        val: "10" + trans('eigenvalue.OuterRingInnerRaceway'),//外环内滚道
        code: 52003,
        isShow: false
      } /* 外环内滚道频率 */,
      {
        filed: "sv93",
        val: "10" + trans('eigenvalue.InnerRingOuterRaceway'),//内环外滚道
        code: 52004,
        isShow: false
      } /* 内环外滚道频率 */,
      {
        filed: "sv94",
        val: "10" + trans('eigenvalue.RollRder'),//滚单
        code: 52005,
        isShow: false
      } /* 滚单频率 */,
      {
        filed: "sv95",
        val: "10" + trans('eigenvalue.RollDouble'),//滚双
        code: 52006,
        isShow: false
      } /* 滚双频率 */,
      {
        filed: "sv96",
        val: "10" + trans('eigenvalue.Tread'),//踏面
        code: 52007,
        isShow: false
      } /* 踏面频率 */,
      {
        filed: "sv97",
        val: "10" + trans('eigenvalue.AdjacentShaftGear'),//邻轴齿轮
        code: 52008,
        isShow: false
      } /* 邻轴齿轮频率 */,
      {
        filed: "sv98",
        val: "10" + trans('eigenvalue.MainShaftGear'),//本轴齿轮
        code: 52009,
        isShow: false
      } /* 本轴齿轮频率 */
    );
  }
  const curHead = [
    {
      isShow: true,
      val: "测点",
      filed: false
    }
  ].concat(head2);
  return curHead
}
///////////////////////////////////////////////////////////实时数据相关 end/////////////////////////////////////////////////////////////////
// 机组信息筛选
function setMacMsg (machines) {
  let newMac = [];
  for (let i = 0, l = machines.length; i < l; i++) {
    const mac = cloneObj(machines[i], true);
    if (mac.pumps && mac.pumps.length > 0) {
      for (let j = 0, len = mac.pumps.length; j < len; j++) {
        const pump = mac.pumps[j];
        newMac.push({
          m_type: mac.m_type,
          mac_activity: mac.mac_activity,
          mac_id: mac.mac_id,
          machine_id: mac.mac_id,
          mac_me: mac.mac_me,
          t_id: mac.t_id,
          t_name: mac.t_name,
          t_root: mac.t_root,
          updateTime: mac.updateTime,
          ch_class: pump.ch_class,
          pump_activity: pump.pump_activity,
          pump_id: pump.pump_id,
          pump_name: pump.pump_name,
          pump_type: pump.pump_type,
          m_me: pump.pump_name,
          name: pump.pump_name,
          // jc: pump.jc,
          alarmStatus: pump.alarmStatus,
          macFlag: `${mac.mac_id}0${pump.pump_id}`
        });
      }
    } else {
      mac.m_me = mac.mac_me;
      mac.machine_id = mac.mac_id;
      mac.macFlag = mac.mac_id;
      name: mac.mac_me;
      newMac.push(mac);
    }
  }
  newMac = sortMachine(newMac);
  return newMac;
}
// 测点信息筛选
function setPosMsg (positions) {
  const speedArr = []; /* 转速 channel_type: 2 */
  const vibArr = []; /* 振动 channel_type: 0 */
  const rpmArr = []; /* 包络 channel_type: 0 */
  const nxVib = []; /* 振动阶次 channel_type: 0 */
  const nxRpm = []; /* 包络阶次 channel_type: 0 */
  const otherVib = []; /* 其它振动通道 channel_type: 0 */
  const captureArr = []; /* 长采样 channel_type: 11 */
  const mhdArr = []; /* MHD channel_type: 12 */
  const ovtArr = []; /* 倾覆、合成(倾角) channel_type: 6 */
  const boltArr = []; /* 螺栓 channel_type: 8 */
  const flangeArr = []; /* 法兰 channel_type: 9 */
  const temArr = []; /* 温度 channel_type: 4 */
  const staArr = []; /* 过程量 channel_type: 1 */
  const modArr = []; /* 工艺量 channel_type: 7 */
  const digArr = []; /* 数字量 channel_type: 3 */
  const mbsArr = []; /* 外部集成 channel_type: 5 */
  const prepArr = []; /* 预处理器 channel_type: 10 */
  for (let i = 0, l = positions.length; i < l; i++) {
    const val = cloneObj(positions[i], true);
    val.rock1_name = val.rock1_pos_name;
    val.rock2_name = val.rock2_pos_name;
    val.posFlag = `${val.machine_id}_${val.position_id}_${val.position_type}`;
    /* const nVal = cloneObj(val.position, true);
    nVal.pos_loc = val.pos_loc || null;
    nVal.sensor_name = val.sensor_name || null;
    nVal.ch_id = val.ch_id || null;
    nVal.ch_type = val.ch_type || null;
    nVal.units = val.units || null;
    nVal.dgm_type = val.dgm_type || null;
    nVal.posFlag = `${nVal.machine_id}_${nVal.position_id}_${nVal.position_type}`;
    nVal.offset_angle = val.offset_angle ? Number(val.offset_angle) : null;
    nVal.rock1_id = val.rock1_id
    nVal.rock2_id = val.rock2_id
    nVal.rock1_name = val.rock1_pos_name
    nVal.rock2_name = val.rock2_pos_name */
    switch (val.channel_type) {
      case 0:
        switch (val.position_type) {
          case 3:
            vibArr.push(val);
            break;
          case 4:
            rpmArr.push(val);
            break;
          case 8:
            nxVib.push(val);
            break;
          case 9:
            nxRpm.push(val);
            break;
          default:
            otherVib.push(val);
            break;
        }
        // vibArr.push(val);
        break;
      case 1:
        staArr.push(val);
        break;
      case 2:
        speedArr.push(val);
        break;
      case 3:
        digArr.push(val);
        break;
      case 4:
        temArr.push(val);
        break;
      case 5:
        mbsArr.push(val);
        break;
      case 6:
        ovtArr.push(val);
        break;
      case 7:
        modArr.push(val);
        break;
      case 8:
        boltArr.push(val);
        break;
      case 9:
        flangeArr.push(val);
        break;
      case 10:
        prepArr.push(val);
        break;
      case 11:
        captureArr.push(val);
        break;
      case 12:
        mhdArr.push(val);
        break;
    }
  }
  let vibArrs = [];
  if (rpmArr.length > 0) {
    /* 包络 + 阶次 */
    vibArr.sort((a, b) => {
      return a.channel_id - b.channel_id;
    });
    rpmArr.sort((a, b) => {
      return a.position_id - b.position_id;
    });
    for (let i = 0, l = vibArr.length; i < l; i++) {
      let flag = i;
      for (let j = 0, len = rpmArr.length; j < len; j++) {
        const vib = vibArr[i];
        const rpm = rpmArr[j];
        const cId = vib.channel_id;
        if (cId === rpm.channel_id) {
          let rpmNx = null;
          let vibNx = null;
          for (let m = 0, o = nxVib.length; m < o; m++) {
            for (let n = 0, p = nxRpm.length; n < p; n++) {
              const nxV = nxVib[m];
              const nxR = nxRpm[n];
              if (nxV.channel_id === cId) {
                vibNx = nxV;
              }
              if (nxR.channel_id === cId) {
                rpmNx = nxR;
              }
            }
          }
          if (flag === i) {
            if (vibNx !== null && rpmNx !== null) {
              vibArrs.push(vib, rpm, vibNx, rpmNx);
            } else if (vibNx !== null) {
              vibArrs.push(vib, rpm, vibNx);
            } else if (rpmNx !== null) {
              vibArrs.push(vib, rpm, rpmNx);
            } else {
              vibArrs.push(vib, rpm);
            }
            flag++;
          } else {
            if (vibNx !== null && rpmNx !== null) {
              vibArrs.push(rpm, vibNx, rpmNx);
            } else if (vibNx !== null) {
              vibArrs.push(rpm, vibNx);
            } else if (rpmNx !== null) {
              vibArrs.push(rpm, rpmNx);
            } else {
              vibArrs.push(rpm);
            }
          }
        }
      }
    }
  } else if (nxVib.length > 0) {
    /* 阶次 */
    for (let i = 0, l = vibArr.length; i < l; i++) {
      for (let j = 0, len = nxVib.length; j < len; j++) {
        const vib = vibArr[i];
        const cId = vib.channel_id;
        const nxV = nxVib[j];
        if (nxV.channel_id === cId) {
          vibArrs.push(vib, nxV);
          break;
        }
      }
    }
  } else {
    vibArrs = vibArr;
  }
  const l = ovtArr.length;
  const dipArr = [];
  const overturnArr = [];
  if (l > 0) {
    ovtArr.sort((a, b) => {
      return a.channel_id - b.channel_id;
    });
    for (let i = 0; i < l; i++) {
      const ovt = ovtArr[i];
      if (ovt.position_type === 13) {
        for (let i = 0, l = mbsArr.length; i < l; i++) {
          const mbs = mbsArr[i];
          if (
            Number(ovt.rock1_id) === mbs.position_id &&
            ovt.rock1_name === mbs.position_name &&
            ovt.pos_loc === mbs.pos_loc
          ) {
            dipArr.push(mbs);
            mbsArr.splice(i, 1);
            break;
          }
        }
        for (let i = 0, l = mbsArr.length; i < l; i++) {
          const mbs = mbsArr[i];
          if (
            Number(ovt.rock2_id) === mbs.position_id &&
            ovt.rock2_name === mbs.position_name &&
            ovt.pos_loc === mbs.pos_loc
          ) {
            dipArr.push(mbs);
            dipArr.push(ovt);
            mbsArr.splice(i, 1);
            break;
          }
        }
      } else {
        for (let i = 0, l = otherVib.length; i < l; i++) {
          const other = otherVib[i];
          if (
            other &&
            other.position_type === 6 &&
            other.sensor_name === ovt.position_name
          ) {
            overturnArr.push(other);
            otherVib.splice(i, 1);
            if (overturnArr.length === 2) {
              overturnArr.push(ovt);
              break;
            }
            i--;
          }
        }
      }
    }
  }
  let pos = speedArr.concat(
    vibArrs,
    otherVib,
    temArr,
    staArr,
    modArr,
    digArr,
    captureArr,
    mhdArr,
    overturnArr,
    dipArr,
    boltArr,
    flangeArr,
    mbsArr,
    prepArr
  );
  if (pos.length !== positions.length) {
    /* 排序之后少测点了 */
    let temp = [];
    positions.forEach(item => {
      let flag = true;
      pos.forEach(item2 => {
        if (
          item.position_id === item2.position_id &&
          item.position_type === item2.position_type
        ) {
          flag = false;
          // 遇到同样的测点
          return;
        }
      });
      if (flag) {
        /* 没有遇到同样的测点 */
        temp.push(item);
      }
    });
    pos = pos.concat(temp);
  }
  // 测点排序
  return pos;
}

/*
  Dom是否包含class
  el           HTMLElement    Dom对象
  className    String         待判断的类名
 */
function hasClass (el, className) {
  return new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className);
}
/*
  Dom添加class
  el           HTMLElement    Dom对象
  className    String         需要添加的类名
 */
function addClass (el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(" ");
  newClass.push(className);
  el.className = newClass.join(" ");
}
/*
  Dom移除class
  el           HTMLElement    Dom对象
  className    String         需要移除的类名
 */
function removeClass (el, className) {
  if (!hasClass(el, className)) {
    return;
  }
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
  el.className = el.className.replace(reg, " ");
}
/*
  修改Dom的class
  el              HTMLElement    Dom对象
  newClassName    String         修改后的类名
  oldClassName    String         需要修改的类名
 */
function changeClass (el, newClassName, oldClassName) {
  removeClass(el, oldClassName);
  addClass(el, newClassName);
}
// 波形一次积分算法
function makeWaveY (t_waveY, freq) {
  var fs = freq;
  var dt = 1 / fs;
  var t = [];
  var i = 0;
  for (i = 0; i < t_waveY.length; i++) {
    t.push(dt * i);
  }
  var x = t_waveY;
  // for (i = 0; i < t_waveY; i++) {
  //     x.push(Math.sin(2*Math.PI*160*t[i]));
  // }
  var N = x.length;
  waveDCOut(x, N);
  var y = [];
  for (i = 0; i < x.length - 1; i++) {
    y[0] = 0;
    y[i + 1] =
      Number(y[i]) + ((Number(x[i + 1]) + Number(x[i])) / 2 / fs) * 1000;
  }
  var xx = [[], []];
  xx[0][0] = N;
  xx[0][1] = sum(t);
  xx[1][0] = sum(t);
  var t_2 = [];
  var t_y = [];
  for (i = 0; i < t.length; i++) {
    t_2[i] = Number(t[i]) * Number(t[i]);
    t_y[i] = Number(t[i]) * Number(y[i]);
  }
  xx[1][1] = sum(t_2);
  var yy = [sum(y), sum(t_y)];
  var _xx = inverse(xx);
  var cof_1_1 = _xx[0][0] * yy[0] + _xx[0][1] * yy[1];
  var cof_2_1 = _xx[1][0] * yy[0] + _xx[1][1] * yy[1];
  for (i = 0; i < t.length - 1; i++) {
    y[i] = y[i] - (cof_2_1 * t[i] + cof_1_1);
  }
  return y;
}
// 去直流
function waveDCOut (t_waveY, len) {
  var i = 0;
  var avg = 0;
  // 求平均值
  for (i = 0; i < len; i++) {
    avg += t_waveY[i] / len;
  }
  //去掉直流量
  for (i = 0; i < len; i++) {
    t_waveY[i] = t_waveY[i] - avg;
  }
  return t_waveY;
}
// 数组求和
function sum (arr) {
  var s = 0;
  arr.forEach((val, idx, arr) => {
    s += val;
  }, 0);
  return s;
}
function setIdentity (n) {
  var result = new Array(n);

  for (var i = 0; i < n; i++) {
    result[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      result[i][j] = i === j ? 1 : 0;
    }
  }

  return result;
}
// 求逆矩阵的方法
function inverse (m) {
  var n = m.length;
  var identity = setIdentity(n);
  var i;

  // AI
  for (i = 0; i < n; i++) {
    m[i] = m[i].concat(identity[i]);
  }

  // inv(IA)
  m = GaussJordanEliminate(m);

  // inv(A)
  for (i = 0; i < n; i++) {
    m[i] = m[i].slice(n);
  }

  return m;
}
function GaussJordanEliminate (m, epsilon) {
  // Translated from:
  // http://elonen.iki.fi/code/misc-notes/python-gaussj/index.html
  var eps = typeof epsilon === "undefined" ? 1e-10 : epsilon;

  var h = m.length;
  var w = m[0].length;
  var y = -1;
  var y2, x, c;

  while (++y < h) {
    // Pivot.
    var maxrow = y;
    y2 = y;
    while (++y2 < h) {
      if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) maxrow = y2;
    }
    var tmp = m[y];
    m[y] = m[maxrow];
    m[maxrow] = tmp;

    // Singular
    if (Math.abs(m[y][y]) <= eps) {
      return m;
    }

    // Eliminate column
    y2 = y;
    while (++y2 < h) {
      c = m[y2][y] / m[y][y];
      x = y - 1;
      while (++x < w) {
        m[y2][x] -= m[y][x] * c;
      }
    }
  }

  // Backsubstitute.
  y = h;
  while (--y >= 0) {
    c = m[y][y];
    y2 = -1;
    while (++y2 < y) {
      x = w;
      while (--x >= y) {
        m[y2][x] -= (m[y][x] * m[y2][y]) / c;
      }
    }
    m[y][y] /= c;

    // Normalize row
    x = h - 1;
    while (++x < w) {
      m[y][x] /= c;
    }
  }

  return m;
}
// 频谱积分
function integralFft (t_specY, len, deltaF, t_sourceIndex) {
  var i = 0;
  var result = [0];
  //首次计算时 单位是g的时候乘以9.8 不是则不乘
  var g = 1;
  if (t_sourceIndex == 0) {
    g = 9.8;
  }
  for (i = 1; i < len; i++) {
    result[i] = (t_specY[i] * g * 1000) / (2 * Math.PI * deltaF * i);
  }
  return result;
}
// 机组排序
function sortMachine (arr) {
  for (var j = 0; j < arr.length - 1; j++) {
    for (var i = 0; i < arr.length - 1 - j; i++) {
      if (
        parseInt(arr[i].m_me.replace(/[^0-9]/gi, "")) >
        parseInt(arr[i + 1].m_me.replace(/[^0-9]/gi, ""))
      ) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
  return arr;
}
function waveFFT (
  data,
  freq,
  nFirst,
  nCount,
  mi,
  specType,
  spectral,
  alarmType
) {
  var nPointNumber = 1;
  for (var i = 0; i < mi; i++) nPointNumber *= 2;

  var pBegin = nFirst;
  var nWaveCount = data.length;
  if (nFirst >= nWaveCount) return -1;
  if (nFirst + nCount > nWaveCount) nCount = nWaveCount - nFirst;

  var all_count = nCount;
  var fDF = freq / nPointNumber;
  if (specType == 2) {
    fDF = (fDF * spectral) / freq;
  }
  // 汉宁窗
  var hanning = [];
  for (var i = 0, l = data.length; i < l; i++) {
    hanning.push(data[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / l)));
  }

  // 抽取
  var hanningX = [0];
  var hanningY = [];
  var x_arr = [];
  var y_arr = [];
  // x_arr.length = (nPointNumber + 1);
  x_arr[0] = 0; // 插入空白点
  for (i = 0; i < nPointNumber - 1; i++) {
    // i * nCount 可能很大，超过int的范围
    // 因此用double进行计算
    var pos = i;
    pos = parseInt((pos * (nCount - 1)) / nPointNumber);
    var ipos0 = pos;
    var ipos1 = ipos0 + 1;
    var hanningV0 = hanning[pBegin + ipos0];
    var hanningV1 = hanning[pBegin + ipos1];
    var v0 = data[pBegin + ipos0];
    var v1 = data[pBegin + ipos1];
    // 插值
    var t = pos - ipos0;
    var v = v0 + (v1 - v0) * t;
    x_arr.push(v);
    hanningX.push(hanningV0 + (hanningV1 - hanningV0) * t);
  }
  x_arr.push(data[pBegin + nCount - 1]); // 插入最后一个点
  hanningX.push(hanning[pBegin + nCount - 1]);

  //			if (x_arr.length != (nPointNumber+1))
  //				return -1;

  // 计算平均值average，并且令x[i] -= average以消除直流分量
  var hanningSum = 0;
  var sum = 0;
  for (i = 1; i < x_arr.length; i++) {
    sum += x_arr[i];
    hanningSum += hanningX[i];
  }
  var hanningAverage = hanningSum / nPointNumber;
  var average = sum / nPointNumber;
  for (i = 1; i < x_arr.length; i++) {
    x_arr[i] -= average;
    hanningX[i] -= hanningAverage;
  }

  // y_arr.length = (nPointNumber + 1);
  offt(1, mi, hanningX, hanningY, nPointNumber);
  offt(1, mi, x_arr, y_arr, nPointNumber);
  // 处理计算结果
  var t_fMaxFZ = 0;
  var number = parseInt(nPointNumber / 2.56);
  var OutX = [];
  var OutY = [];
  var OutPhase = [];
  var OutHanning = [];
  var pAlarm = 1; //计算因数：默认峰值
  switch (alarmType) {
    case 0: //有效值
      pAlarm = Math.sqrt(2) / 2;
      break;
    case 2: //峰峰值
      pAlarm = 2;
      break;
  }
  // OutX.length = number;
  // OutY.length = number;
  // OutPhase.length = number;
  for (i = 0; i < number; i++) {
    var xi = x_arr[i + 1];
    var yi = y_arr[i + 1];
    // 频率
    OutX.push(Math.ceil(i * fDF * 100000) / 100000);
    // 幅值 mantis 695 *4 改为 *2
    OutY.push(((Math.sqrt(xi ** 2 + yi ** 2) * 2) / nPointNumber) * pAlarm);
    // 相位 (弧度)
    OutPhase.push(Math.atan2(yi, xi));
    // 最大幅值
    t_fMaxFZ = Math.max(OutY[i], t_fMaxFZ);
    OutHanning.push(
      ((Math.sqrt(hanningX[i + 1] ** 2 + hanningY[i + 1] ** 2) * 2) /
        nPointNumber) *
      pAlarm *
      2
    );
  }

  if (
    t_fMaxFZ < Number.NEGATIVE_INFINITY ||
    t_fMaxFZ > Number.POSITIVE_INFINITY
  ) {
    t_fMaxFZ = -1;
    return t_fMaxFZ;
  }
  return [
    OutX,
    OutY,
    OutPhase,
    OutHanning
  ];
  // return [OutX, OutY, OutPhase];
}
function offt (dir, i_dianshu_mi, x, y, i_dianshu) {
  i_dianshu = i_dianshu || 0;
  var i, j, k, l, m, l1;
  var t1, t2, u1, u2, w1, w2, p2, z;

  // Calculate the number of points
  if (i_dianshu == 0) {
    i_dianshu = 1;
    for (i = 0; i < i_dianshu_mi; i++) i_dianshu *= 2;
  }

  // y.length = i_dianshu + 1;
  for (i = 0; i <= i_dianshu; i++) y[i] = 0;

  j = 1;

  for (l = 1; l <= i_dianshu - 1; l++) {
    if (l < j) {
      t1 = x[j];
      //					t2 = y[j];
      x[j] = x[l];
      //					y[j] = y[l];
      x[l] = t1;
      //					y[l] = t2;
    }
    k = i_dianshu >> 1;
    while (k < j) {
      j -= k;
      k = k >> 1;
    }
    j = j + k;
  }
  m = 1;

  for (i = 1; i <= i_dianshu_mi; i++) {
    u1 = 1;
    u2 = 0;
    k = m;
    m = m << 1;
    p2 = Math.PI / k;
    w1 = Math.cos(p2);
    //				w2 = (-Math.sin(p2));
    //				w2 = -w2;
    w2 = Math.sin(p2);
    for (j = 1; j <= k; j++) {
      for (l = j; l <= i_dianshu; l += m) {
        l1 = l + k;
        t1 = x[l1] * u1 - y[l1] * u2;
        t2 = x[l1] * u2 + y[l1] * u1;
        x[l1] = x[l] - t1;
        y[l1] = y[l] - t2;
        x[l] += t1;
        y[l] += t2;
      }
      z = u1 * w1 - u2 * w2;
      u2 = u1 * w2 + u2 * w1;
      u1 = z;
    }
  }
}
/* 计算频谱，用于计算波形
   maxFreq      Number    最大频率
   waveY        Array     波形Y轴数据
   specType     Number    图谱类型(1: 频谱, 2: 阶次)
   spectral     Number    采样点数
   alarmType    Number    报警类型(水电用, 0: 有效值, 1: 峰值, 2: 峰峰值)
 */
function setSrcSpectrum (maxFreq, waveY, specType, spectral, alarmType = 1) {
  var tmpWaveY = [];
  var sum = 0;
  var aver = 0;
  var len = 1;
  var mi = 0;
  var i = 0;
  var l = waveY.length;
  var k = Math.floor(Math.log(l) / Math.LN2);
  if (Math.pow(2, k) === waveY.length) {
    for (; l > 1; l >>= 1) {
      mi++;
    }
    for (i = 0; i < mi; i++) {
      len *= 2;
    }
    for (i = 0; i < len; i++) {
      tmpWaveY.push(waveY[i]);
    }
    if (tmpWaveY.length > 0) {
      for (i = 0, l = tmpWaveY.length; i < l; i++) {
        sum += tmpWaveY[i];
      }
      aver = sum / l;
      for (i = 0; i < l; i++) {
        tmpWaveY[i] -= aver;
      }
    }
  } else {
    var dValue = Math.pow(2, k + 1) - waveY.length;
    var d2 = dValue / 2;
    var before = [],
      after = [];
    for (var i = 0; i < dValue; i++) {
      i < d2 ? before.push(0) : after.push(0);
    }
    tmpWaveY = before.concat(waveY, after);
    len = tmpWaveY.length;
    mi = k + 1;
  }
  var specturm_data = waveFFT(
    tmpWaveY,
    maxFreq,
    0,
    len,
    mi,
    specType,
    spectral,
    alarmType
  );
  return {
    fftX: specturm_data[0],
    fftY: specturm_data[1],
    outP: specturm_data[2],
    hanning: specturm_data[3]
  };
}


// 获取当前
export function posType_name (type) {
  let postType_name = "";
  switch (parseInt(type)) {
    case 3:
      postType_name = trans('eigenvalue.vibration');//振动
      break;
    case 4:
      postType_name = trans('eigenvalue.envelope');//包络
      break;
    case 8:
      postType_name = trans('eigenvalue.VibOrder');//振动阶次
      break;
    case 9:
      postType_name = trans('eigenvalue.EnvelopeOrder')//包络阶次
      break;
    case 1:
      postType_name = trans('eigenvalue.speed');//转速
      break;
    case 6:
      postType_name = trans('eigenvalue.Shake');//晃度
      break;
    case 11:
      postType_name = trans('eigenvalue.Overturned');//"倾覆";
      break;
    case 12:
      postType_name = trans('eigenvalue.inclination');//"倾角";
      break;
    case 13:
      postType_name = trans('eigenvalue.SyntheticInclination');//"合成倾角";
      break;
    case 7:
      postType_name = trans('eigenvalue.temperature');//温度
      break;
    case 2:
      postType_name = trans('eigenvalue.ProcessVolume');//"过程量";
      break;
    case 5:
      postType_name = trans('eigenvalue.digital');//"数字量";
      break;
    case 10:
      postType_name = trans('eigenvalue.overturn_s');//工艺量
      break;
  }
  return postType_name;
}
//字符串初始化
function initStringVal (val) {
  if (val == null || typeof val == "undefined") {
    return "";
  }
  return val;
}

export function itemMapping (key) {
  const itemList = {
    /* 其他的测点 */
    O_01: {
      CNname: trans('ytMap.WellheadPressure'),//井口压力
      mappingKey: 7766
    },
    O_02: {
      CNname: trans('ytMap.WellheadTemperature'),//井口温度
      mappingKey: 7766
    },
    O_03: {
      CNname: trans('ytMap.PdOutletPressure'),//Pd出口压力
      mappingKey: "Pd"
    },
    O_04: {
      CNname: trans('ytMap.PiSuctionPressure'),//Pi吸入口压力
      mappingKey: "Pi"
    },
    O_05: {
      CNname: trans('ytMap.TiFluidTemperature'),//Ti流体温度
      mappingKey: "Ti"
    },
    O_06: {
      CNname: trans('ytMap.TmmotorOilTemperature'),//Tm电机油温
      mappingKey: "Tm"
    },
    O_07: {
      CNname: trans('ytMap.TgDownholeCircuit'),//Tg井下电路
      mappingKey: "Tg"
    },
    O_08: {
      CNname: trans('ytMap.VxDownholeVib'),//Vx井下振动
      mappingKey: "Vx"
    },
    O_09: {
      CNname: trans('ytMap.VYDownholeVib'),//Vy井下振动
      mappingKey: "Vy"
    },
    O_10: {
      CNname: trans('ytMap.VZDownholeVib'),//Vz井下振动
      mappingKey: "Vz"
    },

    // A:变压器 B、变频器 C、运行记录 D、井下电机 E、井下传感器 F、智能电表
    A_01: {
      CNname: trans('ytMap.TransformationRatio'),//变比
      mappingKey: 7766
    },
    A_02: {
      CNname: trans('ytMap.OutputVoltageAB'),//输出电压AB
      mappingKey: '井下机组给定电压AB',//井下机组给定电压AB  trans('ytMap.DownOutputVoltageAB')
    },
    A_03: {
      CNname: trans('ytMap.OutputVoltageBC'),//输出电压BC
      mappingKey: '井下机组给定电压BC',// trans('ytMap.DownOutputVoltageBC')//井下机组给定电压BC
    },
    A_04: {
      CNname: trans('ytMap.OutputBoltageAC'),//输出电压AC
      mappingKey: '井下机组给定电压CA',//trans('ytMap.DownOutputBoltageAC')//井下机组给定电压CA
    },
    A_05: {
      CNname: trans('ytMap.AphaseCurrent'),//A相电流
      mappingKey: '井下运行A相电流',//trans('ytMap.DownAphaseCurrent')//井下运行A相电流
    },
    A_06: {
      CNname: trans('ytMap.PhaseBCurrent'),//B相电流
      mappingKey: '井下运行B相电流',//trans('ytMap.DownPhaseBCurrent')//井下运行B相电流
    },
    A_07: {
      CNname: trans('ytMap.PhaseCCurrent'),//C相电流
      mappingKey: '井下运行C相电流',//trans('ytMap.DownPhaseCCurrent')//井下运行C相电流
    },

    //变频器
    B_01: {
      CNname: trans('ytMap.Setfreq'),//设定频率
      mappingKey: '变频器设定频率',//trans('ytMap.InverterSetfreq')//变频器设定频率
    },
    B_02: {
      CNname: trans('ytMap.Operatingfreq'),//运行频率
      mappingKey: '变频器运行频率',//trans('ytMap.InverterOperatefreq')//变频器运行频率
    },
    B_03: {
      CNname: trans('ytMap.outputVoltage'),//输出电压
      mappingKey: '变频器输出电压',//trans('ytMap.InverteroutputVoltage')//变频器输出电压
    },
    B_04: {
      CNname: trans('ytMap.OutputOneVoltage'),//输出一次电流
      mappingKey: '变频器输出一次电流',//trans('ytMap.InverterOutputOneVoltage')//变频器输出一次电流
    },
    //运行记录
    C_01: {
      CNname: trans('ytMap.latStopTime'),//上次停机时间
      mappingKey: "lastStoptime"
    },
    C_02: {
      CNname: trans('ytMap.CumulativeRunTime'),//累积运行时间
      mappingKey: "totalRuntime"
    },
    C_03: {
      CNname: trans('ytMap.DownholeTime'),//下井时间
      mappingKey: "downWelltime"
    },
    C_04: {
      CNname: trans('ytMap.CumulativeDownholeTime'),//累计下井时间
      mappingKey: "downWellRuntime"
    },
    //井下电机
    D_01: {
      CNname: "cos∅",
      mappingKey: "cosc"
    },
    D_02: {
      CNname: "η",
      mappingKey: "eta"
    },
    D_03: {
      CNname: trans('ytMap.ratedpower'),//额定功率
      mappingKey: "ratedPower"
    },
    D_04: {
      CNname: trans('ytMap.power'),//功率
      mappingKey: "power"
    },
    D_05: {
      CNname: trans('ytMap.Load'),//载荷
      mappingKey: "load"
    },
    //井下传感器
    E_01: {
      CNname: trans('ytMap.CLleakageCurrent'),//CL漏电流
      mappingKey: "CL"
    },
    E_02: {
      CNname: trans('ytMap.VersoftVersion'),//Ver软件版本号
      mappingKey: "Ver"
    },
    E_03: {
      CNname: trans('ytMap.RXdownResistance'),//Rx井下绝缘电阻
      mappingKey: "Rx"
    },
    E_04: {
      CNname: trans('ytMap.crccommunicatFailureTimes'),//Crc通讯失败次数
      mappingKey: "Crc"
    },
    // F_01: {
    //   CNname: "控制柜输入电压A相",
    //   mappingKey: "控制柜输入电压A相"
    // },
    // F_02: {
    //   CNname: "控制柜输入电压B相",
    //   mappingKey: "控制柜输入电压B相"
    // },
    // F_03: {
    //   CNname: "控制柜输入电压C相",
    //   mappingKey: "控制柜输入电压C相"
    // },
    F_04: {
      CNname: trans('ytMap.ControlIninputVoltageAB'),//控制柜输入线电压AB
      mappingKey: '控制柜输入线电压AB',//trans('ytMap.ControlIninputVoltageAB')//控制柜输入线电压AB
    },
    F_05: {
      CNname: trans('ytMap.ControlIninputVoltageBC'),//控制柜输入线电压BC
      mappingKey: '控制柜输入线电压BC',//trans('ytMap.ControlIninputVoltageBC')//控制柜输入线电压BC
    },
    F_06: {
      CNname: trans('ytMap.ControlIninputVoltageCA'),//控制柜输入线电压CA
      mappingKey: '控制柜输入线电压CA',//trans('ytMap.ControlIninputVoltageCA')//控制柜输入线电压CA
    },
    F_07: {
      CNname: trans('ytMap.ControlInputACurrent'),//控制柜输入A相电流
      mappingKey: '控制柜输入A相电流',//trans('ytMap.ControlInputACurrent')//控制柜输入A相电流
    },
    F_08: {
      CNname: trans('ytMap.ControlInputBCurrent'),//控制柜输入B相电流
      mappingKey: '控制柜输入B相电流',// trans('ytMap.ControlInputBCurrent')//控制柜输入B相电流
    },
    F_09: {
      CNname: trans('ytMap.ControlInputCCurrent'),//控制柜输入C相电流
      mappingKey: '控制柜输入C相电流',//trans('ytMap.ControlInputCCurrent')//控制柜输入C相电流
    },
    F_10: {
      CNname: trans('ytMap.Inputfreq'),//输入频率
      mappingKey: '电源频率',//trans('ytMap.Powerfreq')//电源频率
    },
    F_11: {
      CNname: trans('ytMap.TotalOperatingPower'),//机组运行总电能
      mappingKey: '机组运行总电能',//trans('ytMap.TotalOperatingPower')//机组运行总电能
    },
    F_12: {
      CNname: trans('ytMap.SystemTotalactivePower'),//系统总有功功率
      mappingKey: '系统总有功功率',//trans('ytMap.SystemTotalactivePower')//系统总有功功率
    },
    F_13: {
      CNname: trans('ytMap.SystemTotalReactivePower'),//系统总无功功率
      mappingKey: '系统总无功功率',//trans('ytMap.SystemTotalReactivePower')//系统总无功功率
    },
    F_14: {
      CNname: trans('ytMap.SystemTotalPowerFactor'),//系统总功率因数
      mappingKey: '系统总功率因数',//trans('ytMap.SystemTotalPowerFactor')//系统总功率因数
    }
  }; //条目的映射关系
  let item = itemList[key];
  if (item === undefined) {
    item = {
      CNname: "",
      mappingKey: null
    };
  }
  return item;
}
// 返回多条线路 ，以数组的形式
//last_id 第一个站点的id
export function setLine (last_id, arr) {
  let lineList = [];
  let temp = [];
  arr.forEach(item => {
    if (item.last_id == last_id) {
      temp.push(item);
    }
  });
  if (temp.length > 0) {
    temp.forEach((current, index) => {
      let sonList = setLine(current.station_id, arr);
      sonList.forEach(item => {
        item.unshift(current);
        lineList.push(item);
      });
    });
  } else {
    lineList = [[]];
  }

  return lineList;
}
const provincesArr = [
  "北京",
  "天津",
  "上海",
  "重庆",
  "河北",
  "山西",
  "辽宁",
  "吉林",
  "黑龙江",
  "江苏",
  "浙江",
  "福建",
  "安徽",
  "江西",
  "山东",
  "河南",
  "湖北",
  "湖南",
  "广东",
  "海南",
  "四川",
  "贵州",
  "云南",
  "陕西",
  "甘肃",
  "青海",
  "台湾",
  "内蒙古",
  "广西",
  "西藏",
  "宁夏",
  "新疆",
  "香港",
  "澳门"
];
const provinces = {
  "1": "北京",
  "2": "天津",
  "9": "上海",
  "22": "重庆",
  "3": "河北",
  "4": "山西",
  "6": "辽宁",
  "7": "吉林",
  "8": "黑龙江",
  "10": "江苏",
  "11": "浙江",
  "13": "福建",
  "12": "安徽",
  "14": "江西",
  "15": "山东",
  "16": "河南",
  "17": "湖北",
  "18": "湖南",
  "19": "广东",
  "21": "海南",
  "23": "四川",
  "24": "贵州",
  "25": "云南",
  "27": "陕西",
  "28": "甘肃",
  "29": "青海",
  "34": "台湾",
  "5": "内蒙古",
  "20": "广西",
  "26": "西藏",
  "30": "宁夏",
  "31": "新疆",
  "32": "香港",
  "33": "澳门",
  "10001": "国外"
};
const countryName = {
  Afghanistan: "阿富汗",
  Singapore: "新加坡",
  Angola: "安哥拉",
  Albania: "阿尔巴尼亚",
  "United Arab Emirates": "阿联酋",
  Argentina: "阿根廷",
  Armenia: "亚美尼亚",
  "French Southern and Antarctic Lands": "法属南半球和南极领地",
  Australia: "澳大利亚",
  Austria: "奥地利",
  Azerbaijan: "阿塞拜疆",
  Burundi: "布隆迪",
  Belgium: "比利时",
  Benin: "贝宁",
  "Burkina Faso": "布基纳法索",
  Bangladesh: "孟加拉国",
  Bulgaria: "保加利亚",
  "The Bahamas": "巴哈马",
  "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
  Belarus: "白俄罗斯",
  Belize: "伯利兹",
  Bermuda: "百慕大",
  Bolivia: "玻利维亚",
  Brazil: "巴西",
  Brunei: "文莱",
  Bhutan: "不丹",
  Botswana: "博茨瓦纳",
  "Central African Republic": "中非共和国",
  Canada: "加拿大",
  Switzerland: "瑞士",
  Chile: "智利",
  China: "中国",
  "Ivory Coast": "象牙海岸",
  Cameroon: "喀麦隆",
  "Democratic Republic of the Congo": "刚果民主共和国",
  "Republic of the Congo": "刚果共和国",
  Colombia: "哥伦比亚",
  "Costa Rica": "哥斯达黎加",
  Cuba: "古巴",
  "Northern Cyprus": "北塞浦路斯",
  Cyprus: "塞浦路斯",
  "Czech Republic": "捷克共和国",
  Germany: "德国",
  Djibouti: "吉布提",
  Denmark: "丹麦",
  "Dominican Republic": "多明尼加共和国",
  Algeria: "阿尔及利亚",
  Ecuador: "厄瓜多尔",
  Egypt: "埃及",
  Eritrea: "厄立特里亚",
  Spain: "西班牙",
  Estonia: "爱沙尼亚",
  Ethiopia: "埃塞俄比亚",
  Finland: "芬兰",
  Fiji: "斐",
  "Falkland Islands": "福克兰群岛",
  France: "法国",
  Gabon: "加蓬",
  "United Kingdom": "英国",
  Georgia: "格鲁吉亚",
  Ghana: "加纳",
  Guinea: "几内亚",
  Gambia: "冈比亚",
  "Guinea Bissau": "几内亚比绍",
  Greece: "希腊",
  Greenland: "格陵兰",
  Guatemala: "危地马拉",
  "French Guiana": "法属圭亚那",
  Guyana: "圭亚那",
  Honduras: "洪都拉斯",
  Croatia: "克罗地亚",
  Haiti: "海地",
  Hungary: "匈牙利",
  Indonesia: "印度尼西亚",
  India: "印度",
  Ireland: "爱尔兰",
  Iran: "伊朗",
  Iraq: "伊拉克",
  Iceland: "冰岛",
  Israel: "以色列",
  Italy: "意大利",
  Jamaica: "牙买加",
  Jordan: "约旦",
  Japan: "日本",
  Kazakhstan: "哈萨克斯坦",
  Kenya: "肯尼亚",
  Kyrgyzstan: "吉尔吉斯斯坦",
  Cambodia: "柬埔寨",
  Kosovo: "科索沃",
  Kuwait: "科威特",
  Laos: "老挝",
  Lebanon: "黎巴嫩",
  Liberia: "利比里亚",
  Libya: "利比亚",
  "Sri Lanka": "斯里兰卡",
  Lesotho: "莱索托",
  Lithuania: "立陶宛",
  Luxembourg: "卢森堡",
  Latvia: "拉脱维亚",
  Morocco: "摩洛哥",
  Moldova: "摩尔多瓦",
  Madagascar: "马达加斯加",
  Mexico: "墨西哥",
  Macedonia: "马其顿",
  Mali: "马里",
  Myanmar: "缅甸",
  Montenegro: "黑山",
  Mongolia: "蒙古",
  Mozambique: "莫桑比克",
  Mauritania: "毛里塔尼亚",
  Malawi: "马拉维",
  Malaysia: "马来西亚",
  Namibia: "纳米比亚",
  "New Caledonia": "新喀里多尼亚",
  Niger: "尼日尔",
  Nigeria: "尼日利亚",
  Nicaragua: "尼加拉瓜",
  Netherlands: "荷兰",
  Norway: "挪威",
  Nepal: "尼泊尔",
  "New Zealand": "新西兰",
  Oman: "阿曼",
  Pakistan: "巴基斯坦",
  Panama: "巴拿马",
  Peru: "秘鲁",
  Philippines: "菲律宾",
  "Papua New Guinea": "巴布亚新几内亚",
  Poland: "波兰",
  "Puerto Rico": "波多黎各",
  "North Korea": "北朝鲜",
  Portugal: "葡萄牙",
  Paraguay: "巴拉圭",
  Qatar: "卡塔尔",
  Romania: "罗马尼亚",
  Russia: "俄罗斯",
  Rwanda: "卢旺达",
  "Western Sahara": "西撒哈拉",
  "Saudi Arabia": "沙特阿拉伯",
  Sudan: "苏丹",
  "South Sudan": "南苏丹",
  Senegal: "塞内加尔",
  "Solomon Islands": "所罗门群岛",
  "Sierra Leone": "塞拉利昂",
  "El Salvador": "萨尔瓦多",
  Somaliland: "索马里兰",
  Somalia: "索马里",
  "Republic of Serbia": "塞尔维亚",
  Suriname: "苏里南",
  Slovakia: "斯洛伐克",
  Slovenia: "斯洛文尼亚",
  Sweden: "瑞典",
  Swaziland: "斯威士兰",
  Syria: "叙利亚",
  Chad: "乍得",
  Togo: "多哥",
  Thailand: "泰国",
  Tajikistan: "塔吉克斯坦",
  Turkmenistan: "土库曼斯坦",
  "East Timor": "东帝汶",
  "Trinidad and Tobago": "特里尼达和多巴哥",
  Tunisia: "突尼斯",
  Turkey: "土耳其",
  "United Republic of Tanzania": "坦桑尼亚",
  Uganda: "乌干达",
  Ukraine: "乌克兰",
  Uruguay: "乌拉圭",
  "United States": "美国",
  Uzbekistan: "乌兹别克斯坦",
  Venezuela: "委内瑞拉",
  Vietnam: "越南",
  Vanuatu: "瓦努阿图",
  "West Bank": "西岸",
  Yemen: "也门",
  "South Africa": "南非",
  Zambia: "赞比亚",
  Korea: "韩国",
  Tanzania: "坦桑尼亚",
  Zimbabwe: "津巴布韦",
  Congo: "刚果",
  "Central African Rep.": "中非",
  Serbia: "塞尔维亚",
  "Bosnia and Herz.": "波黑",
  "Czech Rep.": "捷克",
  "W. Sahara": "西撒哈拉",
  "Lao PDR": "老挝",
  "Dem.Rep.Korea": "朝鲜",
  "Falkland Is.": "福克兰群岛",
  "Timor-Leste": "东帝汶",
  "Solomon Is.": "所罗门群岛",
  Palestine: "巴勒斯坦",
  "N. Cyprus": "北塞浦路斯",
  Aland: "奥兰群岛",
  "Fr. S. Antarctic Lands": "法属南半球和南极陆地",
  Mauritius: "毛里求斯",
  Comoros: "科摩罗",
  "Eq. Guinea": "赤道几内亚",
  "Guinea-Bissau": "几内亚比绍",
  "Dominican Rep.": "多米尼加",
  "Saint Lucia": "圣卢西亚",
  Dominica: "多米尼克",
  "Antigua and Barb.": "安提瓜和巴布达",
  "U.S. Virgin Is.": "美国原始岛屿",
  Montserrat: "蒙塞拉特",
  Grenada: "格林纳达",
  Barbados: "巴巴多斯",
  Samoa: "萨摩亚",
  Bahamas: "巴哈马",
  "Cayman Is.": "开曼群岛",
  "Faeroe Is.": "法罗群岛",
  "IsIe of Man": "马恩岛",
  Malta: "马耳他共和国",
  Jersey: "泽西",
  "Cape Verde": "佛得角共和国",
  "Turks and Caicos Is.": "特克斯和凯科斯群岛",
  "St. Vin. and Gren.": "圣文森特和格林纳丁斯"
};
export {
  codeObj,
  defaultCode,
  defaultCode1,
  posTypeName,
  getTime,
  round,
  getTimeOfType,
  setConditionAlarm,
  cloneObj,
  getUnit,
  getUnit1,
  isVibOfPos,
  setMacMsg,
  setPosMsg,
  setHead,
  hasClass,
  addClass,
  removeClass,
  changeClass,
  makeWaveY,
  integralFft,
  sortMachine,
  setSrcSpectrum,
  initStringVal,
  provinces,
  countryName,
  provincesArr
};
