import {RouteRecordRaw} from "vue-router";
import FirstScene from '../lessons/chapter1/FirstScene.vue'
import MaterialLight from '../lessons/chapter1/MaterialLight.vue'
import MaterialLightAnimation from '../lessons/chapter1/MaterialLightAnimation.vue'
import ControlGui from '../lessons/chapter1/ControlGui.vue'
import ScreenSizeChange from '../lessons/chapter1/ScreenSizeChange.vue'

const chapter1: RouteRecordRaw[] = [
    {
        path: '/chapter1/first-scene',
        component: FirstScene,
        meta: {
            title: '第一个场景'
        }
    },
    {
        path: '/chapter1/material-light',
        component: MaterialLight,
        meta: {
            title: '材质和光照'
        }
    },
    {
        path: '/chapter1/material-light-animation',
        component: MaterialLightAnimation,
        meta: {
            title: '材质、光照和动画'
        }
    },
    {
        path: '/chapter1/control-gui',
        component: ControlGui,
        meta: {
            title: '交互控制'
        }
    },
    {
        path: '/chapter1/screen-size-change',
        component: ScreenSizeChange,
        meta: {
            title: '响应窗口改变'
        }
    },
]
export default chapter1