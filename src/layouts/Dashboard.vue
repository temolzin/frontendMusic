<template>
  <q-layout view="lHh LpR fFf">

    <!-- Inicio de header -->
    <q-header class="text-dark" style="background-color:#F7F7F7">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <!-- Bottom Serach -->
        <q-toolbar-title>
          <div class="row q-ma-md">
           <q-input white dense borderless  standout v-model="text" input-class="text-gray" class="col-12 col-sm-8 col-md-5"
            placeholder="Buscar por artista, banda, sonido">
              <template v-slot:append>
                <q-icon v-if="text === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
              </template>
           </q-input>
          </div>
        </q-toolbar-title>
        <!-- Fin Bottom Serach -->

        <!-- bottom dropdown  -->
         <div class=" text-right" style="color:gray">
                <!-- Icons bell and wrench -->
                <small>
                  <q-icon  name="fas fa-bell" class="q-mr-md"/>
                  <q-icon  name="fas fa-wrench" size=""/>
                </small>
                <!-- FinIcons bell and wrench -->

                <!-- Card info profile -->
                <q-btn-dropdown class="q-ml-sm"  round outline flat >
                  <template v-slot:label>
                    <div class="row items-center no-wrap ">
                      <q-avatar size="40px">
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                      </q-avatar>
                    </div>
                  </template>
                  <div class="row no-wrap">
                    <div class="column items-center">
                      <q-avatar size="82px">
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" class="">
                      </q-avatar>
                      <div class="text-subtitle1 q-mt-md q-mb-xs">{{ getMe.name }}</div>
                      <b style="text-transform:capitalize">{{ getMe.role[0] }}</b>
                      <small class="q-mt-sm">{{ getMe.email }}</small>

                     <div class="row q-mt-md q-ma-sm">
                      <q-btn 
                      color="indigo col-5" 
                      label="Editar perfil" 
                      push size="sm" 
                      v-close-popup 
                      to="/dashboard/user/profile"
                      v-if="$can('edit-profile')" />
                      <div class="col-2"></div>
                      <q-btn color="red col-5" label="Cerrar Sesión" push size="sm" v-close-popup @click="logout"/>
                     </div>
                    </div>
                  </div>
                </q-btn-dropdown>
                 <!-- Card info profile -->
         </div>
        <!-- Fin bottom dropdown  -->
         
      </q-toolbar>
    </q-header>
    <!-- fin de header -->

    <!-- Menu left -->
    <q-drawer class="bg-primary" show-if-above v-model="leftDrawerOpen" side="left" bordered>
       <q-scroll-area style="height: calc(100% - 150px);margin-top: 120px;">
          <q-list padding class="text-white text-weight-light">

            <q-item to='/dashboard/home' clickable active-class="text-accent text-weight-bold">
              <q-item-section class="text-weight-bold"> DASHBOARD </q-item-section>
            </q-item>
              
            <q-item clickable v-ripple to='/admin/users' v-if="$can('view-users')" active-class="text-accent text-weight-bold">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-users"/>
              </q-item-section>
              <q-item-section> Usuarios </q-item-section>
            </q-item>

             <q-item clickable v-ripple to='/admin/roles' v-if="$can('create-roles')" active-class="text-accent text-weight-bold">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-street-view"  />
              </q-item-section>

              <q-item-section> Roles </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-user-tag"  />
              </q-item-section>

              <q-item-section> Tags </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts"  />
              </q-item-section>

              <q-item-section> Drafts </q-item-section>
            </q-item>

            <q-item >
              <q-item-section class="text-weight-bold"> DASHBOARD </q-item-section>
            </q-item>
              
            <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-users"  />
              </q-item-section>

              <q-item-section> Users </q-item-section>
            </q-item>

             <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-street-view"  />
              </q-item-section>

              <q-item-section> Roles </q-item-section>
            </q-item>

               <q-item >
              <q-item-section class="text-weight-bold"> DASHBOARD </q-item-section>
            </q-item>
              
            <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-users"  />
              </q-item-section>

              <q-item-section> Users </q-item-section>
            </q-item>

             <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="fas fa-solid fa-street-view"  />
              </q-item-section>

              <q-item-section> Roles </q-item-section>
            </q-item>


          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top bg-transparent" style="height: 140px">
          <div class="absolute-center bg-transparent">
            <q-avatar size="140px">
                <q-icon name="fas fa-solid fa-cloud-moon" />
            </q-avatar>
          </div>
        </q-img>

    </q-drawer>
     <!-- Fin Menu left -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { mapGetters } from "vuex";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      text: ref(''),
      mobileData: ref(false),
      bluetooth: ref(false)
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
  },
  methods:{
      logout() {
      this.$store.dispatch("auth/signOut");
      const toPath = this.$route.query.to || "/";
      this.$router.push(toPath);
    },
  }
};
</script>
