const navLinks =
document.querySelectorAll(".list a");

const sections =
document.querySelectorAll("section");

function activeMenu(){

    let len =
    sections.length;

    while(--len &&

        window.scrollY + 150 <
        sections[len].offsetTop
    ){}

    navLinks.forEach(link => {

        link.classList.remove("active");
    });

    navLinks[len]
    .classList.add("active");
}

activeMenu();

window.addEventListener(
    "scroll",
    activeMenu
);

const reveals =
document.querySelectorAll(".reveal");

window.addEventListener(
    "scroll",
    revealSection
);

function revealSection(){

    reveals.forEach(reveal => {

        const windowHeight =
        window.innerHeight;

        const revealTop =
        reveal.getBoundingClientRect().top;

        const revealPoint = 100;

        if(
            revealTop <
            windowHeight - revealPoint
        ){

            reveal.classList.add("active");
        }
    });
}

revealSection();

const typingText =
document.querySelector(".typing");

const words = [

    "Frontend Developer",

    "Creative Coder",

    "UI Enthusiast",

    "React Learner"
];

let wordIndex = 0;

let charIndex = 0;

let isDeleting = false;

function typeEffect(){

    const currentWord =
    words[wordIndex];

    if(!isDeleting){

        typingText.textContent =
        currentWord.substring(
            0,
            charIndex
        );

        charIndex++;

        if(
            charIndex >
            currentWord.length
        ){

            isDeleting = true;

            setTimeout(
                typeEffect,
                1000
            );

            return;
        }

    }else{

        typingText.textContent =
        currentWord.substring(
            0,
            charIndex
        );

        charIndex--;

        if(charIndex < 0){

            isDeleting = false;

            wordIndex++;

            if(
                wordIndex >=
                words.length
            ){

                wordIndex = 0;
            }
        }
    }

    setTimeout(

        typeEffect,

        isDeleting ? 60 : 120
    );
}

typeEffect();

const form =
document.querySelector(".contact-card");

const popup =
document.getElementById("popup");

form.addEventListener("submit", e => {

    e.preventDefault();

    popup.classList.add("show");

    form.reset();

    setTimeout(() => {

        popup.classList.remove("show");

    },3000);
});

const scrollBar =
document.querySelector(".scroll-bar");

window.addEventListener("scroll", () => {

    const scrollTop =
    document.documentElement.scrollTop;

    const scrollHeight =

    document.documentElement.scrollHeight -

    document.documentElement.clientHeight;

    const scrollPercent =

    (scrollTop / scrollHeight) * 100;

    scrollBar.style.width =
    `${scrollPercent}%`;
});