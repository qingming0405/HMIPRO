import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login'
import Index from '../pages/index'

Vue.use(Router)

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    {
      path: '/index',
      component: Index,
      name: 'index',
      redirect: { name: 'empty' },
      children: [
        {
          path: 'empty',
          name: 'empty',
          component: () => import('components/empty/empty'),
        },
        {
          path: 'real',
          name: 'real',
          component: () => import('components/real/real'),
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('components/history/history'),
        },
        {
          path: 'monitor',
          name: 'monitor',
          component: () => import('components/monitor/monitor'),
        },
        {
          path: 'alarm',
          name: 'alarm',
          component: () => import('components/alarm/alarm'),
        },
        {
          path: 'trend',
          name: 'trend',
          component: () => import('components/trend/trend'),
        },
        // {
        //   path: 'wave',
        //   name: 'wave',
        //   component: () => import('components/wave/wave'),
        // },
        {
          path: 'wave',
          name: 'wave',
          component: () => import('components/wave/wave_1'),
        },
        {
          path: 'wave3d',
          name: 'wave3d',
          component: () => import('components/wave3d/wave3d'),
        },
        {
          path: 'compare',
          name: 'compare',
          component: () => import('components/compare/compare'),
        },
        {
          path: 'macCompare',
          name: 'macCompare',
          component: () => import('components/MacCompare/macCompare'),
        },
        {
          path: 'dip',
          name: 'dip',
          component: () => import('components/dip/dip'),
        },
        {
          path: 'spectrum',
          name: 'spectrum',
          component: () => import('components/spectrum/spectrum'),
        },
        {
          path: 'overturn',
          name: 'overturn',
          component: () => import('components/overturn/overturn'),
        },
        {
          path: 'scatter',
          name: 'scatter',
          component: () => import('components/scatter/scatter'),
        },
        {
          path: 'system',
          name: 'system',
          component: () => import('components/system/system'),
        },
        {
          path: 'census',
          name: 'census',
          component: () => import('components/census/census'),
        },
        {
          path: 'circle',
          name: 'circle',
          component: () => import('components/circle/circle'),
        },
        {
          path: 'server',
          name: 'server',
          component: () => import('components/server/server'),
        },
        {
          path: 'maintain',
          name: 'maintain',
          component: () => import('components/maintain/maintain'),
        },
      ]
    },
    {
      path: '/*',
      redirect: '/login',
    },
  ],
})
router.beforeEach((to, from, next) => {
  //刷新页面的时候跳到空白页
  if (from.name === null && to.name !== 'login' && to.name !== 'empty') {
    next({ name: 'empty' })
    //(token失效)
  } else if (from.name === 'login' && sessionStorage.getItem('token') === null) {
    next({ name: 'login' })
  } else {
    next();
  }

  // if(to.name === 'editNotice'){
  //     to.meta.keepAlive = false;
  // }else if(to.name !== 'editNotice'){
  //     to.meta.keepAlive = true;
  // };
})

export default router
