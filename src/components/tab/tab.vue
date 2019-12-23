<template>
    <div class="tab">
        <cube-tab-bar :showSlider="true"
                      v-model="selectedLabel"
                      :data="tabs"
                      ref="tabBar"></cube-tab-bar>
        <div class="slide-wrapper">
            <cube-slide :loop="false"
                        :auto-play="false"
                        :show-dots="false"
                        :initial-index="index"
                        :options="slideOptions"
                        :useTransition="false"
                        ref="slide"
                        @change="onChange"
                        @scroll="onScroll">
                <cube-slide-item v-for="(tab,index) in tabs"
                                 :key="index">
                    <component :is="tab.component"
                               :data="tab.data"
                               ref="component"></component>
                </cube-slide-item>
            </cube-slide>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            index: 0,
            slideOptions: {
                listenScroll: true,
                probeType: 3,
                directionLockThreshold: 0
            }
        };
    },
    props: {
        tabs: {
            type: Array,
            default: () => ([])
        },
        initialIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        selectedLabel: {
            get () {
                return this.tabs[this.index].label
            },
            set (newVal) {
                this.index = this.tabs.findIndex((value) => {
                    return value.label === newVal;
                })
            }
        }
    },
    mounted () {
        this.onChange(this.index);
    },
    methods: {
        onChange (current) {
            this.index = current;
            const component = this.$refs.component[current];
            component.fetch && component.fetch()
        },
        onScroll (pos) {
            const tabBarWidth = this.$refs.tabBar.$el.clientWidth;
            const slideWidth = this.$refs.slide.slide.scrollerWidth;
            const transform = -pos.x / slideWidth * tabBarWidth;
            this.$refs.tabBar.setSliderTransform(transform);
        }
    }
}
</script>
<style lang="stylus" scoped>
.tab
    display flex;
    flex-direction column;
    position absolute;
    top 134px;
    left 0;
    right 0;
    bottom 0;
    // overflow scroll;
    .slide-wrapper
        height 100%;
    >>> .cube-slide-item
        position relative;
    >>> .cube-tab
        padding 10px 0;
</style>
