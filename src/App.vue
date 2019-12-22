<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <tab :tabs="tabs" :initialIndex="0"></tab>
    </div>
</template>

<script>
import VHeader from 'components/v-header/v-header.vue';
import tab from 'components/tab/tab.vue';
import Goods from 'components/goods/goods.vue';
import Ratings from 'components/ratings/ratings.vue';
import Seller from 'components/seller/seller.vue';
import { getSeller } from 'api';

export default {
    name: 'app',
    data () {
        return {
            seller: {}
        }
    },
    computed: {
        tabs () {
            return [
                {
                    label: '商品',
                    component: Goods,
                    data: {
                        seller: this.seller
                    }
                },
                {
                    label: '评价',
                    component: Ratings,
                    data: {
                        seller: this.seller
                    }
                },
                {
                    label: '商家',
                    component: Seller,
                    data: {
                        seller: this.seller
                    }
                }
            ]
        }
    },
    methods: {
        _getSeller () {
            getSeller().then(seller => {
                this.seller = seller;
            })
        }
    },
    created () {
        this._getSeller();
    },
    components: {
        VHeader,
        tab
    }
}
</script>

<style lang="stylus"></style>
