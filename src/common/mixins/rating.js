const ALL = 2;
export default {
    data () {
        return {
            selectType: ALL,
            onlyContent: true
        }
    },
    computed: {
        computedRatings () {
            let ret = [];
            this.ratings.forEach((rating) => {
                if (this.onlyContent && !rating.text) {
                    return;
                }
                if (this.selectType === ALL || this.selectType === rating.rateType) {
                    ret.push(rating)
                }
            })
            return ret;
        }
    },
    methods: {
        selectRating (type) {
            this.selectType = type;
        },
        toggleContent () {
            this.onlyContent = !this.onlyContent;
        }
    }
}
