<template>
    <transition name="fade">
        <cube-popup type="shop-cart-list"
                    v-show="visible"
                    :mask-closable="true"
                    :z-index="90"
                    position="bottom"
                    @mask-click="maskClcik">
            <transition name="move"
                        @after-leave="leave">
                <div class="shopcart-list"
                     v-show="visible">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty"
                              @click="empty">清空</span>
                    </div>
                    <cube-scroll class="list-content"
                                 ref="listContent">
                        <ul>
                            <li class="food"
                                v-for="(food,index) in selectFoods"
                                :key="index">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @add="add"
                                                 :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </cube-scroll>
                </div>
            </transition>
        </cube-popup>
    </transition>
</template>
<script>
import cartcontrol from 'components/cartcontrol/cartcontrol';
import popupMixin from 'common/mixins/popup';
const EVENT_LEAVE = 'leave';
const EVENT_SHOW = 'show';
const EVENT_ADD = 'add';
export default {
    mixins: [popupMixin],
    name: 'shop-cart-list',
    props: {
        selectFoods: {
            type: Array,
            default: () => ([])
        }
    },
    created () {
        this.$on(EVENT_SHOW, () => {
            this.$nextTick(() => {
                this.$refs.listContent.refresh()
            })
        })
    },
    methods: {
        maskClcik () {
            this.hide()
        },
        leave () {
            this.$emit(EVENT_LEAVE);
        },
        add (target) {
            this.$emit(EVENT_ADD, target);
        },
        empty () {
            this.$createDialog({
                type: 'confirm',
                content: '清空购物吗？',
                $events: {
                    confirm: () => {
                        this.selectFoods.forEach((item) => {
                            item.count = 0;
                        })
                        this.hide();
                    }
                }
            }).show()
        }
    },
    components: {
        cartcontrol
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';
.cube-shop-cart-list
    bottom 48px;
    &.fade-enter, &.fade-leave-active
        opacity 0;
    &.fade-enter-active, &.fade-leave-active
        transition all 0.3s ease-in-out;
    .move-enter, &.move-leave-active
        transform translate3d(0, 100%, 0);
    .move-enter-active, &.move-leave-active
        transition all 0.3s ease-in-out;
.shopcart-list
    width 100vw;
    &.fold-enter-active, &.fold-leave-active
        transition all 0.5s;
    &.fold-enter, &.fold-leave-active
        transform translate3d(0, 0, 0);
    .list-header
        height 40px;
        line-height 40px;
        padding 0 18px;
        background #f3f5f7;
        border-bottom 1px solid rgba(7, 17, 27, 0.1);
        .title
            float left;
            font-size 14px;
            color rgb(7, 17, 27);
        .empty
            float right;
            font-size 12px;
            color rgb(0, 160, 220);
    .list-content
        padding 0 18px;
        max-height 217px;
        overflow hidden;
        background #fff;
        .food
            display flex;
            align-items center;
            justify-content space-between;
            padding 12px 0;
            box-sizing border-box;
            border-1px(rgba(7, 17, 27, 0.1));
            .name
                line-height 24px;
                flex 1;
                font-size 14px;
                color rgb(7, 17, 27);
            .price
                line-height 24px;
                margin-right 30px;
                margin-left 120px;
                font-size 14px;
                font-weight 700;
                color rgb(240, 20, 20);
</style>
