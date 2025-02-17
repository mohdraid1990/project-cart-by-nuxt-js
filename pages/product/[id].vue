<template>
  <div v-if="product">
    <v-card elevation="2" rounded="lg" class="product-details">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="product.image"
            height="500"
            cover
            class="bg-grey-lighten-2 rounded-lg ma-4"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column pa-8">
          <div class="text-caption text-uppercase text-primary font-weight-bold mb-2">
            {{ product.category }}
          </div>
          <h1 class="text-h4 font-weight-bold mb-4">{{ product.title }}</h1>
          <v-divider class="mb-4"></v-divider>
          <p class="text-body-1 mb-8">{{ product.description }}</p>
          <div class="text-h4 text-primary font-weight-bold mb-8">
            ${{ product.price.toFixed(2) }}
          </div>
          <v-btn
            color="primary"
            size="x-large"
            block
            @click="addToCart"
            class="text-none"
            elevation="2"
          >
            <v-icon start>mdi-cart-plus</v-icon>
            Add to Cart
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <div v-else class="d-flex justify-center align-center" style="height: 400px">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>
</template>

<script setup>
const route = useRoute()
const product = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${route.params.id}`)
    product.value = await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
  }
})

function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push(product.value)
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('storage'))
}
</script>

<style>
.product-details {
  background-color: white;
}
</style>