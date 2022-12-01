import {createRouter, createWebHistory, RouteRecordRaw,} from "vue-router";
import chapter2 from "./chapter2";
import chapter1 from "./chapter1";
import chapter3 from "./chapter3";
import chapter4 from "./chapter4";
import DemoA from "../lessons/demo/DemoA.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DemoA,
        meta: {
            title: '第一个示例'
        }
    },
    ...chapter1,
    ...chapter2,
    ...chapter3,
    ...chapter4
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to) => {
    document.title = to.meta.title as string
})
export default router