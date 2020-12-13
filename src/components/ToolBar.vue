<template>
    <ul class="menu">
      <li class="menu-item">
        <router-link class="menu-link" to="/home">Home</router-link>
      </li>
      <li class="menu-item">
        <router-link class="menu-link" to="/videochat">VideoChat</router-link>
      </li>
      <li class="menu-item">
        <router-link class="menu-link" to="/todos">Todos</router-link>
      </li>
      <li class="menu-item">
        <button class="menu-link" @click="signOut">Sign out</button>
      </li>
    </ul>
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
  }
}
</script>
<style scoped>
ul{
  padding: 0 0;
  margin: 0 0;
}
li{
  list-style: none;
}
.menu{
  display: flex;
  align-items: center;
}

.menu-item{
  width: 25%;
  background-color: #eeeeee;
}

.menu-link {
  display: block;
  padding: 1em;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  text-align: center;
  border: none;
}


.sign-out-button {
  width: 100px;
}
</style>
