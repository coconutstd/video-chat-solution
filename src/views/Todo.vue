<template>
<div>
  <v-container fluid>
    할일목록
  </v-container>
</div>
</template>

<script>
import bus from '../utils/bus.js';
export default {
  created () {
    bus.$emit('start:spinner');
  }
}
</script>

<style scoped>

</style>
