<template>
    <div class="shop-cart-sticky"
         v-show="visible">
        <shop-cart ref="shopCart"
                   :selectFoods="selectFoods"
                   :deliveryPrice="deliveryPrice"
                   :minPrice="minPrice"
                   :fold="fold"
                   :sticky="true"></shop-cart>
    </div>
</template>
<script>
import ShopCart from 'components/shop-cart/shop-cart.vue';
import popupMixin from 'common/mixins/popup';
export default {
    mixins: [popupMixin],
    name: 'shop-cart-sticky',
    props: {
        selectFoods: {
            type: Array,
            default: () => ([])
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        fold: {
            type: Boolean,
            default: false
        },
        list: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        drop (el) {
            this.$refs.shopCart.drop(el);
        }
    },
    components: {
        ShopCart
    }
}
</script>
<style lang="stylus" scoped>
.shop-cart-sticky
    position absolute;
    left 0;
    bottom 0;
    z-index 999;
    width 100vw;
    height 48px;
</style>
