export default {
    namespaced: true,
    state: {
        notification: {
          show: false,
          message: '',
          type: 'info',
          duration: 3000
        }
      },
      mutations: {
        SHOW_NOTIFICATION(state, payload) {


          state.notification.show = true;
          state.notification.message = payload.message;
          state.notification.type = payload.type;
          state.notification.duration = payload.duration;
        },
        HIDE_NOTIFICATION(state) {
          state.notification.show = false;
        }
      }
  };
