<template>
    <div>
        <div class="shopcart">
            <div class="content"
                 @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo"
                             :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart"
                               :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div class="num"
                             v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price"
                         :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right"
                     @click="pay">
                    <div class="pay"
                         :class="payClass">
                        {{payDesc}}
                    </div>
                </div>
            </div>
            <div class="ball-container">
                <div v-for="(ball,index) in balls"
                     :key="index">
                    <transition name="drop"
                                @before-enter="beforeDrop"
                                @enter="dropping"
                                @after-enter="afterDrop">
                        <div class="ball"
                             v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
const BALL_LEN = 10;
function createBalls () {
    let ret = [];
    for (let i = 0; i < BALL_LEN; i++) {
        ret.push({
            show: false
        })
    }
    return ret;
}
export default {
    created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    props: {
        selectFoods: {
            type: Array,
            default () {
                return [
                    {
                        price: 10,
                        count: 1
                    }
                ];
            }
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
        sticky: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            balls: createBalls(),
            dropBalls: [],
            listFold: this.fold
        };
    },
    computed: {
        totalPrice () {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount () {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
        },
        payClass () {
            if (this.totalPrice < this.minPrice) {
                return 'not-enough';
            } else {
                return 'enough';
            }
        }
    },
    watch: {
        fold (newVal) {
            this.listFold = newVal;
        },
        totalCount (newVal) {
            if (this.listFold && !newVal) {
                this._hideShopCartList()
            }
        }
    },
    methods: {
        drop (el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    ball.el = el;
                    this.dropBalls.push(ball);
                    return;
                }
            }
        },
        /**
         * listFold  作为控制购物车列表是否显示
         * _showShopCartList() 方法调用createAPI 创建购物车列表组件
         * _showShopCartSticky()方法调用createAPI 创建sticky购物车列表组件
         * selectFoods：购物车列表数据 minPrice：最低价 deliveryPrice：总价  作为props传入sticky购物车列表组件
         * fold：给 listFold 传值
         * list：作为子组件传入shop-cart-sticky.vue组件  方便调用  在本组件中this.$parent.list === this.shopCartListComp 组件
         */
        toggleList () {
            if (!this.listFold) {
                if (!this.totalCount) {
                    return;
                }
                this.listFold = true;
                this._showShopCartList(); // 新增购物车列表组件
                this._showShopCartSticky(); // 复制本组件  名称为 sticky购物车列表组件：复制购本组件解决 购物车列表组件 遮挡购 物车组件功能
            } else {
                this.listFold = false;
                this._hideShopCartList(); // 关闭购物车列表组件
            }
        },
        /**
         * 创建购物车列表组件
         * selectFoods 传入购物车列表数据
         *  $events 接受组件emit后回调函数
         */
        _showShopCartList () {
            this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
                $props: {
                    selectFoods: 'selectFoods'
                },
                $events: {
                    hide: () => {
                        this.listFold = false;
                    },
                    leave: () => {
                        this.showShopCartStickyComp.hide();
                    },
                    add: (el) => {
                        this.showShopCartStickyComp.drop(el);
                    }
                }
            })
            this.shopCartListComp.show();
        },
        /**
         * 关闭购物车组件
         * sticky 判断是原组件  还是创建的sticky复制的组件
         * this.$parent.list 等于 this.shopCartListComp
         * hide() 关闭购物车列表组件
         */
        _hideShopCartList () {
            const comp = this.sticky ? this.$parent.list : this.shopCartListComp;
            comp.hide && comp.hide();
        },
        /**
         * 创建sticky购物车组件
         * $props: {
                    selectFoods: 'selectFoods',
                    deliveryPrice: 'deliveryPrice',
                    minPrice: 'minPrice',
                    fold: 'listFold', 判断购物车列表是否显示
                    list: this.shopCartListComp 等于this.$parent.list
                }传入购物车需求的数据
         * show()显示sticky复制的组件
         */
        _showShopCartSticky () {
            this.showShopCartStickyComp = this.showShopCartStickyComp || this.$createShopCartSticky({
                $props: {
                    selectFoods: 'selectFoods',
                    deliveryPrice: 'deliveryPrice',
                    minPrice: 'minPrice',
                    fold: 'listFold',
                    list: this.shopCartListComp
                }
            })
            this.showShopCartStickyComp.show();
        },
        empty () {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        pay (e) {
            if (this.totalPrice < this.minPrice) {
                return;
            }
            this.dialogCom = this.$createDialog({
                title: '支付',
                content: `支付${this.totalPrice}元`
            }).show();
            e.stopPropagation();
        },
        addFood (target) {
            this.drop(target);
        },
        beforeDrop (el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22);
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        dropping (el, done) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
                el.addEventListener('transitionend', done);
            });
        },
        afterDrop (el) {
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
.shopcart
    position fixed;
    left 0;
    bottom 0;
    z-index 50;
    width 100vw;
    height 48px;
    .content
        display flex;
        background #141d27;
        font-size 0;
        color rgba(255, 255, 255, 0.4);
        .content-left
            flex 1;
            .logo-wrapper
                display inline-block;
                vertical-align top;
                position relative;
                top -10px;
                margin 0 12px;
                padding 6px;
                width 56px;
                height 56px;
                box-sizing border-box;
                border-radius 50%;
                background #141d27;
                .logo
                    width 100%;
                    height 100%;
                    border-radius 50%;
                    text-align center;
                    background #2b343c;
                    &.highlight
                        background rgb(0, 160, 220);
                    .icon-shopping_cart
                        line-height 44px;
                        font-size 24px;
                        color #80858a;
                        &.highlight
                            color #fff;
                .num
                    position absolute;
                    top 0;
                    right 0;
                    width 24px;
                    height 16px;
                    line-height 16px;
                    text-align center;
                    border-radius 16px;
                    font-size 9px;
                    font-weight 700;
                    color #fff;
                    background rgb(240, 20, 20);
                    box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4);
            .price
                display inline-block;
                vertical-align top;
                margin-top 12px;
                line-height 24px;
                padding-right 12px;
                box-sizing border-box;
                border-right 1px solid rgba(255, 255, 255, 0.1);
                font-size 16px;
                font-weight 700;
                &.highlight
                    color #fff;
            .desc
                display inline-block;
                vertical-align top;
                margin 12px 0 0 12px;
                line-height 24px;
                font-size 10px;
        .content-right
            flex 0 0 105px;
            width 105px;
            .pay
                height 48px;
                line-height 48px;
                text-align center;
                font-size 12px;
                font-weight 700;
                &.not-enough
                    background #2b333b;
                &.enough
                    background #00b43c;
                    color #fff;
    .ball-container
        .ball
            position fixed;
            left 32px;
            bottom 22px;
            z-index 200;
            transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
            .inner
                width 16px;
                height 16px;
                border-radius 50%;
                background rgb(0, 160, 220);
                transition all 0.4s linear;
</style>
