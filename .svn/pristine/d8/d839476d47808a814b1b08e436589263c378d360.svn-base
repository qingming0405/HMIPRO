<!-- 统计列表 -->
<template>
  <div class="my-census-chart-list select-none">
    <div
      class="census-chart-list"
      v-for="(data, key) in censusData"
      :key="key"
      v-show="data.isShow"
    >
      <div class="census-screen radius box-shadow">
        <div class="screen-title">筛选条件</div>
        <ul class="screen-list">
          <li
            v-show="idx !== 5 || (idx === 5 && data.unitShow)"
            v-for="(item, idx) in data.viewMsg"
            :key="idx"
          >
            <div class="list-name radius">{{ item.name }}</div>
            <div
              class="list-val radius text-overflow select-box"
              @click="changeTreeType(idx, $event)"
              v-if="idx === 0"
              :title="data.checkTree.name"
              :class="item.class"
            >
              <input
                class="outsize-border"
                type="text"
                :placeholder="data.checkTree.name"
                v-model="searchtree"
              />
              <i class="iconfont icon-zhongzi-zhankai"></i>
            </div>
            <div
              class="list-val radius text-overflow select-box"
              @click="setList(idx, $event)"
              v-if="(idx < 7 && idx !== 4 && idx !== 0) || idx === 9"
              :title="item.msg"
              :class="item.class"
            >
              {{ item.msg }}
              <i class="iconfont icon-zhongzi-zhankai"></i>
            </div>
            <input
              type="text"
              class="list-val radius"
              v-if="idx === 4"
              v-model="item.msg"
              placeholder="请输入比例：*%或*个"
            />
            <input
              class="list-val radius text-overflow"
              :class="'start-time' + key"
              v-if="idx === 7"
            />
            <input
              class="list-val radius text-overflow"
              :class="'end-time' + key"
              v-if="idx === 8"
            />
            <div
              v-if="idx === 10"
              class="list-speed"
            >
              <input
                class="set-speed radius"
                type="number"
                v-model="item.msg[0]"
                @input="setLength(item.msg[0], 6, item.msg, 0)"
              />
              -
              <input
                class="set-speed radius"
                type="number"
                v-model="item.msg[1]"
                @input="setLength(item.msg[1], 6, item.msg, 1)"
              />
            </div>
            <div
              v-if="idx === 11"
              class="list-condition"
            >
              <ul>
                <li
                  v-for="(con, id) in item.msg"
                  :key="id"
                >
                  <label :for="'con' + key + id">
                    <i :class="setClass(con.isCheck, 'check')"></i>
                    {{ con.name }}
                  </label>
                  <input
                    type="checkbox"
                    :id="'con' + key + id"
                    class="hide"
                    v-model="con.isCheck"
                  />
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="get-data-btn">
          <button @click="setRequestData">数据筛选</button>
        </div>
      </div>
      <div class="chart-list-box radius box-shadow">
        <div class="chart-list-title">
          {{ data.isList ? "统计列表" : "统计图谱" }}
        </div>
        <div class="chart-list-btn">
          <button @click.stop="exportData">导出</button>
          <a
            href=""
            class="hide"
            ref="exportData"
          ></a>
          <button>
            <label :for="'changeChart' + key">
              {{ data.isList ? "柱状图" : "列表图" }}
            </label>
          </button>
          <input
            type="checkbox"
            :id="'changeChart' + key"
            v-model="data.isList"
            class="hide"
            @change="changeChart"
          />
        </div>
        <div
          class="my-census-list radius"
          v-show="data.isList"
        >
          <ul class="census-list-head-pos">
            <li
              v-for="(item, idx) in data.viewList.head"
              :key="idx"
            >
              {{ item }}
            </li>
          </ul>
          <ul class="hide-scroll census-list-body-pos">
            <li
              v-for="(item, idx) in data.viewList.body"
              :key="idx"
              @dblclick="toTrend(item)"
            >
              <div>{{ idx + 1 }}</div>
              <div :title="item.code">{{ item.code }}</div>
              <div :title="item.value">{{ item.value }}</div>
              <div
                :title="item.tName"
                class="text-overflow"
              >
                {{ item.tName }}
              </div>
              <div
                :title="item.macName"
                class="text-overflow"
              >
                {{ item.macName }}
              </div>
              <div
                :title="item.posName"
                v-show="item.posName !== ''"
                class="text-overflow"
              >
                {{ item.posName }}
              </div>
            </li>
          </ul>
          <div
            class="none-data-box radius"
            v-show="data.showEmpty"
          >
            <div>无数据</div>
          </div>
        </div>
        <div
          class="my-census-chart radius"
          v-show="!data.isList"
        >
          <div
            class="none-data-box radius"
            v-show="data.showEmpty"
          >
            <div>无数据</div>
          </div>
          <div
            ref="myCensusChart"
            class="census-chart"
          ></div>
        </div>
      </div>
    </div>
    <!-- 多选弹窗 -->
    <div
      class="census-list-box"
      v-show="checkList.isShow"
      @click.stop="getCheck"
    >
      <ul
        class="my-census-lists radius box-shadow hide-scroll"
        :style="checkList.style"
      >
        <li>
          <input
            type="text"
            v-model="searchMsg"
            class="search-msg"
            :placeholder="placeholder"
          />
        </li>
        <li
          v-for="(item, index) in checkList.text"
          :key="index"
          :title="item.val"
          :class="setClass(item.isOpen, 'isOpen')"
        >
          <label
            :for="'isOpen' + index"
            v-show="item.hasOpen && !item.isAll"
          >
            <i
              class="my-icon"
              :class="setClass(item.isOpen, 'open')"
            ></i>
          </label>
          <label
            :for="'isCheck' + index"
            :class="setClass(item.hasOpen, 'hasOpen')"
            v-show="!item.isAll"
          >
            <i
              class="my-icon"
              :class="setClass(item.isCheck, 'check')"
            ></i>
          </label>
          <span
            v-show="item.isAll"
            class="check-list-val"
            @click="checkAll(item)"
          >{{ item.val }}</span>
          <span v-show="!item.isAll">{{ item.val }}</span>
          <input
            class="hide"
            type="checkbox"
            :id="'isOpen' + index"
            v-model="item.isOpen"
          />
          <input
            class="hide"
            type="checkbox"
            :id="'isCheck' + index"
            v-model="item.isCheck"
            @click="checkAllChild(item)"
          />
          <ul
            class="my-child-list"
            v-show="item.isChild && item.isOpen"
          >
            <li
              v-for="(data, idx) in item.child"
              :key="idx"
              :title="data.val"
            >
              <label :for="'childCheck' + index + idx">
                <i
                  class="my-icon"
                  :class="setClass(data.isCheck, 'check')"
                ></i>
              </label>
              {{ data.val }}
              <input
                class="hide"
                type="checkbox"
                :id="'childCheck' + index + idx"
                v-model="data.isCheck"
                @click="checkItem(item)"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import common from './censusCommon'
