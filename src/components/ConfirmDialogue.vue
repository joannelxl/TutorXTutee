<template>
    <popup-modal ref="popup">
        <h2 style="margin-top: 10px">{{ title }}</h2>
        <p style = "font-size: 20px;">{{ message }}</p>
        <div class="btns">
            <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
            <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
        </div>
    </popup-modal>
</template>

<script>
import PopupModal from './PopupModal.vue'

export default {
    name: 'ConfirmDialogue',

    components: { PopupModal },

    data: () => ({
        // Parameters that change depending on the type of dialogue
        title: undefined,
        message: undefined, // Main text content
        okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
        cancelButton: 'Go Back', // text for cancel button
        
        // Private variables
        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton
            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open()
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User canceled the dialogue'))
        },
    },
}
</script>

<style scoped>
.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ok-btn {
    padding: 0.5em 0.5em;
    background-color:lightsalmon;
    color:crimson;
    border: 2px solid rosybrown;
    border-radius: 5px;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    cursor: pointer;
    margin: 20px;
    margin-right: 50px;
}

.ok-btn:hover {background-color: darksalmon}

.ok-btn:active {
  background-color: darksalmon;
  box-shadow: 0 2px lightgray;
  transform: translateY(4px);
}

.cancel-btn {
    padding: 0.5em 0.5em;
    background-color: #d5eae7;
    color: #35907f;
    border: 2px solid #0ec5a4;
    border-radius: 5px;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    cursor: pointer;
    margin: 20px 50px ;
}


.cancel-btn:hover {background-color: lightblue}

.cancel-btn:active {
  background-color: lightblue;
  box-shadow: 0 2px lightgray;
  transform: translateY(4px);
}


</style>