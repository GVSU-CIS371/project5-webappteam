import { defineStore } from "pinia";
import { ProductDoc } from "../types/product";
import { initProducts } from "../data-init";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

//Set up firebase 
const firebaseConfig = {
  apiKey: "AIzaSyD4sMzqjevTnnqq7SKw2Y53AykXzGjVQ0E",
  authDomain: "cis371-webapp.firebaseapp.com",
  projectId: "cis371-webapp",
  storageBucket: "cis371-webapp.firebasestorage.app",
  messagingSenderId: "101420504460",
  appId: "1:101420504460:web:f386eb7601a02e8999f2a9",
  measurementId: "G-02G0XXQ8KW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    products: [] as ProductDoc[],
    sortedProducts: [] as ProductDoc[],
  }),
  actions: {
    async init() {
      const productsCollection = collection(db, "products");

      try {
        const querySnapshot = await getDocs(productsCollection);

        // If the collection is empty, add the initial products
        if (querySnapshot.empty) {
          for (const product of initProducts) {
            await addDoc(productsCollection, {
              name: product.data.name,
              description: product.data.description,
              price: product.data.price,
              rating: product.data.rating,
              stock: product.data.stock,
              image: product.data.image,
              category: product.data.category,
            });
          }
        } else {
          //Do nothing because there are still products in the database
        }

        // Fetch the products from Firestore and update the store
        const fetchedProducts: ProductDoc[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({
            id: doc.id,
            data: doc.data() as ProductDoc['data'],
          });
        });

        // Set the fetched products to the store state
        this.products = fetchedProducts;
        this.sortedProducts = fetchedProducts;

      } catch (error) {
        console.error("Error checking or adding products to Firestore: ", error);
      }
    },
    filterByCategory(category: string) {
      this.sortedProducts = this.products.filter((product) => product.data.category === category);
    },
    filterByRating(minRating: number) {
      this.sortedProducts = this.products.filter((product) => product.data.rating >= minRating);
    },

    //Add a product to database
    async addProduct(product: {
        name: string;
        description: string;
        price: number;
        rating: number;
        stock: number;
        image: string;
        category: string;
      }) {
        try {
          const productsCollection = collection(db, "products");
          const docRef = await addDoc(productsCollection, {
            name: product.name,
            description: product.description,
            price: product.price,
            rating: product.rating,
            stock: product.stock,
            image: product.image,
            category: product.category,
          });
          this.init(); //refresh display after new post is added so it shows up
        } catch (error) {
          console.error("Error adding product to Firestore: ", error);
          throw error;
        }
    },

    //Delete product from the database
    async deleteProduct(productId: string) {
      try {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);  //remove from database
        this.products = this.products.filter((product) => product.id !== productId); //remove from products list
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    },

    //Update a products information in database
    async updateProduct(updatedProduct: any) {
      const productRef = doc(db, "products", updatedProduct.id);
      try {
        await updateDoc(productRef, updatedProduct.data); //update product in database
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;  //update product in product list
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
  },
});
