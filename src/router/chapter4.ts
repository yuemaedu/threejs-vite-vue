import {RouteRecordRaw} from "vue-router";
import MeshBasicMaterial from '../lessons/chapter4/MeshBasicMaterial.vue'
import MeshDepthMaterial from '../lessons/chapter4/MeshDepthMaterial.vue'
import CombinedMaterial from '../lessons/chapter4/CombinedMaterial.vue'

const chapter4: RouteRecordRaw[] = [
    {
        path: '/chapter4/MeshBasicMaterial',
        component: MeshBasicMaterial,
        meta: {
            title: '基础网格材质'
        }
    },
    {
        path: '/chapter4/MeshDepthMaterial',
        component: MeshDepthMaterial,
        meta: {
            title: '深度网格材质'
        }
    },
    {
        path: '/chapter4/CombinedMaterial',
        component: CombinedMaterial,
        meta: {
            title: '混合材质'
        }
    },
]
export default chapter4