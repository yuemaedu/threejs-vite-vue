<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D,
  PerspectiveCamera,
  PointLight, PointLightHelper, Raycaster,
  Scene, Texture, TextureLoader, Vector2,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import MachineRoom from '../../assets/models/machineRoom.gltf?url'

const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<PerspectiveCamera>()
const controlRef = ref<OrbitControls>()
const scene = new Scene()

function initLight() {
  const ambientLight = new AmbientLight('#f0f0f0', .6)
  scene.add(ambientLight)
  const directionalLight = new DirectionalLight('#ffffff', .2)
  scene.add(directionalLight)
  const pointLight = new PointLight('#ffffff', .5, 1800)
  scene.add(pointLight)
  pointLight.position.set(0, 400, 0)
  directionalLight.position.set(10, 40, 10)

}

function initCamera() {
  cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const start = {x: 0, y: 0, z: 0}
  new TWEEN.Tween(start)
      .to({x: 0, y: 10, z: 15}, 2500)
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
  controlRef.value.minDistance = 10
  // controlRef.value.maxDistance = 1800
  controlRef.value.maxPolarAngle = Math.PI * .5
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer()
  rendererRef.value.setClearColor(new Color(0xEEEEEE));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function render() {
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
  controlRef.value?.update()
  TWEEN.update()
}

const maps: Map<string, Texture> = new Map();
const cabinets: Mesh[] = [];

function crtTexture(imgName: string) {
  let curTexture = maps.get(imgName);
  if (!curTexture) {
    curTexture = new TextureLoader().load('/models/' + imgName);
    curTexture.flipY = false;
    curTexture.wrapS = 1000;
    curTexture.wrapT = 1000;
    maps.set(imgName, curTexture);
  }
  return curTexture;
}

function changeMat(obj: Mesh, map: Texture | null, color: Color) {
  if (map) {
    obj.material = new MeshBasicMaterial({
      map: crtTexture(map.name),
    });
  } else {
    obj.material = new MeshBasicMaterial({color});
  }
}

const raycaster = new Raycaster();
//鼠标在裁剪空间中的点位
const pointer = new Vector2();
const curCabinetRef = ref<Mesh | null>()

function selectCabinet(x: number, y: number) {
  const {width, height} = rendererRef.value!.domElement;
  // 鼠标的canvas坐标转裁剪坐标
  pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
  // 基于鼠标点的裁剪坐标位和相机设置射线投射器
  if (cameraRef.value) {
    raycaster.setFromCamera(pointer, cameraRef.value);
  }
  // 选择机柜
  const intersect = raycaster.intersectObjects(cabinets)[0];
  let intersectObj = intersect ? (intersect.object as Mesh) : null;
  // 若之前已有机柜被选择，且不等于当前所选择的机柜，取消之前选择的机柜的高亮
  if (curCabinetRef.value && curCabinetRef.value !== intersectObj) {
    const material = curCabinetRef.value.material as MeshBasicMaterial;
    material.setValues({
      map: maps.get("cabinet.jpg"),
    });
  }

  if (intersectObj) {
    if (intersectObj !== curCabinetRef.value) {
      curCabinetRef.value = intersectObj;
      const material = intersectObj.material as MeshBasicMaterial;
      material.setValues({
        map: maps.get("cabinet-hover.jpg"),
      });
    }
  } else if (curCabinetRef.value) {
    curCabinetRef.value = null
  }
}

function mouseMove({clientX, clientY}: { clientX: number, clientY: number }) {
  selectCabinet(clientX, clientY);
}

onMounted(() => {
  crtTexture("cabinet-hover.jpg");
  containerRef.value!.onmousemove = mouseMove
  const loader = new GLTFLoader();
  loader.load(MachineRoom, (gltf: GLTF) => {
    gltf.scene.children.forEach((obj: Object3D) => {
      if (obj instanceof Mesh) {
        const {map, color} = obj.material as MeshStandardMaterial;
        changeMat(obj, map, color);
        if (obj.name.includes("cabinet")) {
          cabinets.push(obj);
        }
      }
    });
    scene.add(...gltf.scene.children);
  });
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