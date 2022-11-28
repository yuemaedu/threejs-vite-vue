import {RouteRecordRaw} from "vue-router";
import MeshBasicMaterial from '../lessons/chapter4/MeshBasicMaterial.vue'
const chapter4: RouteRecordRaw[] = [
    {
        path:'/chapter4/MeshBasicMaterial',
        component:MeshBasicMaterial,
        meta:{
            title:'基础网格材质'
        }
    }
]
export default chapter4