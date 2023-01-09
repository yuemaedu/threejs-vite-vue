<script setup lang="ts">
</script>

<template>
  <a-menu mode="horizontal" style="position: fixed">

    <a-sub-menu key="demo">
      <template #title>项目示例</template>
      <a-menu-item key="demoA">
        <router-link to="/demo/a">第一个示例</router-link>
      </a-menu-item>
      <a-menu-item key="demoB">
        <router-link to="/demo/b">第二个示例</router-link>
      </a-menu-item>
      <a-menu-item key="demoC">
        <router-link to="/demo/c">第三个示例</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="chapter1">
      <template #title>第一章</template>
      <a-menu-item key="first-scene">
        <router-link to="/chapter1/first-scene">第一个场景</router-link>
      </a-menu-item>
      <a-menu-item key="material-light">
        <router-link to="/chapter1/material-light">材质和光照</router-link>
      </a-menu-item>
      <a-menu-item key="material-light-animation">
        <router-link to="/chapter1/material-light-animation">材质、光照和动画</router-link>
      </a-menu-item>
      <a-menu-item key="control-gui">
        <router-link to="/chapter1/control-gui">交互控制</router-link>
      </a-menu-item>
      <a-menu-item key="screen-size-change">
        <router-link to="/chapter1/screen-size-change">响应窗口改变</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="chapter2">
      <template #title>第二章</template>
      <a-menu-item key="first-scene">
        <router-link to="/chapter2/basic-scene">基础场景</router-link>
      </a-menu-item>
      <a-menu-item key="foggy-scene">
        <router-link to="/chapter2/foggy-scene">雾化场景</router-link>
      </a-menu-item>
      <a-menu-item key="override-scene">
        <router-link to="/chapter2/override-scene">重写材质</router-link>
      </a-menu-item>
      <a-menu-item key="geometries">
        <router-link to="/chapter2/geometries">常见几何体</router-link>
      </a-menu-item>
      <a-menu-item key="custom-geometry">
        <router-link to="/chapter2/custom-geometry">修改属性</router-link>
      </a-menu-item>
      <a-menu-item key="change-camera">
        <router-link to="/chapter2/change-camera">切换相机</router-link>
      </a-menu-item>
      <a-menu-item key="camera-look-at">
        <router-link to="/chapter2/camera-look-at">相机跟随</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="chapter3">
      <template #title>第三章</template>
      <a-menu-item key="ambient-light">
        <router-link to="/chapter3/ambient-light">环境光</router-link>
      </a-menu-item>
      <a-menu-item key="point-light">
        <router-link to="/chapter3/point-light">点光源</router-link>
      </a-menu-item>
      <a-menu-item key="spot-light">
        <router-link to="/chapter3/spot-light">聚光灯</router-link>
      </a-menu-item>
      <a-menu-item key="directional-light">
        <router-link to="/chapter3/directional-light">平行光</router-link>
      </a-menu-item>
      <a-menu-item key="hemisphere-light">
        <router-link to="/chapter3/hemisphere-light">半球光</router-link>
      </a-menu-item>
      <a-menu-item key="LensFlares">
        <router-link to="/chapter3/LensFlares">镜头光晕</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="chapter4">
      <template #title>第四章</template>
      <a-menu-item key="MeshBasicMaterial">
        <router-link to="/chapter4/MeshBasicMaterial">基础网格材质</router-link>
      </a-menu-item>
      <a-menu-item key="MeshDepthMaterial">
        <router-link to="/chapter4/MeshDepthMaterial">深度网格材质</router-link>
      </a-menu-item>
      <a-menu-item key="CombinedMaterial">
        <router-link to="/chapter4/CombinedMaterial">混合材质</router-link>
      </a-menu-item>
      <a-menu-item key="MeshNormalMaterial">
        <router-link to="/chapter4/MeshNormalMaterial">网格法向量材质</router-link>
      </a-menu-item>
      <a-menu-item key="MeshFaceMaterial">
        <router-link to="/chapter4/MeshFaceMaterial">网格面</router-link>
      </a-menu-item>
      <a-menu-item key="MeshLambertMaterial">
        <router-link to="/chapter4/MeshLambertMaterial">Lambert （兰伯特）光照模型</router-link>
      </a-menu-item>
      <a-menu-item key="MeshPhongMaterial">
        <router-link to="/chapter4/MeshPhongMaterial">Phong光照模型</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="chapter5">
      <template #title>第五章</template>
      <a-menu-item key="1">
        <router-link to="/chapter5/1">射线</router-link>
      </a-menu-item>
    </a-sub-menu>

  </a-menu>
  <router-view/>
</template>

<style scoped>

</style>
