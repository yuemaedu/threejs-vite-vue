import {RouteRecordRaw} from "vue-router";
import Index from '../lessons/chapter5/index.vue'

const chapter5: RouteRecordRaw[] = [
    {
        path: '/chapter5/1',
        component: Index,
        meta: {
            title: '射线'
        }
    },
]
export default chapter5