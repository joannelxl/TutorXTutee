import { createApp } from "vue";
import App from "./App.vue";

import "@fortawesome/fontawesome-free/js/all";
import router from "./routers";

// // Vuetify
// import "vuetify/styles";
// import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

// const vuetify = createVuetify({
//   components,
//   directives,
// });

createApp(App).use(router).mount("#app");
