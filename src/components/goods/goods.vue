<template>
    <div class="scroll-nav-wrapper">
        <cube-scroll-nav :side="true"
                         :data="goods"
                         :current="current"
                         v-if="goods.length">
            <template slot="bar"
                      slot-scope="props">
                <cube-scroll-nav-bar direction="vertical"
                                     :labels="props.labels"
                                     :txts="barTxts"
                                     :current="props.current">
                    <template slot-scope="props">
                        <div class="text">
                            <span class="icon"
                                  :class="classMap[props.txt.type]"
                                  v-if="props.txt.type>=1"></span>
                            <span>{{props.txt.name}}</span>
                            <span class="num"
                                  v-if="props.txt.count">
                                <bubble :num="props.txt.count"></bubble>
                            </span>
                        </div>
                    </template>
                </cube-scroll-nav-bar>
            </template>
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
                            <div class="price_cont">
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span class="old"
                                          v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @add="onAdd"
                                                 :food="food"></cartcontrol>
                                </div>
                            </div>

                        </div>
                    </li>
                </ul>
            </cube-scroll-nav-panel>
        </cube-scroll-nav>
        <div class="shop-cart-wrapper">
            <shop-cart :delivery-price="seller.deliveryPrice"
                       :select-foods="selectFoods"
                       :min-price="seller.minPrice"
                       ref="shopCart"></shop-cart>
        </div>
    </div>
</template>
<script>
import { getGoods } from 'api';
import ShopCart from 'components/shop-cart/shop-cart.vue';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import bubble from 'components/bubble/bubble'
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
    created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
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
        },
        barTxts () {
            let ret = [];
            this.goods.forEach((good) => {
                const { type, name, foods } = good;
                let count = 0;
                foods.forEach((food) => {
                    count += food.count || 0;
                })
                ret.push({
                    type,
                    name,
                    count
                })
            })
            return ret;
        }
    },
    methods: {
        fetch () {
            getGoods().then(goods => {
                this.goods = goods;
            })
        },
        onAdd (el) {
            this.$refs.shopCart.drop(el)
        }
    },
    components: {
        ShopCart,
        cartcontrol,
        bubble
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin';
@import '~common/stylus/variable.styl';
.scroll-nav-wrapper
    width 100vw;
    position fixed;
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
            width 0;
            overflow hidden;
            flex 1;
        .price_cont
            position relative;
            .price
                .now
                    color $color-red;
                    margin 0 15px 0 0;
                .old
                    font-size $fontsize-small;
                    text-decoration line-through;
            .cartcontrol-wrapper
                position absolute;
                right 30px;
                top -2px;
    .text
        position relative;
        .icon
            width 16px;
            height 16px;
            display inline-block;
            background-size 100%;
            &.decrease
                bg-image('images/decrease_3');
            &.discount
                bg-image('images/discount_3');
            &.guarantee
                bg-image('images/guarantee_3');
            &.invoice
                bg-image('images/invoice_3');
            &.special
                bg-image('images/special_3');
        .num
            position absolute;
            right -10px;
            top -10px;
</style>
