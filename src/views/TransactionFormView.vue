<template>
  <div class="max-w-7xl mx-auto p-2">
    <div class="bg-white rounded-lg shadow p-3">
      <div class="mb-2">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Transaction' : 'New Transaction' }}
        </h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <!-- Transaction Details -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 px-3 py-1.5 bg-gray-50 border-l-4 border-primary-500 rounded-r">
            Transaction Details
          </h3>
          <div class="grid grid-cols-6 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
              <input v-model="form.date" type="date" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Bill Number <span class="text-red-500">*</span></label>
              <input v-model="form.billNumber" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Received Amount</label>
              <input v-model.number="form.receivedAmount" type="number" step="0.01" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Received Date</label>
              <input v-model="form.receivedDate" type="date" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Commission</label>
              <input v-model.number="form.commission" type="number" step="0.01" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Remarks</label>
              <input v-model="form.remarks" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
          </div>
        </div>

        <!-- Buyer Info -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 px-3 py-1.5 bg-gray-50 border-l-4 border-primary-500 rounded-r">
            Buyer Information
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <div class="relative">
              <label class="block text-xs font-medium text-gray-700">Buyer Name <span class="text-red-500">*</span></label>
              <input v-model="form.buyerName" @input="handleBuyerInput" @focus="showBuyerDropdown = true" @blur="hideBuyerDropdown" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" autocomplete="off" />
              <!-- Buyer Dropdown -->
              <div v-if="showBuyerDropdown && filteredBuyerOptions.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <div v-for="buyer in filteredBuyerOptions" :key="buyer.id" 
                     @mousedown="selectBuyer(buyer)"
                     class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  {{ buyer.name }}
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Town <span class="text-red-500">*</span></label>
              <input v-model="form.town" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" :readonly="!isNewBuyer && form.buyerName" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Buyer Mobile <span class="text-red-500">*</span></label>
              <input v-model="form.buyerMobile" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" :readonly="!isNewBuyer && form.buyerName" />
            </div>
          </div>
        </div>

        <!-- Seller Info -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 px-3 py-1.5 bg-gray-50 border-l-4 border-primary-500 rounded-r">
            Seller Information
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <div class="relative">
              <label class="block text-xs font-medium text-gray-700">Seller Name <span class="text-red-500">*</span></label>
              <input v-model="form.seller" @input="handleSellerInput" @focus="showSellerDropdown = true" @blur="hideSellerDropdown" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" autocomplete="off" />
              <!-- Seller Dropdown -->
              <div v-if="showSellerDropdown && filteredSellerOptions.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <div v-for="seller in filteredSellerOptions" :key="seller.id" 
                     @mousedown="selectSeller(seller)"
                     class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  {{ seller.name }}
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Town <span class="text-red-500">*</span></label>
              <input v-model="form.sellerTown" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" :readonly="!isNewSeller && form.seller" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Mobile <span class="text-red-500">*</span></label>
              <input v-model="form.sellerMobile" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" :readonly="!isNewSeller && form.seller" />
            </div>
          </div>
        </div>

        <!-- Transport/Logistics -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 px-3 py-1.5 bg-gray-50 border-l-4 border-primary-500 rounded-r">
            Transport / Logistics
          </h3>
          <div class="grid grid-cols-4 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-700">Lorry Number <span class="text-red-500">*</span></label>
              <input v-model="form.lorryNumber" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Freight <span class="text-red-500">*</span></label>
              <input v-model.number="form.freight" type="number" step="0.01" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Driver Number <span class="text-red-500">*</span></label>
              <input v-model="form.driverNumber" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Driver Name <span class="text-red-500">*</span></label>
              <input v-model="form.driverName" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Transport <span class="text-red-500">*</span></label>
              <input v-model="form.transport" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Lorry Owner <span class="text-red-500">*</span></label>
              <input v-model="form.lorryOwner" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Lorry Owner Name <span class="text-red-500">*</span></label>
              <input v-model="form.lorryOwnerName" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
            </div>
          </div>
        </div>

        <!-- Transaction Items -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 px-3 py-1.5 bg-gray-50 border-l-4 border-primary-500 rounded-r">
            Transaction Items
          </h3>
          <div v-for="(item, idx) in form.items" :key="idx" class="bg-gray-50 border border-gray-200 rounded p-2 mb-2">
            <div class="grid grid-cols-7 gap-2">
              <div class="relative">
                <label class="block text-xs font-medium text-gray-700">Variety <span class="text-red-500">*</span></label>
                <input v-model="item.variety" @input="handleVarietyInput($event, item)" @focus="showVarietyDropdown = idx" @blur="hideVarietyDropdown" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" autocomplete="off" />
                <!-- Variety Dropdown -->
                <div v-if="showVarietyDropdown === idx && filteredVarieties.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div v-for="variety in filteredVarieties" :key="variety.id" 
                       @mousedown="selectVariety(variety, item)"
                       class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                    {{ variety.name }}
                  </div>
                </div>
              </div>
              <div class="relative">
                <label class="block text-xs font-medium text-gray-700">Brand <span class="text-red-500">*</span></label>
                <input v-model="item.brand" @input="handleBrandInput($event, item)" @focus="showBrandDropdown = idx" @blur="hideBrandDropdown" type="text" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" autocomplete="off" />
                <!-- Brand Dropdown -->
                <div v-if="showBrandDropdown === idx && filteredBrands.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div v-for="brand in filteredBrands" :key="brand.id" 
                       @mousedown="selectBrand(brand, item)"
                       class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                    {{ brand.name }}
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">KG <span class="text-red-500">*</span></label>
                <input v-model.number="item.kg" type="number" step="0.01" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">Bags <span class="text-red-500">*</span></label>
                <input v-model.number="item.numberOfBags" type="number" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">Quantity <span class="text-red-500">*</span></label>
                <input v-model.number="item.quantity" type="number" step="0.01" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50" readonly />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">Rate <span class="text-red-500">*</span></label>
                <input v-model.number="item.rate" type="number" step="0.01" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700">Amount <span class="text-red-500">*</span></label>
                <input v-model.number="item.billAmount" type="number" step="0.01" required class="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50" readonly />
              </div>
            </div>
            <div class="flex justify-end mt-1">
              <button type="button" class="px-2 py-0.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded" @click="removeItem(idx)" v-if="form.items.length > 1">
                Remove Item
              </button>
            </div>
          </div>
          <button type="button" class="mt-1 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded" @click="addItem">
            + Add Item
          </button>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
          <button type="button" @click="router.back()" class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">Cancel</button>
          <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded disabled:opacity-50">
            {{ loading ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
          </button>
        </div>

        <div v-if="error" class="mt-2 bg-red-50 border-l-4 border-red-500 p-2 rounded">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactions';
import { useBuyerStore } from '@/stores/buyers';
import { useSellerStore } from '@/stores/sellers';
import { useProductStore } from '@/stores/products';

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const buyerStore = useBuyerStore();
const sellerStore = useSellerStore();
const productStore = useProductStore();

const isEditing = computed(() => !!route.params.id);
const loading = ref(false);
const error = ref('');

const defaultItem = () => ({
  variety: '',
  brand: '',
  quantity: 0,
  rate: 0,
  billAmount: 0,
  kg: 0,
  numberOfBags: 0,
});

const form = ref({
  date: '',
  buyerName: '',
  town: '',
  seller: '',
  billNumber: '',
  receivedAmount: 0,
  receivedDate: '',
  remarks: '',
  lorryNumber: '',
  freight: 0,
  driverNumber: '',
  transport: '',
  buyerMobile: '',
  driverName: '',
  commission: 0,
  lorryOwner: '',
  lorryOwnerName: '',
  items: [defaultItem()],
});

const isNewBuyer = ref(false);
const showBuyerDropdown = ref(false);
const filteredBuyerOptions = computed(() => {
  if (!form.value.buyerName) return buyerStore.buyers;
  return buyerStore.buyers.filter(b => b.name.toLowerCase().includes(form.value.buyerName.toLowerCase()));
});

const isNewSeller = ref(false);
const showSellerDropdown = ref(false);
const filteredSellerOptions = computed(() => {
  if (!form.value.seller) return sellerStore.sellers;
  return sellerStore.sellers.filter(s => s.name.toLowerCase().includes(form.value.seller.toLowerCase()));
});

const showVarietyDropdown = ref(null);
const showBrandDropdown = ref(null);

const filteredVarieties = computed(() => {
  const currentItem = form.value.items[showVarietyDropdown.value];
  if (!currentItem?.variety) return productStore.varieties;
  return productStore.varieties.filter(v => 
    v.name.toLowerCase().includes(currentItem.variety.toLowerCase())
  );
});

const filteredBrands = computed(() => {
  const currentItem = form.value.items[showBrandDropdown.value];
  if (!currentItem?.brand) return productStore.brands;
  return productStore.brands.filter(b => 
    b.name.toLowerCase().includes(currentItem.brand.toLowerCase())
  );
});

onMounted(async () => {
  if (buyerStore.buyers.length === 0) {
    await buyerStore.fetchBuyers();
  }
  if (sellerStore.sellers.length === 0) {
    await sellerStore.fetchSellers();
  }
  if (productStore.varieties.length === 0) {
    await productStore.fetchVarieties();
  }
  if (productStore.brands.length === 0) {
    await productStore.fetchBrands();
  }
  if (isEditing.value) {
    try {
      const transaction = await transactionStore.fetchTransaction(route.params.id);
      if (transaction) {
        form.value = {
          ...transaction,
          date: new Date(transaction.date).toISOString().split('T')[0],
          receivedDate: new Date(transaction.receivedDate).toISOString().split('T')[0],
          items: transaction.items && transaction.items.length > 0
            ? transaction.items.map(item => ({ ...item }))
            : [defaultItem()],
        };
      }
    } catch (err) {
      error.value = 'Error loading transaction';
    }
  }
});

function handleBuyerInput() {
  const buyer = buyerStore.buyers.find(b => b.name.toLowerCase() === form.value.buyerName.toLowerCase());
  if (buyer) {
    form.value.town = buyer.town || '';
    form.value.buyerMobile = buyer.mobile || '';
    isNewBuyer.value = false;
  } else {
    form.value.town = '';
    form.value.buyerMobile = '';
    isNewBuyer.value = !!form.value.buyerName;
  }
  showBuyerDropdown.value = true;
}

function selectBuyer(buyer) {
  form.value.buyerName = buyer.name;
  form.value.town = buyer.town || '';
  form.value.buyerMobile = buyer.mobile || '';
  isNewBuyer.value = false;
  showBuyerDropdown.value = false;
}

function hideBuyerDropdown() {
  setTimeout(() => { showBuyerDropdown.value = false; }, 200);
}

function handleSellerInput() {
  const seller = sellerStore.sellers.find(s => s.name.toLowerCase() === form.value.seller.toLowerCase());
  if (seller) {
    form.value.sellerTown = seller.town || '';
    form.value.sellerMobile = seller.mobile || '';
    isNewSeller.value = false;
  } else {
    form.value.sellerTown = '';
    form.value.sellerMobile = '';
    isNewSeller.value = !!form.value.seller;
  }
  showSellerDropdown.value = true;
}

function selectSeller(seller) {
  form.value.seller = seller.name;
  form.value.sellerTown = seller.town || '';
  form.value.sellerMobile = seller.mobile || '';
  isNewSeller.value = false;
  showSellerDropdown.value = false;
}

function hideSellerDropdown() {
  setTimeout(() => { showSellerDropdown.value = false; }, 200);
}

function addItem() {
  form.value.items.push(defaultItem());
}
function removeItem(idx) {
  form.value.items.splice(idx, 1);
}

function handleVarietyInput(event, item) {
  const variety = productStore.varieties.find(v => v.name.toLowerCase() === item.variety.toLowerCase());
  if (!variety) {
    showVarietyDropdown.value = form.value.items.indexOf(item);
  }
}

function handleBrandInput(event, item) {
  const brand = productStore.brands.find(b => b.name.toLowerCase() === item.brand.toLowerCase());
  if (!brand) {
    showBrandDropdown.value = form.value.items.indexOf(item);
  }
}

function selectVariety(variety, item) {
  item.variety = variety.name;
  showVarietyDropdown.value = null;
}

function selectBrand(brand, item) {
  item.brand = brand.name;
  showBrandDropdown.value = null;
}

function hideVarietyDropdown() {
  setTimeout(() => { showVarietyDropdown.value = null; }, 200);
}

function hideBrandDropdown() {
  setTimeout(() => { showBrandDropdown.value = null; }, 200);
}

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (isNewBuyer.value && form.value.buyerName) {
      await buyerStore.createBuyer({
        name: form.value.buyerName,
        town: form.value.town,
        mobile: form.value.buyerMobile,
      });
      await buyerStore.fetchBuyers();
    }
    if (isNewSeller.value && form.value.seller) {
      await sellerStore.createSeller({
        name: form.value.seller,
        town: form.value.sellerTown,
        mobile: form.value.sellerMobile,
      });
      await sellerStore.fetchSellers();
    }
    
    for (const item of form.value.items) {
      const existingVariety = productStore.varieties.find(v => v.name.toLowerCase() === item.variety.toLowerCase());
      if (!existingVariety) {
        await productStore.createVariety({ name: item.variety });
      }
      
      const existingBrand = productStore.brands.find(b => b.name.toLowerCase() === item.brand.toLowerCase());
      if (!existingBrand) {
        await productStore.createBrand({ name: item.brand });
      }
    }

    // Sanitize and filter items
    const sanitizedItems = form.value.items
      .filter(item =>
        item.variety && item.brand && item.kg && item.numberOfBags && item.rate
      )
      .map(item => {
        const sanitized = {
          variety: item.variety,
          brand: item.brand,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          billAmount: Number(item.billAmount) || 0,
          kg: Number(item.kg) || 0,
          numberOfBags: Number(item.numberOfBags) || 0,
        };
        if (item.id) sanitized.id = item.id;
        return sanitized;
      });

    if (!sanitizedItems.length) {
      error.value = 'At least one valid item is required.';
      loading.value = false;
      return;
    }

    // Remove system and item-level fields from root
    const {
      createdAt,
      updatedAt,
      id, // root id
      userId,
      variety, brand, quantity, rate, billAmount, kg, numberOfBags, // item-level fields
      ...rest
    } = form.value;

    // Sanitize main payload
    const payload = {
      ...rest,
      commission: form.value.commission === '' || form.value.commission === null ? null : Number(form.value.commission),
      remarks: form.value.remarks === '' || form.value.remarks === null ? '' : form.value.remarks,
      receivedAmount: form.value.receivedAmount === '' || form.value.receivedAmount === null ? null : Number(form.value.receivedAmount),
      receivedDate: form.value.receivedDate === '' || form.value.receivedDate === null ? null : form.value.receivedDate,
      freight: form.value.freight === '' || form.value.freight === null ? null : Number(form.value.freight),
      items: sanitizedItems,
    };

    if (isEditing.value) {
      await transactionStore.updateTransaction(route.params.id, payload);
    } else {
      await transactionStore.createTransaction(payload);
    }
    router.push('/transactions');
  } catch (err) {
    error.value = err.message || 'Error saving transaction';
  } finally {
    loading.value = false;
  }
};

watch(() => form.value.items, (items) => {
  items.forEach(item => {
    watch([() => item.kg, () => item.numberOfBags], ([kg, numberOfBags]) => {
      if (kg && numberOfBags) {
        item.quantity = kg * numberOfBags;
      }
    }, { immediate: true });

    watch([() => item.quantity, () => item.rate], ([quantity, rate]) => {
      if (quantity && rate) {
        item.billAmount = quantity * rate;
      }
    }, { immediate: true });
  });
}, { deep: true });
</script> 