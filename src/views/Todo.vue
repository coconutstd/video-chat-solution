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
    bus.$emit('end:spinner');
  }
}
</script>

<style scoped>

</style>
