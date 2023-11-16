<template>
    <q-page>
      <q-card>
        <q-card-section>
          <h2>Mis Ventas</h2>
          <q-table
            :rows="ventas"
            :columns="columnas"
            row-key="id"
          >
            <template v-slot:body-cell-precio="props">
              {{ new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'MXN' }).format(props.row.precio) }}
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ventas: [
          { id: 1, producto: 'Producto A', precio: 50 },
          { id: 2, producto: 'Producto B', precio: 75 },
          { id: 3, producto: 'Producto C', precio: 100 },
        ],
        columnas: [
          { name: 'producto', label: 'Producto', align: 'left', field: 'producto', sortable: true },
          { name: 'precio', label: 'Precio', align: 'right', field: 'precio', sortable: true },
        ],
      };
    },
  };
  </script>
  
  <style>
  /* Estilos personalizados si es necesario */
  </style>
  