export default {
  mixins: [common],
}
</script>
<style scoped lang="scss">
.my-census-chart-list {
  height: 100%;
  width: 100%;
  .census-chart-list {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 380px auto;
    grid-column-gap: 10px;
    .census-screen {
      text-align: center;
      height: 100%;
      width: 100%;
      .screen-title {
        font-size: 20px;
        margin: 5% 0;
      }
      .screen-list {
        height: calc(100% - 10% - 40px);
        display: grid;
        grid-template-rows: repeat(12, 7.6%);
        li {
          display: grid;
          grid-template-columns: calc(30% - 10px) calc(70% - 10px);
          grid-column-gap: 20px;
          align-items: center;
          .list-name {
            text-align: right;
          }
          .list-val,
          .list-speed,
          .list-condition {
            text-align: left;
            width: 220px;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
            padding-right: 25px;
            position: relative;
          }
          .list-val > .iconfont {
            position: absolute;
            right: 10px;
            font-size: 14px;
          }
          .list-speed {
            padding: 0;
            display: grid;
            grid-template-columns: 95px 10px 95px;
            grid-column-gap: 10px;
            .set-speed {
              padding: 0 10px;
            }
          }
          .list-condition {
            padding: 0;
            ul {
              li {
                margin-right: 10px;
                display: inline;
              }
            }
          }
        }
      }
      .get-data-btn {
        button {
          height: 30px;
          width: 100px;
          line-height: 30px;
        }
      }
    }
    .chart-list-box {
      text-align: center;
      padding: 0 30px 25px;
      height: calc(100vh - 143px);
      .chart-list-title {
        margin-top: 20px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
      }
      .chart-list-btn {
        text-align: right;
        button {
          height: 30px;
          line-height: 30px;
          width: 60px;
          &:first-child {
            margin-right: 10px;
          }
          label {
            cursor: pointer;
            display: block;
            height: 100%;
            width: 100%;
          }
        }
      }
      .my-census-list {
        width: 100%;
        height: calc(100% - 105px);
        position: relative;
        .census-list-head {
          display: grid;
          grid-template-columns: 10% 10% 15% 30% 35%;
          height: 40px;
          line-height: 40px;
        }
        .census-list-body {
          height: calc(100% - 40px);
          li {
            display: grid;
            grid-template-columns: 10% 10% 15% 30% 35%;
            height: 30px;
            line-height: 30px;
          }
        }
        .census-list-head-pos {
          display: grid;
          grid-template-columns: 5% 10% 10% 23.33% 23.33% 28.33%;
          height: 40px;
          line-height: 40px;
        }
        .census-list-body-pos {
          height: calc(100% - 40px);
          overflow-y: auto;
          overflow-x: hidden;
          li {
            display: grid;
            grid-template-columns: 5% 10% 10% 23.33% 23.33% 28.33%;
            height: 30px;
            line-height: 30px;
          }
        }
        .none-data-box {
          height: 100%;
        }
      }
      .my-census-chart {
        text-align: left;
        width: 100%;
        height: calc(100% - 105px);
        .census-chart {
          width: 100%;
          height: 100%;
        }
        .none-data-box {
          height: 100%;
        }
      }
    }
  }
  @media (max-height: 900px) {
    .census-chart-list {
      .census-screen {
        .screen-title {
          font-size: 18px;
          margin: 4% 0;
        }
        .screen-list {
          height: calc(100% - 8% - 60px);
          // grid-template-rows: repeat(12, 7.6%);
        }
      }
    }
  }
  .census-list-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    .my-census-lists {
      position: absolute;
      overflow: auto;
      .search-msg {
        width: 100%;
        height: 30px;
        padding: 0 10px;
      }
      .my-census-li {
        height: 30px;
        line-height: 30px;
        .check-list-val {
          display: inline-block;
          margin-left: 10px;
          width: 100%;
        }
        .my-icon {
          padding-left: 10px;
        }
        .hasOpen {
          .my-icon {
            padding: 0;
          }
        }
        .my-child-list {
          height: auto;
          width: 100%;
          li {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            padding-right: 10px;
          }
        }
      }
      .openList {
        height: auto;
        line-height: auto;
      }
    }
  }
  .select-box {
    input {
      height: 19px;
      padding: 0 10px 0 5px;
      width: 100%;
      overflow: hidden;
      border: none;
      font-size: 16px;
    }
  }
}
</style>
