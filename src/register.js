import { createAPI } from 'cube-ui';
import Vue from 'vue';
import HeaderDetail from 'components/header-detail/header-detail.vue';
import ShopCartList from 'components/shop-cart-list/shop-cart-list.vue';
import ShopCartSticky from 'components/shop-cart-sticky/shop-cart-sticky.vue';
createAPI(Vue, HeaderDetail);
createAPI(Vue, ShopCartList);
createAPI(Vue, ShopCartSticky);
