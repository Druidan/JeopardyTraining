let nameEnter = {};
nameEnter.opacityIn = [0,1];
nameEnter.durationIn = 350;
nameEnter.translateY = -375;

let nameDrop = anime.timeline({loop: false})
    .add({
    targets: '#nameEntry',
    translateY: -800,
    duration: 0,
    }) .add({
    targets: '#nameEntry',
    opacity: nameEnter.opacityIn,
    translateY: nameEnter.translateY,
    delay: 1200,
});


// document.querySelector('#submit-name').onclick = nameUp.play;
