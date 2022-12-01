<template>
    <div ref="containerRef" class="container">
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import {
  AmbientLight, CanvasTexture,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  PerspectiveCamera,
  PointLight, PointLightHelper,
  Scene, Sprite, SpriteMaterial, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
// https://www.vitejs.net/guide/assets.html#importing-asset-as-url
import GLBModel from '../../assets/model.glb?url'
import TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// 参考了up代码 https://www.bilibili.com/video/BV1i14y147Mf/?spm_id_from=333.337.search-card.all.click&vd_source=174c044e83a5a1d9ace3643cefc62203
const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<PerspectiveCamera>()
const controlRef = ref<OrbitControls>()
const scene = new Scene()

scene.background = new Color('#fae9e9')

function random() {
  return Math.ceil(Math.random() * 1000);
}

const list = [
  {
    position: {x: 20, y: -125, z: -10},
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: {x: -75, y: -125, z: -10},
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: {x: 40, y: -135, z: 145},
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: {x: -70, y: -140, z: 90},
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: {x: -20, y: -135, z: -106},
    content: `${random()}℃，${random()}Pa`
  }
]

function createSprite({position, content}: { position: { x: number, y: number, z: number }, content: string }) {
  const canvas = createCanvas(content)
  const texture = new CanvasTexture(canvas)
  const material = new SpriteMaterial({map: texture});
  const sprite = new Sprite(material);
  sprite.scale.set(50, 50, 50)
  const {x, y, z} = position
  sprite.position.set(x, y, z)
  scene.add(sprite);
  return {canvas, texture}
}

function createCanvas(text = '') {
  const canvas = document.createElement('canvas')
  canvas.width = 250
  canvas.height = 250
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'rgba(0,0,0,.7)'
    ctx.fillRect(0, 0, 250, 90)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 32px 宋体'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 125, 45)
  }
  return canvas
}

function changeCanvasText(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, 250, 90)
    ctx.fillStyle = 'rgba(0,0,0,.7)'
    ctx.fillRect(0, 0, 250, 90)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 32px 宋体'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 125, 45)
  }
}

function initCamera() {
  cameraRef.value = new PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 30000);
  const start = {x: 0, y: 0, z: 0}
  new TWEEN.Tween(start)
      .to({x: 1000, y: 1000, z: 1000}, 2500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const {x, y, z} = start
        cameraRef.value?.position.set(x, y, z)
      })
      .start()
  controlRef.value = new OrbitControls(cameraRef.value, rendererRef.value?.domElement)
  //调整摄像头的控制器，限制摄像机的移动
  controlRef.value.autoRotate = false
  controlRef.value.autoRotateSpeed = 5
  controlRef.value.dampingFactor = 0.05
  controlRef.value.enableDamping = true
  controlRef.value.enableRotate = true
  controlRef.value.minDistance = 400
  controlRef.value.maxDistance = 1800
  controlRef.value.maxPolarAngle = Math.PI * .5
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer()
  rendererRef.value.setClearColor(new Color(0x00000));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function initLight() {
  const ambientLight = new AmbientLight('#f0f0f0', .6)
  scene.add(ambientLight)
  const directionalLight = new DirectionalLight('#ffffff', .2)
  scene.add(directionalLight)
  const pointLight = new PointLight('#ffffff', .5, 1800)
  scene.add(pointLight)

  const directionalLightHelper = new DirectionalLightHelper(directionalLight, 20)
  const pointLightHelper = new PointLightHelper(pointLight, 20)

  pointLight.position.set(0, 400, 0)
  directionalLight.position.set(10, 40, 10)

}

function render() {
  scene.traverse((e) => {
    if (e instanceof Mesh && e.name !== 'plane') {
      // e.rotation.x += controlRef.value.rotationSpeed;
      // e.rotation.y += controlRef.value.rotationSpeed;
      // e.rotation.z += controlRef.value.rotationSpeed;
    }
  })
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
  controlRef.value?.update()
  TWEEN.update()
}

onMounted(() => {

  const loader = new GLTFLoader();
  //这个使用来解压缩文件的类
  const dracoLoader = new DRACOLoader()
  loader.setDRACOLoader(dracoLoader);

  loader.load(GLBModel, function (gltf) {
    const model = gltf.scene
    //模型开启阴影
    model.traverse(child => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    //缩放
    model.scale.set(0.5, 0.5, 0.5)
    model.position.set(0, -200, 0)
    scene.add(model)
    list.forEach(item => {
      const {canvas, texture} = createSprite({...item})
      // @ts-ignore
      item.canvas = canvas
      // @ts-ignore
      item.texture = texture
    })

    setInterval(() => {
      list.forEach(item => {
        const content = `${random()}℃，${random()}KPa`
        // @ts-ignore
        changeCanvasText(item.canvas, content)
        // @ts-ignore
        item.texture.needsUpdate = true
      })
    }, 1000)

  })
  initLight()
  initRenderer()
  initCamera()
  render()
})

watchEffect(() => {
  if (rendererRef.value) {
    containerRef.value?.append(rendererRef.value.domElement)
  }
})
</script>

<style scoped>

.container {
  width: 100vw;
  height: 100vh;
}
</style>