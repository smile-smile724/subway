<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted:function(){
  }
}
</script>

<style>
html{
    height: 100%;
    width: 100%;
    background: rgb(240,243,247);
}
body{
    height: 100%;
    margin:0;
    overflow: hidden;
}
#app {
  width:100%;
  height:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
#mysubway{
  position: absolute;
  z-index: 0;
}
</style>
