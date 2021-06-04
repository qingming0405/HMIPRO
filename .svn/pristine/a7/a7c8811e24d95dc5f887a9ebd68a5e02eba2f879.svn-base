<!-- 报告模板 -->
<template>
   <div class='my-report-template' v-if='viewWord()'>
      <!-- 封面 -->
      <div class="WordSection1" ref='WordSection1'>
         <p>&nbsp;</p>
         <div align="center"><img src="assets/images/1.png" height="120px" width="120px"></div>
         <p>&nbsp;</p>
         <div style="border-radius:5px;background:#61d6ff;height:4pt;max-line-height:4pt;font-size:4pt;opacity:0.36;">&nbsp;</div>
         <p>&nbsp;</p>
         <p>&nbsp;</p>
         <div style="font-size:24pt;font-weight:bold;text-align:center;">
            <div>{{reportMsg[tId][macFlag].tName}}</div>
            <div><span style="font-family:Times New Roman;">{{reportMsg[tId].exportMsg.time.val}}</span></div>
            <div>振动分析报告</div>
         </div>
         <p>&nbsp;</p>
         <div style="border-radius:5px;background:#61d6ff;height:4pt;max-line-height:4pt;font-size:4pt;opacity:0.36;">&nbsp;</div>
         <div style="color:#0070c0;font-size:14pt;text-align:center;font-weight:bold;">
            <p>编制：{{reportMsg[tId].exportMsg.compiler.val}}</p>
            <p>校核：{{reportMsg[tId].exportMsg.checker.val}}</p>
            <p>审批：{{reportMsg[tId].exportMsg.reviewer.val}}</p>
            <p>&nbsp;</p>
            <p>浙江中自安庆新能源技术有限公司</p>
            <p>诊断中心&nbsp;&nbsp;<span style="font-family:Times New Roman;">4000093668-7</span></p>
            <p><span style="font-family:Times New Roman;">{{}}</span>年<span style="font-family:Times New Roman;">{{}}</span>月<span style="font-family:Times New Roman;">{{}}</span>日</p>
         </div>
      </div>
      <!-- 目录 -->
      <div class="WordSection2 list" ref='WordSection2'>
         <p align="center" style="font-size:16pt;font-weight:bold;line-height:50px;height:50px;">目录</p>
      </div>
      <div class="WordSection3">
         <!--项目概述-->
         <div>
               <h1 style="line-height:50px;height:50px;font-size:16pt;font-family:黑体;"><a name="_itemSummary">1 项目概述</a></h1>
               <p style="text-indent:24pt;font-size:12pt;line-height:150%;"></p>
               <div class="itemSummaryImg" align="center" style="height:220px;width:550px;"><img src="" height="220" width="550" style="width:550px;height:220px;"></div>
         </div>
         <!--测点安装及配置-->
         <div>
            <!--<p style="font:bold 16pt 黑体;"><a name="_setConfigure">2</a>&nbsp;测点安装及配置</p>-->
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a
   name="_setConfigure"><span style='mso-bookmark:_setConfigure;font-family:黑体'>2 </span></a><span
   style='mso-bookmark:_setConfigure;font-family:黑体'>测点安装及配置</span></h1>
            <div style="text-indent:24pt;font-size:12pt;line-height:150%;">各机组上安装有传感器{{}}个，各测点配置如下表所示：</div>
            <div align="center">
               <table style="border-collapse:collapse;width:90%;text-align:center;border:1pt solid #8064a2;">
                  <tbody>
                  <tr style="background:#8064a2;color:#fff;">
                  </tr>
                  <tr>
                  </tr>
                  </tbody>
               </table>
            </div>
         </div>
         <!--评估标准-->
         <div>
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a
   name="_standard"><span style='mso-bookmark:_standard;font-family:黑体'>3 </span></a><span
   style='mso-bookmark:_standard;font-family:黑体'>评估标准</span></h1>
            <div style="line-height:150%;text-indent:24pt;font-size:12pt;">本报告根据《VDI3834风力发电机组振动控制标准》，并结合现场机组整体运行情况对机组运行状况进行评估，各测点振动报警值如下表所示：</div>
            <div align="center">
               <table
                        style="border-collapse:collapse;width:100%;text-align:center;border:1pt solid #4bacc6;font-weight:bold;">
                  <tbody style="font-size:10.5pt;">
                  <tr style="background:#4bacc6;color:#fff;">
                        <td style="width:16.6%;">组件</td>
                        <td style="width:16.6%;" >{{}}</td>
                  </tr>
                  <tr style="font-family:Times New Roman;height:20px;">
                        <td style="border:1pt solid #4bacc6;">评估加速度<br>(g)</td>
                        <td style="border:1pt solid #4bacc6;" ><span style="color:#ffc000">{{}}</span>/<span style="color:#ff0000;">{{}}</span></td>
                  </tr>
                  </tbody>
               </table>
            </div>
         </div>
         <!--分析结论-->
         <div>
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a name="_analysisConclusion"><span style='mso-bookmark:_nalysisConclusion;font-family:黑体' lang=EN-US>{{}} </span></a><span
   style='mso-bookmark:_analysisConclusion;font-family:黑体'>分析结论</span></h1>
            <div style="font-size:12pt;text-indent:24pt;line-height:150%;">评估依据：结合当前风况和CS2000 振动监测系统所测得振动数据，以及时域波形图、频谱图、包络谱图、趋势图。</div>
            <table style="border-collapse:collapse;text-align:center;border:1pt solid #4bacc6;width:100%;">
               <tbody style="font-size:10.5pt;">
               <tr style="font-weight:bold;background:#4bacc6;">
                  <td style="width:10%;" rowspan=2>机组编号</td>
                  <td style="width:20%;">测点布置</td>
                  <td style="width:30%;" rowspan=2>分析结论</td>
                  <td style="width:10%;" rowspan=2>{{}}</td>
               </tr>
               <tr style="font-weight:bold;background:#4bacc6;">
                  <td style="width:10%;">{{}}</td>
               </tr>
               <tr>
                  <td style="font-family:Times New Roman;border:1pt solid #4bacc6;">{{}}</td>
                  <td style="border:1pt solid #4bacc6;">{{}}</td>
                  <td style="border:1pt solid #4bacc6;"></td>
                  <td style="border:1pt solid #4bacc6;">{{}}</td>
               </tr>
               <tr style="text-align:left;text-indent:24pt;">
                  <td colspan="6">
                     <div style="line-height:170%;margin-top:10px;">备注：故障诊断说明</div>
                     <div style="line-height:170%;" v-for='(item, index, key) in falutExplan' :key=key><span :style="item.style">{{item.name}}</span>{{item.val}}</div>
                     <!-- <div style="line-height:170%;"><span style="background:#0f0;">{{}}</span>{{}}</div>
                     <div style="line-height:170%;"><span style="background:#0ff;">{{}}</span>{{}}</div>
                     <div style="line-height:170%;"><span style="background:#ff0;">{{}}</span>{{}}</div>
                     <div style="line-height:170%;"><span style="background:#f0f;">{{}}</span>{{}}</div>
                     <div style="line-height:170%;"><span style="background:#f00;">{{}}</span>{{}}</div> -->
                  </td>
               </tr>
               </tbody>
            </table>
         </div>
         <!--处理建议-->
         <div>
               <!--<p style="font:bold 16pt 黑体;"><a name="_advice">5</a>&nbsp;处理建议</p>-->
               <h1 style='line-height:50px;height:50px;font-size:16pt;'><a
      name="_advice"><span lang=EN-US style='font-family:黑体'>{{}} </span></a><span style='mso-bookmark:_advice;font-family:黑体'>处理建议</span></h1>
               <table style="text-align:center;width:100%;font-size:12pt;border:1pt solid #000;border-collapse:collapse;">
                  <thead>
                     <tr>
                        <td colspan=2 style="font-weight:bold;">{{}}</td>
                     </tr>
                  </thead>
                  <tbody>
                  <tr>
                     <td style="width:20%;border:1pt solid #000;">机组编号</td>
                     <td style="width:80%;border:1pt solid #000;">处理建议</td>
                  </tr>
                  <tr>
                     <td style="border:1pt solid #000;">{{}}</td>
                     <td style="text-align:left;border:1pt solid #000;">
                           <div style="line-height:150%;font-weight:bold;">➢&nbsp; 处理建议</div>
                           <div></div>
                     </td>
                  </tr>
                  </tbody>
               </table>
         </div>
         <!--故障机组详细分析-->
         <div id="analysis">
               <!--<p>&nbsp;</p>-->
               <!--<p style="font:bold 16pt 黑体;"><a name="_analysis">6</a>&nbsp;故障机组详细分析</p>-->
               <h1 style='line-height:50px;height:50px;font-size:16pt;'><a name="_analysis"><span lang=EN-US
      style='mso-bookmark:_analysis;font-family:黑体;'>{{}} </span></a><span style='mso-bookmark:_analysis;font-family:黑体'>故障机组详细分析</span></h1>
               <div>
                  <p style="font:bold 15pt 黑体;"><span style="font-family:Times New Roman;">6.{{}}&nbsp;</span>{{}}机组</p>
                  <div style="line-height:150%;"></div>
                  <div style="line-height:150%;">结论：<span></span></div>
                  <div class="analysis" align="center" style="width:600pt;height:300pt">
                     <img src="" alt="" width=700 height=300 style='height:280pt;width:600pt;'>
                     <div align="center">{{}}</div>
                  </div>
               </div>
         </div>
         <!--故障机组详细分析-->
         <div id="analysis" ref='analysis'>
            <!--<p>&nbsp;</p>-->
            <!--<p style="font:bold 16pt 黑体;"><a name="_analysis">6</a>&nbsp;故障机组详细分析</p>-->
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a name="_analysis"><span lang=EN-US
   style='mso-bookmark:_analysis;font-family:黑体;'>{{}} </span></a><span style='mso-bookmark:_analysis;font-family:黑体'>故障机组详细分析</span></h1>
            <div>
               <p style="font:bold 15pt 黑体;"><span style="font-family:Times New Roman;">6.{{}}&nbsp;</span>{{}}机组</p>
               <div style="line-height:150%;"></div>
               <div style="line-height:150%;">结论：<span></span></div>
               <div class="analysis" align="center" style="width:600pt;height:300pt">
                  <img src="" alt="" width=700 height=300 style='height:280pt;width:600pt;'>
                  <div align="center">{{}}</div>
               </div>
            </div>
         </div>
         <!--正常机组振动数据-->
         <div id="normal" ref='normal1'>
            <!--<p style="font:bold 16pt 黑体;"><a name="_vibrationData">7</a>&nbsp;正常机组振动数据</p>-->
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a name="_vibrationData"><span style='mso-bookmark:_vibrationData;font-family:黑体;'>{{}} </span></a><span style='mso-bookmark:
   _vibrationData;font-family:黑体'>正常机组振动数据</span></h1>
            <table style="border-collapse:collapse;border:1pt solid #000;text-align:center;width:100%;" class="normalTable">
               <thead>
                  <tr>
                        <td style="border:1pt solid #000;">
                           {{}}
                        </td>
                  </tr>
               </thead>
               <tbody style="font-family:Times New Roman;">
               <tr>
                  <td style="border:1pt solid #000;">
                        {{}}
                  </td>
                  <td style="border:1pt solid #000;">
                        {{}}
                  </td>
               </tr>
               </tbody>
            </table>
         </div>
         <!--补充说明-->
         <div>
            <!--<p style="font:bold 16pt 黑体;"><a name="_instruction">8</a>&nbsp;补充说明</p>-->
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a name="_instruction"><span lang=EN-US
   style='font-family:黑体'>8 </span></a><span style='mso-bookmark:_instruction'><span
   style='font-family:黑体'>补充说明</span></span></h1>
            <div style="line-height:150%;margin-left:30.0pt;text-align:justify;text-indent:-30.0pt;" v-for='(item, index, key) in explan' :key=key>
               {{item}}
            </div>
            <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
            <div style="line-height:150%;" v-for='(item, index, key) in information' :key=key>{{item}}</div>
         </div>
         <!--附件一-->
         <div id="enclosure1" ref='enclosure1'>
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a
   name="_Toc492892586"><span style='mso-bookmark:_enclosure1;font-family:黑体;mso-ascii-font-family:
   "Times New Roman";mso-hansi-font-family:"Times New Roman"'>附</span></a><span style='mso-bookmark:_enclosure1;font-family:
   宋体;mso-ascii-font-family:"Times New Roman";mso-hansi-font-family:"Times New Roman"'>一</span><span style='mso-bookmark:_enclosure1;font-family:黑体;mso-ascii-font-family:
   "Times New Roman";mso-hansi-font-family:"Times New Roman"'>：典型滚动轴承故障原因分析</span></h1>
            <div style="line-height:150%;text-indent:28pt;">滚动轴承损伤过程是逐步发展的，且一旦发生，会随着旋转运行而扩散，同时振动会明显增加。引起轴承损伤的原因主要有以下几点：</div>
            <table style="text-align:center;border:1pt solid #000;border-collapse:collapse;width:100%;vertical-align:middle;">
               <tbody>
               <tr style="font-weight:bold;">
                  <td style="border:1pt solid #000;width:15%;">
                        故障类型
                  </td>
                  <td style="border:1pt solid #000;" colspan="2">
                        原因
                  </td>
               </tr>
               <tr>
                  <td rowspan="7" style="border:1pt solid #000;font-weight:bold;">
                        轴承磨损
                  </td>
                  <td style="border:1pt solid #000;width:20%;">
                        安装设计不当
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           没有按正确的安装方法安装轴承，把轴承安装在有椭圆度及锥度的箱体孔时，使轴承产生变形；或者把轴承安装到有椭圆形及锥形的轴颈上时，使轴承也产生变形；轴承外圈与箱体孔配合处落入金属小颗粒，或者内圈与轴顼处落入金属小颗粒，使轴承产生变形；安装轴承外圈的箱体孔中心线对安装轴承内圈的轴中心线歪斜，使轴承在运转中产生别劲”、发热或者磨拟过快；采用加热法安转时，轴承加热温度太高超过规定加热温度，使轴承退火，硬度降低等安装不合理都会造成轴承磨损。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        过负荷
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           轴承过负荷将引起轴承的过早疲劳，使轴承过早磨损而达不到使用设计使用寿命。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        过热
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           轴承温度超过400F时将使滚道和滚动体材料退火，从而使硬度降低导致轴承承重降低和早期失效。严重情况下引起变形，另外温升降低和破坏润滑性能。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        污染
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           当工作环境比较恶劣时，轴承在运行过程中混入杂质从而导致滚道和滚动体表面有点痕，造成轴承振动加大和磨损。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        润滑油失效
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           当轴承润滑油不足或者温度过高时润滑油质量下降时，使轴承各部件之间的油膜遭到破坏，从而使轴承各部件之间相互磨损。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        腐蚀
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           轴承接触腐蚀性流体和气体时会引起轴承早期疲劳磨损。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        配合松动
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           轴承各部件之间的配合松动将导致轴承磨损，并且磨损产生的颗粒将使研磨和松动进一步增大，导致轴承磨损加大。
                        </div>
                  </td>
               </tr>
               </tbody>
            </table>
         </div>
         <!--附件二-->
         <div id="enclosure2">
            <!--<p style="font:bold 16pt 黑体;"><a name="_enclosure2">附二：</a>典型齿轮箱故障原因分析</p>-->
            <h1 style='line-height:50px;height:50px;font-size:16pt;'><a
   name="_enclosure2"><span style='font-family:黑体;mso-ascii-font-family:
   "Times New Roman";mso-hansi-font-family:"Times New Roman"'>附二：典型齿轮箱故障原因分析</span></a></h1>
            <table style="text-align:center;border:1pt solid #000;border-collapse:collapse;width:100%;vertical-align:middle;">
               <tbody>
               <tr style="font-weight:bold;">
                  <td style="border:1pt solid #000;width:20%;">
                        故障类型
                  </td>
                  <td style="border:1pt solid #000;" colspan="2">
                        原因
                  </td>
               </tr>
               <tr>
                  <td rowspan="4" style="border:1pt solid #000;font-weight:bold;">
                        齿轮啮合不良
                  </td>
                  <td style="border:1pt solid #000;width:15%;">
                        齿面磨损
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           齿面磨损主要包括由于灰砂、硬屑粒等进入齿面间而引起的磨粒性磨损和因齿面互相摩擦而产生的跑合性磨损。磨损后齿廓失去正确形状使运转中产生冲击和噪声。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        齿面点蚀
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           相互啮合的两轮齿接触时，齿面间的作用力和反作用力使两工作表面上产生接触应力，由于啮合点的位置是变化的，且齿轮做的是周期性的运动，所以接触应力是按脉动循环变化的。齿面长时间在这种交变接触应力作用下，在齿面的刀痕处会出现小的裂纹，随着时间的推移，这种裂纹逐渐在表层横向扩展，裂纹形成环状后，使轮齿的表面产生微小面积的剥落而形成一些疲劳浅坑。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        齿面胶合
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           在高速重载传动中，常因啮合温度升高而引起润滑失效，致使两齿面金属直接接触并相互粘联。当两齿面相对运动时，较软的齿面沿滑动方向被撕裂出现沟纹，这种现象称为胶合。在低速重载传动中，由于齿面间不易形成润滑油膜也可能产生胶合破坏。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;">
                        塑性变形
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           在冲击载荷或重载下，齿面易产生局部的塑性变形，从而使渐开线齿廓的曲面发生变形。
                        </div>
                  </td>
               </tr>
               <tr>
                  <td style="border:1pt solid #000;font-weight:bold;">
                        齿轮不对中
                  </td>
                  <td style="border:1pt solid #000;">
                        装配误差
                  </td>
                  <td style="border:1pt solid #000;">
                        <div style="text-align:justify;margin:5px 5px 0;line-height:120%;">
                           由于装配技术和装配方法等原因通常会引起齿轮“一端接触”和齿轮轴的直线性偏差（不同轴，不对中）及齿轮的不平衡等故障。
                        </div>
                  </td>
               </tr>
               </tbody>
            </table>
         </div>
      </div>
   </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import jq from 'jquery';
