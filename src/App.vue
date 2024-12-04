<template>
  <v-app>
    <v-app-bar class="bg-blue-darken-4">
      <v-toolbar-title>My Online Store</v-toolbar-title>
      <v-btn class="mx-5" v-for="link in links" :key="link.text" :to="link.to">
        <v-icon>{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>

      <!-- Add Product Button -->
      <v-btn @click="openAddProductDialog" color="green" class="ml-5">
        <v-icon>mdi-plus</v-icon> Add Product
      </v-btn>
    </v-app-bar>

    <!-- Add Product Dialog -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Add New Product</v-card-title>
        <v-card-text>
          <v-form v-model="formValid">
            <v-text-field v-model="newProduct.name" label="Product Name" required></v-text-field>
            <v-textarea v-model="newProduct.description" label="Description" required></v-textarea>
            <v-text-field v-model="newProduct.image" label="Image URL" required></v-text-field>
            <v-select v-model="newProduct.category" :items="categories" label="Category" required></v-select>
            <v-text-field v-model="newProduct.price" label="Price" type="number" required></v-text-field>
            <v-text-field v-model="newProduct.stock" label="Stock" type="number" required></v-text-field>
            <v-slider v-model="newProduct.rating" label="Rating" type="number" min="0" max="5" step="1" required></v-slider>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialogVisible = false">Cancel</v-btn>
          <v-btn @click="addProduct" :disabled="!formValid" color="primary">Add Product</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main class="bg-blue-lighten-5">
      <router-view v-slot="{ Component }">
        <transition name="shrink-explode">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <v-footer color="primary" app>
      © 2023 My Online Store. All rights reserved.
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useProductStore } from './stores/ProductStore';

const links = ref([
  { text: "Home", to: "/", icon: "mdi-home" },
  { text: "Electronics", to: "/electronics", icon: "mdi-laptop" },
  { text: "Clothing", to: "/clothing", icon: "mdi-tshirt-crew" },
  { text: "Groceries", to: "/groceries", icon: "mdi-cart" },
  { text: "Best Seller", to: "/bestseller", icon: "mdi-cash-register" },
]);

const productStore = useProductStore();

//Show new product form dialog
const dialogVisible = ref(false);

const newProduct = ref({
  name: "",
  description: "",
  price: 0,
  rating: 0,
  stock: 0,
  image: "",
  category: "",
});

const formValid = ref(false);
const categories = ["Electronics", "Clothing", "Groceries"];

const openAddProductDialog = () => {
  dialogVisible.value = true;
};

//Add new product to the database
const addProduct = async () => {
  try {
    await productStore.addProduct(newProduct.value);
    dialogVisible.value = false;
    newProduct.value = { name: "", description: "", price: 0, rating: 0, stock: 0, image: "", category: "" }; // Reset form data
  } catch (error) {
    console.error("Error adding product:", error);
  }
};
</script>
