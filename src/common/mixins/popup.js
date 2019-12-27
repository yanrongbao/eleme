const EVEVT_SHOW = 'show';
const EVEVT_HIDE = 'hide';
export default {
    data () {
        return {
            visible: false
        };
    },
    methods: {
        show () {
            this.visible = true;
            this.$emit(EVEVT_SHOW);
        },
        hide () {
            this.visible = false;
            this.$emit(EVEVT_HIDE);
        }
    }
}
