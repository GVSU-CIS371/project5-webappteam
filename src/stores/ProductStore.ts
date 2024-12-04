import { defineStore } from "pinia";
import { ProductDoc } from "../types/product";
import { initProducts } from "../data-init";

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    products: [] as ProductDoc[],
    sortedProducts: [] as ProductDoc[],
  }),
  actions: {
    init(){
      this.products = initProducts;
      this.sortedProducts = this.products;
    },
    filterByCategory(category: string){
      this.sortedProducts = this.products.filter((product) => product.data.category === category);
    },
    filterByRating(minRating: number){
      this.sortedProducts = this.products.filter((product) => product.data.rating >= minRating);
    },
  },
});
