<template>
    <popup-modal ref="popup">
        <p>{{ message }}</p>
        <div class="btns">
            <button class="ok-btn" @click="_ok">ok</button>
        </div>
    </popup-modal>
</template>

<script>
import PopupModal from './PopupModal.vue'

export default {
    name: 'AcknowledgeDialogue',

    components: { PopupModal },

    data: () => ({
        // Parameters that change depending on the type of dialogue
        message: undefined, // Main text content
        
        // Private variables
        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.message = opts.message
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open()
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _ok() {
            this.$refs.popup.close()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User canceled the dialogue'))
        },
    },
}
</script>

<style scoped>

p {
	text-align: left;
}
.btns {
    display: inline;
    flex-direction: row;
    justify-content: space-between;
}

.ok-btn {
    padding: 0.5em 0.5em;
    background-color: white;
    color: black;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;
	float: right;
}

.ok-btn:hover {background-color: lightblue}

.ok-btn:active {
  background-color: lightblue;
  box-shadow: 0 2px lightgray;
  transform: translateY(4px);
}
</style>