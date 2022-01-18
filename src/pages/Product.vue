<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in myJson" :key="index">
          <td class="text-left">{{ data.id }}</td>
          <td class="text-right">{{ data.name }}</td>
        </tr>
      </tbody>
    </q-markup-table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      myJson: [],
    };
  },
  methods: {

  },
  mounted() {
    this.$axios.get("http://127.0.0.1:8000/api/product")
      .then((response) => {
        this.myJson = response.data.products;
      })
      .catch((error) => console.log("Error", error.message));
  },
};
</script>
