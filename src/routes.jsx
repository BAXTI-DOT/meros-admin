import Category from "views/Category/TableList";
import Subcategory from "views/Subcategory";
import Subclass from "views/Subclass";
import Products from "views/Products/Products";
import UserProfile from "views/UserProfile";
import Order from 'views/Orders/Order'
import Filter from 'views/Filters/Filter'

var routes = [
  {
    path: "/category",
    name: "Category",
    icon: "tim-icons icon-puzzle-10",
    component: Category,
    layout: "/admin",
  },
  {
    path: "/subcategory",
    name: "Subcategory",
    icon: "tim-icons icon-app",
    component: Subcategory,
    layout: "/admin",
  },
  {
    path: "/subclass",
    name: "Subclass",
    icon: "tim-icons icon-single-copy-04",
    component: Subclass,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Products",
    icon: "tim-icons icon-bag-16",
    component: Products,
    layout: "/admin",
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "tim-icons icon-cart",
    component: Order,
    layout: "/admin",
  },
  {
    path: "/filters",
    name: "Filters",
    icon: "tim-icons icon-align-center",
    component: Filter,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
  }
];
export default routes;
