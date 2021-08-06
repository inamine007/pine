export default function ({ store, redirect }) {
  setTimeout(function(){
    store.dispatch('flashMessage/showFlashMessage', {text: null});
  }, 3000);
}