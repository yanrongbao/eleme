<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <header-detail :seller="seller"></header-detail>
    </div>
</template>

<script>
import VHeader from 'components/v-header/v-header.vue';
import HeaderDetail from 'components/header-detail/header-detail.vue';
import { getSeller } from 'api'

export default {
    name: 'app',
    data () {
        return {
            seller: {}
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
        HeaderDetail
    }
}
</script>

<style lang="stylus"></style>