import Save from '@/assets/js/FileSaver.js';

export default {
  // import引入的组件需要注入到对象中才能使用
   components: {},
   data() {
      return {
         explan: [ /* 补充说明 */
            '（1）本报告涂改无效。',
            '（2）需要委托方提供机组详细的传动链参数（主轴承参数、齿轮箱参数、发电机参数、偏航系统参数）以保证报告的准确性。',
            '（3）未经本中心书面许可，部分复制、摘用或篡改本报告内容，引起法律纠纷，责任自负。',
            '（4）本检测报告是基于对机组所安装的CS2000系统的振动数据所获得的信息而编制的，因此，本报告对机组状态所做分析仅供参考。浙江中自庆安新能源技术有限公司给出的所有信息、忠告和建议都仅是基于我们的观察、分析和经验。对于设备状况的最终判断以及所需采取的维护措施，由用户自行决定。',
            '（5）对检测报告若有异议，请于收到报告之日起一个月内向本中心提出，逾期不再受理。',
         ],
         information: [ /* 联系方式 */
            '地址：杭州经济技术开发区6号路260号中自科技园',
            '邮编：310018',
            '电话：0571-28995840',
            '传真：0571-28995841',
         ],
         falutExplan: [ /* 故障诊断说明 */
            {name: '正常', val: '运行状态处于正常状态，机组可照常运行；', style: {background: '#0f0'},},
            {name: '注意', val: '机组存在早期故障特征，可照常运行，应关注机组运行状况，加强日常检查和维护；', style: {background: '#0ff'},},
            {name: '警告', val: '机组存在较明显的故障特征，机组可继续运行，现场维护人员需在2个月内检查确认故障，择机进行维修措施；', style: {background: '#ff0'},},
            {name: '报警', val: '机组故障特征明显，故障处于劣化期，现场维护人员需在2周内检查确认故障，择机进行维修措施；', style: {background: '#f0f'},},
            {name: '危险', val: '机组故障严重，须立即停机进行检查，采取维修措施。', style: {background: '#f00'},},
         ],
         tId: '',
         macFlag: '',
         reportMsg: {},
      };
   },
   computed: {},
   watch: {},
   methods: {
      // 导出报告
      exportReport(tId, macFlag) {
         /* this.reportMsg = this.$store.state.reportMsg;
         this.tId = tId;
         this.macFlag = macFlag; */
      },
      // 设置word信息
      setReport() {
         const page = "<br clear=all style='mso-special-character:line-break;page-break-before:always'>";
         let list = "\n";
            list += '<p class="MsoToc1" style="height:30px;line-height:30px;">\n';
            list += "<!--[if supportFields]>\n";
            list += "<span style='mso-element:field-begin'></span>";
            list += 'TOC o "1-3" \\u';
            list += "<span style='mso-element:field-separator'></span>\n";
            list += '<![endif]-->\n';
            list += '<span style="mso-no-proof:yes">Table of content - Please right-click and choose "Update fields".</span>\n';
            list += '<!--[if supportFields]>\n';
            list += "<span style='mso-element:field-end'></span>\n";
            list += '<![endif]-->\n';
            list += '</p>\n';
            list += page;
         const initial = {
            mhtml: {
               top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
               head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
               body: "<body>_body_</body>"
            }
         }
         jq(this.$refs.WordSection1).append(page);
         jq(this.$refs.analysis).append(page);
         jq(this.$refs.normal1).append(page);
         jq(this.$refs.enclosure1).append(page);
         jq(this.$refs.WordSection2).append(list);
         const el = jq(this.$el).clone();
         el.each(function()  {
            const self = jq(this);
            if (jq(this).is(':hidden')) self.remove();
         })
         const images = [];
         const img = el.find('img');
         for (let i = 0, l = img.length; i < l; i++) {
            const imgVal = img[i];
            const w = Math.min(imgVal.width, 800);
            const h = imgVal.height * (w / imgVal.width);
            let uri = '';
            jq(imgVal).attr("crossOrigin", 'Anonymous');
            if (imgVal.src.slice(0, 4) !== 'data') {
               const canvas = document.createElement("CANVAS");
               canvas.width = w;
               canvas.height = h;
               const context = canvas.getContext('2d');
               context.drawImage(imgVal, 0, 0, w, h);
               uri = canvas.toDataURL("image/png");
               jq(imgVal).attr("src", imgVal.src);
               imgVal.width = w;
               imgVal.height = h;
            } else {
               uri = imgVal.src;
            }
            images.push({
               type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
               encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
               location: jq(img[i]).attr("src"),
               data: uri.substring(uri.indexOf(",") + 1)
            })
         }
         let mhtmlBottom = '\n';
         for (let i = 0, l = images.length; i < l; i++) {
            const imgVal = images[i];
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
            mhtmlBottom += `Content-Location: ${imgVal.location}\n`;
            mhtmlBottom += `Content-Type: ${imgVal.type}\n`;
            mhtmlBottom += `Content-Transfer-Encoding: ${imgVal.encoding}\n\n`;
            mhtmlBottom += `${imgVal.data}\n\n`;
         }
         mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";
         let headFoot = el.html();
         headFoot += '\n<table id="googoose-hdrftrtbl" width="550"><tbody><tr><td class="h">\n';
         headFoot += '<div style="mso-element:header" id="googoose-header1">&nbsp;</div>';
         headFoot += '<div style="mso-element:footer" id="googoose-footer1">&nbsp;</div>';
         headFoot += '<div style="mso-element:header" id="googoose-header3">\n';
         headFoot += '<p class="MsoHeader">\n';
         headFoot += '</p><div class="googoose header"><table style="width:100%;border-bottom:1px solid #000;"><tr><td style="width:50%;"><img width="60" height="60" src="img/wordText/image008.jpg" alt=""></td><td style="width:50%;" align="right"><i style="color:#0070C0;font-family:黑体;font-size:12pt;"><div><span>咨询电话：</span><span style="font-family:Times New Roman;">4000093668-7</span></div><div><span>网站：</span><span style="font-family:Times New Roman;">www.windit.com.cn</span></div></i></td></tr></table></div><p>\n';
         headFoot += '</p>\n</div>\n';
         headFoot += '</td><td class="f"><div style="mso-element:footer" id="googoose-footer3"><div class="googoose footer"><span class="googoose currentpage">';
         headFoot += '<table style="border-top:1px solid #000;"><tr><td style="font-size:9pt;width:530px;">';
         headFoot += '<div style="margin-bottom:10px;width:520px;">◆版权所有<span style="font-family:Times New Roman;"> © 2018-2020 </span>浙江中自庆安新能源技术有限公司</div>';
         headFoot += '<div>◆我们保留本文档和信息的全部所有权利。未经明示授权，严禁复制、使用或披露给第三方。</div>';
         headFoot += '</td><td align="right" style="width:180px;"><img align="right" style="margin:0;" src="img/wordText/image009.png" width="170" height="33"></td></tr><tr><td colspan="2" style="font-size:14pt;font-family:Times New Roman;font-weight:bold;padding-right:20px;" align="right">';
         headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-begin'>";
         headFoot += "</span><span style='mso-spacerun:yes'>";
         headFoot += "</span>PAGE <span style='mso-element:field-separator'></span></span><![endif]-->";
         headFoot += '<span class="MsoPageNumber"><span style="mso-no-proof:yes">-1</span></span>';
         headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-end'></span></span><![endif]--> / ";
         headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-begin'></span> NUMPAGES <span style='mso-element:field-separator'></span></span><![endif]-->";
         headFoot += '<span class="MsoPageNumber"><span style="mso-no-proof:yes">-1</span></span>';
         headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-end'></span></span><![endif]-->\n";
         headFoot += '</td></tr></table></span></div></div></td></tr></tbody></table>';
         let styles = "<!--\n" +
            "@page {\n" +
            "\tsize:8.5in 11.0in;\n" +
            "\tmargin:1.0in 0.7in;\n" +
            "}\n" +
            "@page WordSection1 {\n" +
            "\tmso-header-margin:.3in;\n" +
            "\tmso-footer-margin:.3in;\n" +
            "\tmso-title-page:yes;\n" +
            "\tmso-header:googoose-header1;\n" +
            "\tmso-footer:googoose-footer1;\n" +
            "}\n" +
            "div.WordSection1 { page:WordSection1; }\n" +
            "@page WordSection2 {\n" +
            "\tmso-header-margin:.3in;\n" +
            "\tmso-footer-margin:.3in;\n" +
            "\tmso-page-numbers:1;\n" +
            "\tmso-header:googoose-header2;\n" +
            "\tmso-footer:googoose-footer2;\n" +
            "}\n" +
            "div.WordSection2 { page:WordSection2; }\n" +
            "@page WordSection3 {\n" +
            "\tmso-header-margin:.3in;\n" +
            "\tmso-footer-margin:.3in;\n" +
            "\tmso-header:googoose-header3;\n" +
            "\tmso-footer:googoose-footer3;\n" +
            "}\n" +
            "div.WordSection3 { page:WordSection3; }\n" +
            "table#googoose-hdrftrtbl {\n" +
            "\tmargin:0in 0in 0in 9in;\n" +
            "}\n" +
            "-->";
         const fileContent = initial.mhtml.top.replace("_html_", initial.mhtml.head.replace("_styles_", styles) + initial.mhtml.body.replace("_body_", headFoot)) + mhtmlBottom;
         const blob = new Blob([fileContent], {
            type: 'application/ms-word;charset=utf-8'
         });
         Save.saveAs(blob, "诊断报告.doc");
         jq(this.$refs.WordSection1).children().last().remove();
         jq(this.$refs.analysis).children().last().remove();
         jq(this.$refs.normal1).children().last().remove();
         jq(this.$refs.enclosure1).children().last().remove();
         jq(this.$refs.WordSection2).children().last().remove();
      },
      // 是否显示内容
      viewWord() {
         return Object.keys(this.reportMsg).length > 0;
      },
   },
   mounted() {
      // this.exportReport();
   },
}
</script>
<style scoped lang='scss'>
</style>
