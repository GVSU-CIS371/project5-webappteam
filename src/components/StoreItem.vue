<template>
  <v-row>
    <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
      <v-card>
        <v-card-title>
          {{ product.data.name }}
        </v-card-title>
        <v-card-subtitle>
          Rating: {{ product.data.rating }} | Price: {{ product.data.price }} | Stock: {{ product.data.stock }}
        </v-card-subtitle>
        <v-img :src="product.data.image" height="200px"></v-img>
        <v-card-text>
          {{ product.data.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useProductStore } from '../stores/ProductStore';
import { computed } from "vue";

const props = defineProps<{
  category: string;
}>();

const productStore = useProductStore();
productStore.init();

const filteredProducts = computed(() => {
  if (props.category === "none") {
    return productStore.products; // Default to all products
  } else if (props.category === "rating") {
    return productStore.products.filter(product => product.data.rating >= 4.5); // Filter by rating
  } else {
    return productStore.products.filter(product => product.data.category === props.category); // Filter by category
  }
});
</script>
