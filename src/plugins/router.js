import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/es5/services/goto'

import ProductExplorerRte from '@/routes/product-explorer'
import ProductPage from '@/routes/product-page'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: ProductExplorerRte
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "adminPages" */ '@/components/admin-container'),
    children: [
      {
        path: 'product/create',
        component: () => import(/* webpackChunkName: "adminPages" */ '@/routes/admin/product/new-product')
      },
      {
        path: 'product/import',
        component: () => import(/* webpackChunkName: "adminPages" */ '@/routes/admin/product/import-product')
      },
      {
        path: 'product/add-codes',
        component: () => import(/* webpackChunkName: "adminPages" */ '@/routes/admin/product/add-codes-to-product')
      },
      {
        path: 'category/create',
        component: () => import(/* webpackChunkName: "adminPages" */ '@/routes/admin/category/new-category')
      },
      {
        path: 'orders/list',
        component: () => import(/* webpackChunkName: "adminPages" */ '@/routes/admin/list-orders')
      }
    ]
  },
  {
    path: '/debug/redis-tools',
    component: () => import(/* webpackChunkName: "debugRedisTools" */ '@/routes/redis-tools')
  },
  {
    path: '/product/by-id/:productID',
    component: ProductPage
  },
  {
    path: '/cart',
    component: () => import(/* webpackChunkName: "cart" */ '@/routes/cart/list-products-in-cart')
  },
  {
    path: '/cart/payments',
    component: () => import(/* webpackChunkName: "cart" */ '@/routes/cart/payments')
  },
  {
    path: '/order/:id',
    component: () => import(/* webpackChunkName: "order" */ '@/routes/order/view-order')
  },
  {
    path: '/my/orders',
    component: () => import(/* webpackChunkName: "order" */ '@/routes/order/your-orders')
  }
  // {
  //  path: '/cart/review',
  //  component: () => import(/* webpackChunkName: "cart" */ '@/routes/cart/review')
  // }
]

export default new VueRouter({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
  routes
})
