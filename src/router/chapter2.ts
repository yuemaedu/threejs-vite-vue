import {RouteRecordRaw} from "vue-router";
import BasicScene from '../lessons/chapter2/BasicScene.vue'
import FoggyScene from '../lessons/chapter2/FoggyScene.vue'
import OverrideMaterial from '../lessons/chapter2/OverrideMaterial.vue'
import Geometries from '../lessons/chapter2/Geometries.vue'
import CustomGeometry from '../lessons/chapter2/CustomGeometry.vue'
import ChangeCamera from '../lessons/chapter2/ChangeCamera.vue'
import CameraLookAt from '../lessons/chapter2/CameraLookat.vue'

const chapter2: RouteRecordRaw[] = [
    {
        path: '/chapter2/basic-scene',
        component: BasicScene,
        meta: {
            title: '基础场景'
        }
    },
    {
        path: '/chapter2/foggy-scene',
        component: FoggyScene,
        meta: {
            title: '雾化场景'
        }
    },
    {
        path: '/chapter2/override-scene',
        component: OverrideMaterial,
        meta: {
            title: '重写材质'
        }
    },
    {
        path: '/chapter2/geometries',
        component: Geometries,
        meta: {
            title: '常见几何体'
        }
    },
    {
        path: '/chapter2/custom-geometry',
        component: CustomGeometry,
        meta: {
            title: '自定义几何体'
        }
    },
    {
        path: '/chapter2/change-camera',
        component: ChangeCamera,
        meta: {
            title: '切换相机'
        }
    },
    {
        path: '/chapter2/camera-look-at',
        component: CameraLookAt,
        meta: {
            title: '相机跟随'
        }
    },
]
export default chapter2