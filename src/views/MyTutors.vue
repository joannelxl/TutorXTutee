<script>
import TutorArrangements from '@/components/TutorArrangements.vue'

export default {
	data() {
		return {
			refreshComp: 0,
		}
	},
	components: {
		TutorArrangements
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
			<h4> All your tutors are listed here.</h4>
		</div>
		<TutorArrangements :key="refreshComp" @ended="update" />
	</div>
</template>

<style scoped> #mytutees {
 	text-align: center;
 	width: 90vw;
 }

 .heading {
 	text-align: center;

 }
</style>