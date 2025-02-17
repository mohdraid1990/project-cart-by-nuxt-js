<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-6">
        <div class="d-flex flex-wrap align-center">
          <h1 class="text-h3 font-weight-black gradient-text mb-2">
            {{
              selectedCategory === "all"
                ? "All Products"
                : selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
            }}
          </h1>
          <v-chip
            color="secondary"
            variant="elevated"
            class="ml-4 mt-2 mt-sm-0 items-chip"
          >
            {{ filteredProducts.length }} items
          </v-chip>
        </div>
        <p class="text-subtitle-1 text-grey-darken-1 mt-2 animate-text">
          Discover our amazing collection of products
        </p>
      </v-col>

      <v-col
        v-for="(product, index) in filteredProducts"
        :key="product.id"
        cols="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        class="product-col"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <v-card
          height="100%"
          elevation="4"
          rounded="xl"
          class="product-card"
          :hover="true"
        >
          <div class="product-image-wrapper">
            <div class="product-image-container">
              <v-img
                :src="product.image"
                height="300"
                cover
                class="bg-grey-lighten-2 product-image"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <div class="product-overlay">
                <v-btn
                  icon="mdi-eye"
                  variant="flat"
                  color="white"
                  size="x-large"
                  @click="$router.push('/product/' + product.id)"
                  class="overlay-btn mr-2"
                >
                  <v-tooltip activator="parent" location="top"
                    >View Details</v-tooltip
                  >
                  <v-icon
                    ><i
                      class="mdi-information mdi v-icon notranslate v-theme--light v-icon--size-default"
                      aria-hidden="true"
                    ></i
                  ></v-icon>
                </v-btn>
                <v-btn
                  icon="mdi-cart-plus"
                  variant="flat"
                  color="secondary"
                  size="x-large"
                  @click="addToCart(product)"
                  class="overlay-btn ml-2"
                >
                  <v-tooltip activator="parent" location="top"
                    >Add to Cart</v-tooltip
                  >
                  <v-icon>mdi-cart</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="product-badge" v-if="product.price < 50">
              Special Offer
            </div>
          </div>
          <v-card-text class="product-content pa-6">
            <div class="d-flex flex-column h-100">
              <div class="category-label mb-2">
                {{ product.category }}
              </div>
              <div class="product-title mb-2">
                {{ product.title }}
              </div>
              <div
                class="product-price mt-auto d-flex align-center justify-space-between"
              >
                <span class="price-tag">${{ product.price.toFixed(2) }}</span>
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="addToCart(product)"
                  class="buy-button"
                >
                  Buy Now
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);
const selectedCategory = inject("selectedCategory");

const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") return products.value;
  return products.value.filter((p) => p.category === selectedCategory.value);
});

onMounted(async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products.value = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}
</script>

<style scoped lang="scss">
.gradient-text {
  background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: gradientFlow 8s ease infinite;
  background-size: 200% 200%;
}

.animate-text {
  animation: slideInRight 0.8s ease-out;
  color: #6366F1;
}

.items-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.product-col {
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.product-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transform-origin: center bottom;

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
    border-color: #6366F1;
  }
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.product-image {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(99, 102, 241, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-badge {
  position: absolute;
  top: 16px;
  right: -32px;
  background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
  color: white;
  padding: 6px 40px;
  transform: rotate(45deg);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  z-index: 1;
  animation: badgePulse 2s infinite;
}

.product-card:hover {
  .product-overlay {
    opacity: 1;
  }

  .product-image {
    transform: scale(1.15) rotate(2deg);
  }
}

.overlay-btn {
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  opacity: 0;

  &:first-child {
    transition-delay: 0.1s;
  }

  &:last-child {
    transition-delay: 0.2s;
  }
}

.product-card:hover {
  .overlay-btn {
    transform: translateY(0);
    opacity: 1;
  }
}

.product-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
}

.category-label {
  color: #6366F1;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  transition: all 0.3s ease;
}

.product-card:hover {
  .category-label {
    background: rgba(99, 102, 241, 0.2);
    transform: translateX(4px);
  }
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #2c3e50;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
  transition: color 0.3s ease;
}

.product-card:hover {
  .product-title {
    color: #6366F1;
  }
}

.price-tag {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 8s ease infinite;
  background-size: 200% 200%;
}

.buy-button {
  transform: translateX(10px);
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover {
  .buy-button {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
  80% {
    opacity: 1;
    transform: scale(0.89);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes badgePulse {
  0% {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: 0 4px 24px rgba(236, 72, 153, 0.5);
  }
  100% {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// Responsive Styles
@media (max-width: 600px) {
  .gradient-text {
    font-size: 2rem !important;
  }

  .product-image {
    height: 240px !important;
  }

  .product-content {
    padding: 16px !important;
  }

  .product-title {
    font-size: 14px;
    height: 40px;
  }

  .price-tag {
    font-size: 20px;
  }

  .buy-button {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (min-width: 320px) and (max-width: 374px) {
  .gradient-text {
    font-size: 1.75rem !important;
  }

  .product-card {
    margin: 0 -8px;
  }

  .product-content {
    padding: 12px !important;
  }

  .product-title {
    font-size: 13px;
    height: 36px;
  }

  .price-tag {
    font-size: 18px;
  }

  .overlay-btn {
    transform: scale(0.8);
  }

  .category-label {
    font-size: 10px;
    padding: 2px 6px;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .product-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .product-title {
    color: #fff;
  }

  .product-content {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-top-color: rgba(99, 102, 241, 0.2);
  }

  .category-label {
    background: rgba(99, 102, 241, 0.2);
  }

  .product-card:hover {
    .category-label {
      background: rgba(99, 102, 241, 0.3);
    }
  }
}
</style>
