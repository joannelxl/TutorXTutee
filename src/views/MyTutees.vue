<script>
import TuteeArrangements from '@/components/TuteeArrangements.vue'

export default {
	data() {
		return {
			refreshComp: 0,
		}
	},
	components: {
		TuteeArrangements
	},
	methods: {
		update() {
			this.refreshComp += 1
		}
	}
}
</script>

<template>
	<div id="mytutees">
		<div class="heading">
			<h1>Tutor x Tutee</h1>
			<h4> All your tutees are listed here.</h4>
		</div>
		<TuteeArrangements :key="refreshComp" @ended="update"/>
	</div>
</template>

<style scoped> 

#mytutees {
	text-align: center;
	width: 90vw;
}
.heading {
 	text-align: center;

 }
</style>