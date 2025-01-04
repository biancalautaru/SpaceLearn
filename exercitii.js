window.onload = function() {
    fetch("exercitii.json").then(response => response.json()).then(exercises => {
        const exercises_menu = document.getElementById("exercises_menu");
        const exercise_tab = document.getElementById("exercise_tab");

        for (let i = 0; i < exercises.length; i++) {
            const exercise = exercises[i];

            const exercisesItem = document.createElement("div");

            const number = document.createElement("h1");

            function changeNumber(width) {
                if (width.matches)
                    number.innerHTML = `${i+1}`;
                else
                    number.innerHTML = `Exercițiul ${i+1}`;
            }
            const width = window.matchMedia("(max-width:767px)");
            changeNumber(width);
            width.addEventListener("change", function() {
                changeNumber(width);
            });

            exercisesItem.appendChild(number);
 
            exercisesItem.addEventListener("click", () => {
                exercise_tab.innerHTML = `
                    <h1><i>Exercițiul ${i+1}</i></h1>
                    <p>${exercise.question}</p>
                `;
            });
 
            exercises_menu.appendChild(exercisesItem);
       };
    });
 }
 