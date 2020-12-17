<template>
  <v-card
      class="mx-auto"
      color="#26c6da"
      dark
      max-width="400"
  >
    <v-card-title>
      <v-icon
          large
          left
      >
        mdi-crown
      </v-icon>
      <span class="title font-weight-light">{{data.title}}</span>
    </v-card-title>

    <v-card-text class="headline font-weight-bold">
      오늘 집중 시간,, 집중 점수는 ..
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
              class="elevation-6"
              alt=""
              src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ data.userId }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style scoped>

</style>