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
        ><v-icon>{{item.icon}}</v-icon>
          {{item.title}}</v-btn>
      </v-toolbar-items>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in dropItems"
              :key="index"
              @click="onDropClick(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
              <v-icon>{{item.icon}}</v-icon>
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
import { mapState } from 'vuex';

export default {
  computed:{
    ...mapState({
      user : 'userData'
    })
  },
  methods:{
    async signOut(){
      try {
        await Auth.signOut();
      } catch (error) {
        console.log(error);
      }
    },
    onDropClick(item){
      if(item.title === '로그아웃'){
        this.signOut();
      } else if(item.title === '개인정보'){
        this.$router.push(`/home/${this.$store.state.userData.username}`);
      }
    }
  },
  data(){
    return {
      drawer: false,
      group: null,
      menuItems: [
        {'title' : '화상채팅', 'link' : '/videochat', 'icon': 'mdi-video'},
        {'title' : '할일리스트', 'link' : '/todo', 'icon': 'mdi-playlist-check'},
        {'title' : '나의집중도현황', 'link' : `/concentration`, 'icon': 'mdi-account-box'},
      ],
      dropItems: [
        { title: '개인정보' , onClick: 'userProfile'},
        { title: '환경설정' , onClick: 'setting'},
        { title: '로그아웃' , onClick : 'signOut' }
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

