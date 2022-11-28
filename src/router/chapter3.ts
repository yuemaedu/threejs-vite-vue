import {RouteRecordRaw} from "vue-router";
import AmbientLight from '../lessons/chapter3/AmbientLight.vue'
import PointLight from '../lessons/chapter3/PointLight.vue'
import SpotLight from '../lessons/chapter3/SpotLight.vue'
import DirectionalLight from '../lessons/chapter3/DirectionalLight.vue'
import HemisphereLighting from '../lessons/chapter3/HemisphereLighting.vue'
import LensFlares from '../lessons/chapter3/LensFlares.vue'

const chapter3: RouteRecordRaw[] = [
    {
        path: '/chapter3/ambient-light',
        component: AmbientLight,
        meta: {
            title: '环境光'
        }
    },
    {
        path: '/chapter3/point-light',
        component: PointLight,
        meta: {
            title: '点光源'
        }
    },
    {
        path: '/chapter3/spot-light',
        component: SpotLight,
        meta: {
            title: '聚光灯'
        }
    },
    {
        path: '/chapter3/directional-light',
        component: DirectionalLight,
        meta: {
            title: '平行光'
        }
    },
    {
        path: '/chapter3/hemisphere-light',
        component: HemisphereLighting,
        meta: {
            title: '半球光'
        }
    },
    {
        path: '/chapter3/LensFlares',
        component: LensFlares,
        meta: {
            title: '镜头光晕'
        }
    },
]
export default chapter3
