import {RouteRecordRaw} from "vue-router";
import MeshBasicMaterial from '../lessons/chapter4/MeshBasicMaterial.vue'
import MeshDepthMaterial from '../lessons/chapter4/MeshDepthMaterial.vue'
import CombinedMaterial from '../lessons/chapter4/CombinedMaterial.vue'
import MeshNormalMaterial from '../lessons/chapter4/MeshNormalMaterial.vue'
import MeshFaceMaterial from '../lessons/chapter4/MeshFaceMaterial.vue'
import MeshLambertMaterial from '../lessons/chapter4/MeshLambertMaterial.vue'
import MeshPhongMaterial from '../lessons/chapter4/MeshPhongMaterial.vue'


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
    {
        path: '/chapter4/MeshNormalMaterial',
        component: MeshNormalMaterial,
        meta: {
            title: '网格法向量材质'
        }
    },
    {
        path: '/chapter4/MeshFaceMaterial',
        component: MeshFaceMaterial,
        meta: {
            title: '网格面'
        }
    },
    {
        path: '/chapter4/MeshLambertMaterial',
        component: MeshLambertMaterial,
        meta: {
            title: 'Lambert （兰伯特）光照模型'
        }
    },
    {
        path: '/chapter4/MeshPhongMaterial',
        component: MeshPhongMaterial,
        meta: {
            title: 'Lambert （兰伯特）光照模型'
        }
    },
]
export default chapter4