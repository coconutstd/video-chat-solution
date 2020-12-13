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
        <amplify-sign-out class="menu-link"></amplify-sign-out>
      </li>
    </ul>
</template>

<script>
export default {
  name: "ToolBar"
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
}

.menu-link .hydrated {
  padding: 0;
}

.sign-out-button {
  width: 100px;
}
</style>
