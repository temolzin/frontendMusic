<template>
  <div>
    <div class="text-caption q-mb-sm text-grey-7">
      Selecciona los módulos/permisos que tendrá el rol
    </div>
    <div class="row q-col-gutter-md">
      <div
        v-for="mod in modules"
        :key="mod.key"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="full-height">
          <div class="row no-wrap items-start full-width q-pa-sm q-gutter-sm">
            <q-checkbox
              class="q-pt-xs"
              :model-value="mod.checkedAll"
              :indeterminate="mod.indeterminate"
              color="primary"
              @update:model-value="setModule(mod, $event)"
            />
            <div class="col q-pt-xs">
              <div class="text-weight-medium text-body2">
                <q-icon :name="mod.icon" size="sm" class="q-mr-xs text-primary" />
                {{ mod.label }}
              </div>
              <div class="text-caption text-grey-7">
                {{ mod.checkedCount }}/{{ mod.permissions.length }} seleccionados
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              size="sm"
              color="primary"
              :icon="expandedMap[mod.key] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click.stop="setExpanded(mod.key, !expandedMap[mod.key])"
            >
              <q-tooltip>
                {{ expandedMap[mod.key] ? 'Ocultar permisos' : 'Ver permisos' }}
              </q-tooltip>
            </q-btn>
          </div>

          <q-separator />
          <q-slide-transition>
            <div v-show="expandedMap[mod.key]">
              <q-card-section
                class="q-pt-xs q-pb-xs"
                style="max-height: 220px; overflow-y: auto"
              >
                <q-checkbox
                  v-for="perm in mod.permissions"
                  :key="perm.permission_id"
                  :model-value="isSelected(perm.permission_id)"
                  dense
                  color="primary"
                  :label="perm.name"
                  class="q-my-xs"
                  @update:model-value="togglePermission(perm)"
                />
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
const MODULES = [
  { key: 'users', label: 'Usuarios', icon: 'group', match: /usuario/ },
  { key: 'roles', label: 'Roles', icon: 'badge', match: /\brol(es)?\b/ },
  { key: 'genres', label: 'Géneros Musicales', icon: 'music_note', match: /genero/ },
  { key: 'artist-profile', label: 'Perfil de Artista', icon: 'mic', match: /perfil de artista|estad/ },
  { key: 'cards', label: 'Tarjetas', icon: 'credit_card', match: /tarjeta/ },
  { key: 'cart', label: 'Carrito / Compras', icon: 'shopping_cart', match: /carrito|compras/ },
  { key: 'favourites', label: 'Artistas Favoritos', icon: 'favorite', match: /favorito/ },
  { key: 'store', label: 'Tienda', icon: 'store', match: /tienda/ },
];

export default {
  name: 'PermissionModules',
  props: {
    modelValue: { type: Array, default: () => [] },
    permissions: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      expandedMap: {},
    };
  },
  computed: {
    modules() {
      const list = this.permissions || [];
      const grouped = MODULES.map((m) => ({
        ...m,
        permissions: [],
      }));
      const general = [];
      const genericProfile = [];

      list.forEach((perm) => {
        const name = (perm.name || '').toLowerCase();
        if (name.includes('perfil de artista') || name.includes('estad')) {
          grouped.find((m) => m.key === 'artist-profile').permissions.push(perm);
          return;
        }
        if (name.includes('usuario')) {
          grouped.find((m) => m.key === 'users').permissions.push(perm);
          return;
        }
        if (/\brol(es)?\b/.test(name)) {
          grouped.find((m) => m.key === 'roles').permissions.push(perm);
          return;
        }
        if (name.includes('genero')) {
          grouped.find((m) => m.key === 'genres').permissions.push(perm);
          return;
        }
        if (name.includes('tarjeta')) {
          grouped.find((m) => m.key === 'cards').permissions.push(perm);
          return;
        }
        if (name.includes('carrito') || name.includes('compras')) {
          grouped.find((m) => m.key === 'cart').permissions.push(perm);
          return;
        }
        if (name.includes('favorito')) {
          grouped.find((m) => m.key === 'favourites').permissions.push(perm);
          return;
        }
        if (name.includes('tienda')) {
          grouped.find((m) => m.key === 'store').permissions.push(perm);
          return;
        }
        if (name.includes('dashboard') || name.includes('perfil')) {
          genericProfile.push(perm);
          return;
        }
        general.push(perm);
      });

      const all = grouped.filter((m) => m.permissions.length > 0);
      if (genericProfile.length) {
        all.push({ key: 'profile', label: 'Perfil General', icon: 'person', permissions: genericProfile });
      }
      if (general.length) {
        all.push({ key: 'general', label: 'General', icon: 'apps', permissions: general });
      }

      return all.map((m) => {
        const selected = m.permissions.filter((p) => this.isSelected(p.permission_id)).length;
        const total = m.permissions.length;
        return {
          ...m,
          checkedCount: selected,
          checkedAll: total > 0 && selected === total,
          indeterminate: selected > 0 && selected < total,
        };
      });
    },
  },
  methods: {
    isSelected(id) {
      return this.modelValue.includes(id);
    },
    setExpanded(key, value) {
      this.$set(this.expandedMap, key, value);
    },
    setModule(mod, value) {
      const ids = mod.permissions.map((p) => p.permission_id);
      let next = this.modelValue.filter((id) => !ids.includes(id));
      if (value) {
        next = next.concat(ids);
      }
      this.$emit('update:modelValue', next);
    },
    togglePermission(perm) {
      let next;
      if (this.isSelected(perm.permission_id)) {
        next = this.modelValue.filter((id) => id !== perm.permission_id);
      } else {
        next = this.modelValue.concat(perm.permission_id);
      }
      this.$emit('update:modelValue', next);
    },
  },
};
</script>
