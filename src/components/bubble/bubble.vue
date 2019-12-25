<template>
    <div class="bubble">{{num}}</div>
</template>
<script>
export default {
    props: {
        num: {
            type: Number,
            default: 0
        }
    }
}
</script>
<style lang="stylus" scoped>
.bubble
    width 12px;
    height 12px;
    background-color #f00;
    border-radius 50%;
    color #fff;
    padding 2px;
    font-weight 700;
</style>
