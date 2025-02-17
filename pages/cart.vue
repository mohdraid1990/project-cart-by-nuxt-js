<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6">Shopping Cart</h1>
    
    <div v-if="cart.length === 0" class="text-center py-8">
      <v-card elevation="2" rounded="lg" class="pa-12">
        <v-icon size="96" color="grey-lighten-1">mdi-cart-outline</v-icon>
        <div class="text-h5 mt-6 mb-4">Your cart is empty</div>
        <p class="text-body-1 text-grey mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <v-btn
          color="primary"
          size="x-large"
          to="/"
          class="text-none"
          prepend-icon="mdi-shopping"
        >
          Start Shopping
        </v-btn>
      </v-card>
    </div>

    <template v-else>
      <v-card elevation="2" rounded="lg">
        <v-list class="pa-4">
          <v-list-item
            v-for="(item, index) in cart"
            :key="index"
            :title="item.title"
            :subtitle="`Category: ${item.category}`"
            rounded="lg"
            class="mb-2"
          >
            <template v-slot:prepend>
              <v-avatar size="100" rounded="lg" class="mr-4">
                <v-img :src="item.image" cover></v-img>
              </v-avatar>
            </template>
            
            <template v-slot:append>
              <div class="d-flex flex-column align-end">
                <div class="text-h6 text-primary mb-2">${{ item.price.toFixed(2) }}</div>
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  variant="text"
                  @click="removeItem(index)"
                  class="ml-2"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <div class="pa-6 d-flex flex-wrap justify-space-between align-center">
          <div>
            <div class="text-body-1 text-grey mb-1">Total Amount</div>
            <div class="text-h4 text-primary font-weight-bold">
              ${{ totalPrice.toFixed(2) }}
            </div>
          </div>
          <v-btn
            color="primary"
            size="x-large"
            @click="checkout"
            class="text-none"
            prepend-icon="mdi-check-circle"
          >
            Proceed to Checkout
          </v-btn>
        </div>
      </v-card>
    </template>

    <v-dialog v-model="showThankYou" max-width="500">
      <v-card rounded="lg">
        <v-card-text class="text-center pa-12">
          <v-icon size="96" color="success">mdi-check-circle</v-icon>
          <h2 class="text-h4 font-weight-bold mt-6 mb-4">Thank You for Your Purchase!</h2>
          <p class="text-body-1 mb-8">Your order has been successfully placed and will be processed soon.</p>
          <v-btn
            color="primary"
            size="x-large"
            block
            @click="finishCheckout"
            class="text-none"
          >
            Continue Shopping
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const cart = ref([])
const showThankYou = ref(false)

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0)
})

onMounted(() => {
  loadCart()
})

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
}

function removeItem(index) {
  cart.value.splice(index, 1)
  localStorage.setItem('cart', JSON.stringify(cart.value))
  window.dispatchEvent(new Event('storage'))
}

function checkout() {
  showThankYou.value = true
}

function finishCheckout() {
  showThankYou.value = false
  cart.value = []
  localStorage.setItem('cart', '[]')
  window.dispatchEvent(new Event('storage'))
  navigateTo('/')
}
</script>