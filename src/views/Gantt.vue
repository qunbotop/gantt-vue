<template>
  <div>
    <svg
      key="header_svg"
      ref="headerSvgRef"
      width="200"
      height="300"
      fill="blue"
      stroke="red"
      view-box="0 0 0 300"
      stroke-width="2"
      style="{{cursor: 'ew-resize', userSelect: 'none' }}"
    >
      <g v-for="(t, i) in [1, 2, 3]" :key="t + i">
        <rect x="10" y="0" width="40" height="50%" stroke="#fff" fill="#fff"></rect>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// heaer_svg的dom
const headerSvgRef = ref<SVGSVGElement | null>(null)
</script>

<style lang="scss" scoped></style>
