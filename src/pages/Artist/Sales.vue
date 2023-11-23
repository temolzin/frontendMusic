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
          { id: 1, transactionID: 'trc9dntnsu68tfdiokkh', amount: 50 },
          { id: 2, transactionID: 'trc9dntnsu68tfdiokkh', amount: 150 },
          { id: 3, transactionID: 'trc9dntnsu68tfdiokkh', amount: 520 },

        ],
        columnas: [
          { name: 'transactionID', label: 'ID de transacción', align: 'left', field: 'transactionID', sortable: true },
          { name: 'amount', label: 'Precio', align: 'left', field: 'amount', sortable: true },
        ],
      };
    },
  };
  </script>
  
  <style>
  /* Estilos personalizados si es necesario */
  </style>
  