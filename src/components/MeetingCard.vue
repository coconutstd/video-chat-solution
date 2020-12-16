<template>
  <div>
    <v-card
        max-width="344"
    >
      <v-card-text>
        <p>회의 제목 :</p>
        <p class="display-1 text--primary">
          {{ data.Title }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
            text
            color="deep-purple accent-4"
        >
          정보보기
        </v-btn>
        <v-btn
            text
            color="deep-purple accent-4"
        >
          회의삭제
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['data'],
}
</script>

<style scoped>

</style>