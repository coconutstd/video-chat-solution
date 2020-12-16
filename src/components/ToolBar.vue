<template>
  <div>
    <v-app-bar color="indigo" dark fixed app>

      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          OMNI
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="item in menuItems"
          :to="item.link"
          class="indigo darken-1"
        >{{item.title}}</v-btn>
      </v-toolbar-items>


      <v-btn icon @click="signOut">
        <v-icon>mdi-lock-open</v-icon>
      </v-btn>

    </v-app-bar>


    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >
          <v-list-item :to="item.link" v-for="item in menuItems">
            <v-list-item-title>
              {{item.title}}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  methods:{
    async signOut(){
      try {
        await Auth.signOut();
      } catch (error) {
        console.log(error);
      }
    }
  },
  data(){
    return {
      drawer: false,
      group: null,
      menuItems: [
        {'title' : '화상채팅', 'link' : '/videochat'},
        {'title' : '할일리스트', 'link' : '/todo'}
      ]
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
<style scoped>
/*ul{*/
/*  padding: 0 0;*/
/*  margin: 0 0;*/
/*}*/
/*li{*/
/*  list-style: none;*/
/*}*/
/*.menu{*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/

/*.menu-item{*/
/*  width: 25%;*/
/*  background-color: #eeeeee;*/
/*}*/

/*.menu-link {*/
/*  display: block;*/
/*  padding: 1em;*/
/*  font-size: 1.2rem;*/
/*  font-weight: bold;*/
/*  color: white;*/
/*  text-decoration: none;*/
/*  text-align: center;*/
/*  border: none;*/
/*}*/

/*.menu-link:hover {*/
/*  background-color: aquamarine;*/
/*}*/

.menu-item button {
  width: 100%;
}


</style>
