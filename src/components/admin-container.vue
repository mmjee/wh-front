<template>
  <div v-if="$store.state.user.user && $store.state.user.user.privilegeLevel < 3">
    <p>You are not authorized to be on this page.</p>
  </div>
  <v-container v-else>
    <v-toolbar
        flat
        color="primary"
        dark
    >
      <v-toolbar-title>Admin Operations</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab link to="/admin/product/create">
        <v-icon left>
          library_add
        </v-icon>
        Create New Product
      </v-tab>
      <v-tab link to="/admin/product/import">
        <v-icon left>
          sync_alt
        </v-icon>
        Import Products
      </v-tab>
      <v-tab link to="/admin/product/add-codes">
        <v-icon left>
          add
        </v-icon>
        Add Codes to Product
      </v-tab>
      <v-tab link to="/admin/category/create">
        <v-icon left>
          library_add
        </v-icon>
        Create New Category
      </v-tab>
      <v-divider class="my-4" />
      <v-tab link to="/admin/orders/list">
        <v-icon left>
          payments
        </v-icon>
        Placed Orders
      </v-tab>
      <v-tab link to="/admin/product/info-table">
        <v-icon left>
          inventory_2
        </v-icon>
        Products and Inventory
      </v-tab>
      <v-tabs-items>
        <router-view />
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  name: 'AdminContainer'
}
</script>
