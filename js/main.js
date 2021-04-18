'use strict';

window.addEventListener('load', async () => {
  const ul = document.querySelector('ul');
  const rfrsh = document.querySelector('#refresh');
  const form = document.querySelector('form');
  const animalName = form.elements.animal;
  const speciesID = form.elements.species;

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration){
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          console.log('serviceworker', animalName + speciesID)
          const animal = {
            animalName: animalName.value,
            species: speciesID.value,
          };
          try{
            saveData('outbox', animal);
            await registration.sync.register('add-animal')
          }catch (e) {
            console.log(e.message)
          }
          event.target.elements.an.value = '';
          event.target.elements.sp.value = '';
          event.target.elements.an.focus();
        });
      }
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const init = async () => {
    let data = [];
    try {
      if(window.navigator.onLine){
        const animals = await getAnimals();
        for (const animal of animals) {
          data.push(animal);
          clearData('inbox');
          saveData('inbox', data);
        }
      }else{
        const inbox = await loadData('inbox');
        data = inbox[0];
      }
      
    }
    catch (e) {
      console.log(e.message);
    }

    ul.innerHTML = '';
    let num = 1;
    data.forEach(item => {
      ul.innerHTML += `<ul>${num}:${JSON.stringify(item,null,2)}</ul>`;
      num = num + 1;
    });

  };

  init();

  rfrsh.addEventListener('click', () => {
    location.reload();
    return false
  });
});