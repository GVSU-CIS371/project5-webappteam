import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./components/Home.vue";
import GroceriesView from "./components/Groceries.vue"
import ElectronicsView from "./components/Electronics.vue"
import ClothingView from "./components/Clothing.vue"
import BestSellerView from "./components/BestSeller.vue"
const routes = [
  {
    path: "/",
    name: "home",
    props: true,
    component: HomeView,
  },
  // you need to add more routes here
  {
    path: "/groceries",
    name: "grocery",
    props: true,
    component: GroceriesView,
  },
  {
    path: "/electronics",
    name: "electronics",
    props: true,
    component: ElectronicsView,
  },
  {
    path: "/clothing",
    name: "clothing",
    props: true,
    component: ClothingView,
  },
  {
    path: "/bestseller",
    name: "bestseller",
    props: true,
    component: BestSellerView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
