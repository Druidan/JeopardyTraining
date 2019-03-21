let nameEnter = {};
nameEnter.durationIn = 350;
nameEnter.translateY = 0;

let nameDrop = anime.timeline({
    loop: false,
    }) .add({
    targets: '#nameEntry',
    translateY: -800,
    duration: 0,
    }) .add({
    targets: '#nameEntry',
    translateY: nameEnter.translateY,
    delay: 1200,
});


let questionUp = anime.timeline({
    loop: false,
    }) .add({
    targets: "qContain",
    translateY: 2000,
    duration: 0,
    }) .add({
    targets: "qContain",
    translateY: 20,
    delay: 800
})

// document.querySelector('#submit-name').onclick = nameUp.play;
