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

        <v-card-actions class="d-flex justify-space-around">
          <v-btn @click="openModifyDialog(product)" color="green" icon>
            <v-icon>mdi-pencil</v-icon>Modify
          </v-btn>
          <v-btn @click="deleteProduct(product.id)" color="red" icon>
            <v-icon>mdi-delete</v-icon>Delete
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-col>
  </v-row>

    <!-- Modify Product Dialog -->
    <v-dialog v-model="modifyDialog" max-width="500px">
    <v-card>
      <v-card-title>Edit Product</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="productToModify.data.name"
          label="Product Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="productToModify.data.description"
          label="Product Description"
          required
        ></v-text-field>

        <v-text-field
          v-model="productToModify.data.price"
          label="Price"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model="productToModify.data.stock"
          label="Stock"
          type="number"
          required
        ></v-text-field>

        <v-text-field
          v-model="productToModify.data.rating"
          label="Rating"
          type="number"
          min="1"
          max="5"
          required
        ></v-text-field>

        <v-text-field
          v-model="productToModify.data.image"
          label="Image URL"
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="closeModifyDialog" color="grey">Cancel</v-btn>
        <v-btn @click="saveProduct" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useProductStore } from '../stores/ProductStore';
import { computed, ref } from "vue";

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

//Handle modify product dialog box
const modifyDialog = ref(false);
const productToModify = ref<any>(null);

const openModifyDialog = (product: any) => {
  productToModify.value = { ...product };
  modifyDialog.value = true;
};

const closeModifyDialog = () => {
  modifyDialog.value = false;
  productToModify.value = null;
};

// Save the modified product to database
const saveProduct = async () => {
  try {
    if (productToModify.value) {
      await productStore.updateProduct(productToModify.value);
      closeModifyDialog();
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

//Delete a product from database
const deleteProduct = async (productId: string) => {
  try {
    await productStore.deleteProduct(productId);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
</script>
