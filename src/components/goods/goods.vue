<template>
    <div class="scroll-nav-wrapper">
        <cube-scroll-nav @change="changeHandler"
                         :side="true"
                         :data="goods"
                         :current="current"
                         v-if="goods.length">
            <cube-scroll-nav-panel v-for="good in goods"
                                   :key="good.name"
                                   :label="good.name"
                                   :title="good.name">
                <ul>
                    <li v-for="(food,index) in good.foods"
                        :key="index"
                        class="food-item">
                        <div class="icon">
                            <img width="57"
                                 height="57"
                                 :src="food.icon">
                        </div>
                        <div class="content">
                            <h2 class="name">{{food.name}}</h2>
                            <p class="desc">{{food.description}}</p>
                            <div class="extra">
                                <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                            </div>
                            <div class="price">
                                <span class="now">￥{{food.price}}</span><span class="old"
                                      v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol @add="addFood"
                                             :food="food"></cartcontrol>
                            </div>
                        </div>
                    </li>
                </ul>
            </cube-scroll-nav-panel>
        </cube-scroll-nav>
        <div class="shop-cart-wrapper">
            <shop-cart :delivery-price="seller.deliveryPrice"
                       :select-foods="selectFoods"
                       :min-price="seller.minPrice"></shop-cart>
        </div>
    </div>
</template>
<script>
import { getGoods } from 'api';
import ShopCart from 'components/shop-cart/shop-cart.vue';
import cartcontrol from 'components/cartcontrol/cartcontrol';
export default {
    data () {
        return {
            goods: [],
            scrollOptions: {
                cilck: false,
                directionLockThreshold: 0
            },
            current: '热销榜'
        }
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        seller () {
            return this.data.seller;
        },
        selectFoods () {
            const ret = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        ret.push(food)
                    }
                })
            })
            return ret;
        }
    },
    methods: {
        changeHandler (label) {
            this.current = label;
        },
        fetch () {
            getGoods().then(goods => {
                this.goods = goods;
            })
        },
        stickyChangeHandler (current) {
            console.log('sticky-change', current)
        },
        addFood () {

        }
    },
    components: {
        ShopCart,
        cartcontrol
    }
}
</script>
<style lang="stylus" scoped>
@import 'common/stylus/variable.styl';
.scroll-nav-wrapper
    width 100%;
    position absolute;
    top 0;
    left 0;
    bottom 48px;
    >>> .cube-scroll-nav-bar
        width 80px;
        white-space normal;
        overflow hidden;
    >>> .cube-scroll-nav-bar-item
        padding 0 10px;
        display flex;
        align-items center;
        justify-content center;
        height 56px;
        line-height 14px;
        font-size 14px;
    >>> .cube-scroll-nav-panel-title
        padding 15px;
        font-size $fontsize-small;
        background-color $color-background-ssss;
    .food-item
        display flex;
        padding 15px 0;
        font-size 13px;
        .name
            font-size 15px;
        .icon
            margin 0 15px 0 0;
        .desc, .extra, .old
            color #666;
        .extra
            .count
                margin 0 20px 0 0;
        .content
            line-height 20px;
        .price
            .now
                color $color-red;
                margin 0 15px 0 0;
            .old
                font-size $fontsize-small;
                text-decoration line-through;
</style>
