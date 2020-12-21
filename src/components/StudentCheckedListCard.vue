<template>
  <v-card>
    <v-card-title class="headline grey lighten-2">
<!--      -->
    </v-card-title>

    <v-card-text>
<!--      -->
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          text
          @click="onClickAction"
      >
        I accept
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods:{
    onClickAction(){
      this.$emit('dialogClicked');
    }
  }
}
</script>

<style scoped>

</style>
