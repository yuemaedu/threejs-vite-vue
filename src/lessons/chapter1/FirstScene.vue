<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {
  AxesHelper, BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera,
  PlaneGeometry, Scene, SphereGeometry, WebGLRenderer
} from 'three'

const containerRef = ref<HTMLDivElement>()
onMounted(() => {
  // 创建场景
  const scene = new Scene()

  // 创建摄像机
  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置摄像机位置
  camera.position.set(-30, 40, 30)
  //设置摄像机朝向
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer()
  renderer.setClearColor(new Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const axes = new AxesHelper(20)
  scene.add(axes)

  const planeGeometry = new PlaneGeometry(60, 20)
  const meshBasicMaterial = new MeshBasicMaterial({color: 0xcccccc})
  const plane = new Mesh(planeGeometry, meshBasicMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const cubeGeometry = new BoxGeometry(4, 4, 4)
  const cubeMaterial = new MeshBasicMaterial({color: 0xff0000, wireframe: true})
  const cube = new Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(2, 2, 2)
  scene.add(cube)

  // create a sphere
  const sphereGeometry = new SphereGeometry(4);
  const sphereMaterial = new MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true,
  })
  const sphere = new Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.x = 20
  sphere.position.y = 4
  sphere.position.z = 2

  // add the sphere to the scene
  scene.add(sphere)
  containerRef.value?.appendChild(renderer.domElement)
  renderer.render(scene, camera)
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>