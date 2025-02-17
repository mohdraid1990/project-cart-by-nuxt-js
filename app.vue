<template>
  <v-app>
    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      elevation="4" 
      class="sidebar"
      width="320"
    >
      <div class="d-flex justify-end pa-2">
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="drawer = false" 
          class="close-btn"
          color="primary"
        ></v-btn>
      </div>
      <v-list-item
        prepend-avatar="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
        title="E-Commerce Store"
        subtitle="Welcome!"
        class="py-4 menu-header"
      ></v-list-item>
      <v-divider></v-divider>
      
      <!-- Navigation Menu -->
      <v-list density="comfortable" nav class="pa-2">
        <v-list-item 
          to="/" 
          prepend-icon="mdi-home" 
          title="Home" 
          rounded="xl" 
          class="mb-2 menu-item" 
          @click="drawer = false"
        />
        <v-list-item 
          to="/cart" 
          prepend-icon="mdi-cart" 
          title="Shopping Cart" 
          rounded="xl" 
          class="mb-2 menu-item" 
          @click="drawer = false"
        />
      </v-list>

      <v-divider class="my-2"></v-divider>

      <!-- Categories Filter -->
      <div class="px-4 py-2">
        <div class="d-flex align-center mb-4">
          <v-icon size="24" color="primary" class="mr-2">mdi-filter-variant</v-icon>
          <span class="text-h6 font-weight-bold">Categories</span>
        </div>
        <v-list class="category-list pa-0">
          <v-list-item
            v-for="category in categories"
            :key="category"
            :value="category"
            :active="selectedCategory === category"
            @click="selectCategory(category)"
            class="category-filter-item mb-2"
            rounded="xl"
          >
            <template v-slot:prepend>
              <v-icon :color="selectedCategory === category ? 'white' : 'primary'" class="category-icon">
                {{ getCategoryIcon(category) }}
              </v-icon>
            </template>
            <v-list-item-title :class="{'text-white': selectedCategory === category}">
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </v-list-item-title>
            <template v-slot:append>
              <v-chip
                v-if="getCategoryCount(category)"
                :color="selectedCategory === category ? 'white' : 'primary'"
                :text-color="selectedCategory === category ? 'primary' : 'white'"
                size="small"
                class="category-count"
              >
                {{ getCategoryCount(category) }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-app-bar flat color="primary" elevation="4" class="app-bar">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" class="nav-icon"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-white font-weight-bold app-title">
        <span class="d-none d-sm-inline">E-Commerce Store</span>
        <span class="d-sm-none">E-Store</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/cart" icon color="white" class="mr-2 cart-button">
        <v-badge 
          :content="cartItemCount" 
          :value="cartItemCount" 
          color="error" 
          location="top end"
          class="cart-badge"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4 main-content">
      <v-container class="py-8 px-4">
        <NuxtPage />
      </v-container>
    </v-main>

    <v-footer class="bg-primary text-center d-flex flex-column footer">
      <div class="text-white pt-4 pb-3">
        <strong>E-Commerce Store</strong> © {{ new Date().getFullYear() }}
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
const drawer = ref(false)
const cartItemCount = ref(0)
const categories = ref(['all'])
const selectedCategory = ref('all')
const products = ref([])

function getCategoryIcon(category) {
  const icons = {
    'all': 'mdi-view-grid',
    'electronics': 'mdi-television',
    'jewelery': 'mdi-diamond-stone',
    "men's clothing": 'mdi-tshirt-crew',
    "women's clothing": 'mdi-dress'
  }
  return icons[category] || 'mdi-shape'
}

function getCategoryCount(category) {
  if (category === 'all') return products.value.length
  return products.value.filter(p => p.category === category).length
}

function selectCategory(category) {
  selectedCategory.value = category
  drawer.value = false
}

onMounted(async () => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartItemCount.value = cart.length
  }

  try {
    const [productsData, categoriesData] = await Promise.all([
      fetch('https://fakestoreapi.com/products').then(res => res.json()),
      fetch('https://fakestoreapi.com/products/categories').then(res => res.json())
    ])
    
    products.value = productsData
    categories.value = ['all', ...categoriesData]
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  window.addEventListener('storage', updateCartCount)
  updateCartCount()

  onUnmounted(() => {
    window.removeEventListener('storage', updateCartCount)
  })
})

provide('selectedCategory', selectedCategory)
</script>

<style lang="scss">

// Import Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.sidebar {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 0 24px 24px 0;
  overflow: hidden;
}

.menu-header {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
  border-radius: 16px;
  margin: 0 16px;
}

.menu-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 4px 8px;
  border-radius: 16px !important;
  position: relative;
  overflow: hidden;
}

.category-filter-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(33, 150, 243, 0.1);
  background: white;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--v-theme-primary);
    background: rgba(33, 150, 243, 0.05);
  }

  &.v-list-item--active {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
  }
}

.category-count {
  font-size: 0.75rem;
  font-weight: 600;
}

.category-icon {
  transition: all 0.3s ease;
}

.category-filter-item:hover .category-icon {
  transform: scale(1.1);
}

.close-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;

  &:hover {
    transform: rotate(90deg);
    background: rgba(33, 150, 243, 0.1);
  }
}

.app-bar {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
  backdrop-filter: blur(10px);
}

.nav-icon {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.cart-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1);
  }
}

.cart-badge {
  transition: transform 0.3s ease;
}

.cart-button:hover .cart-badge {
  transform: scale(1.1);
}

.main-content {
  min-height: calc(100vh - 128px);
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}

.footer {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

// Responsive Styles
@media (max-width: 600px) {
  .app-title {
    font-size: 1.25rem !important;
  }

  .category-filter-item {
    margin: 4px 0;
  }

  .v-container {
    padding: 16px 12px !important;
  }
}

@media (min-width: 320px) and (max-width: 374px) {
  .app-title {
    font-size: 1.1rem !important;
  }

  .cart-button {
    margin-right: 4px !important;
  }

  .menu-header {
    margin: 0 8px;
  }

  .category-filter-item {
    margin: 2px 0;
    padding: 8px !important;
  }

  .category-count {
    font-size: 0.7rem;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .sidebar {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .category-filter-item {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .main-content {
    background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  }
}


</style>
