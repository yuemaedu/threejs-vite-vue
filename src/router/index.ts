import {createRouter, createWebHistory, RouteRecordRaw,} from "vue-router";
import chapter2 from "./chapter2";
import chapter1 from "./chapter1";
import chapter3 from "./chapter3";

const routes: RouteRecordRaw[] = [
    ...chapter1,
    ...chapter2,
    ...chapter3
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to) => {
    document.title = to.meta.title as string
})
export default router