window.onload = function() {
    fetch("exercitii.json").then(response => response.json()).then(exercises => {
        const exercisesMenu = document.getElementById("exercises_menu");

        for (let i = 0; i < exercises.length; i++) {
            var exercisesItem = document.createElement("div");

            const number = document.createElement("h1");

            function changeNumber(width) {
                if (width.matches)
                    number.innerHTML = `${i+1}`;
                else
                    number.innerHTML = `Exercițiul ${i+1}`;
            }
            var width = window.matchMedia("(max-width:767px)");
            changeNumber(width);
            width.addEventListener("change", function() {
                changeNumber(width);
            });

            exercisesItem.appendChild(number);

            exercisesItem.addEventListener("click", function() {
                showExercise(i);
            });

            exercisesMenu.appendChild(exercisesItem);
        }

        function showExercise(exerciseNumber) {
            const exerciseTab = document.getElementById("exercise_tab");
            exerciseTab.innerHTML = ``;
    
            if (exerciseNumber != 0) {
                const previousButton = document.createElement("button");
                previousButton.id = "previous";

                previousButton.innerHTML = `Anterior`;

                previousButton.addEventListener("click", function() {
                    showExercise(exerciseNumber - 1);
                });
                exerciseTab.appendChild(previousButton);
            }

            if (exerciseNumber != exercises.length - 1) {
                const nextButton = document.createElement("button");
                nextButton.id = "next";

                nextButton.innerHTML = `Următor`;

                nextButton.addEventListener("click", function() {
                    showExercise(exerciseNumber + 1);
                });
                exerciseTab.appendChild(nextButton);
            }

            const number = document.createElement("h1");
            number.innerHTML = `<i>Exercițiul ${exerciseNumber + 1}</i>`;
            exerciseTab.appendChild(number);

            const exercise = exercises[exerciseNumber];

            const question = document.createElement("p");
            question.innerHTML = `${exercise.question}`;
            exerciseTab.appendChild(question);

            const form = document.createElement("form");
            form.id = "exercise";

            if (exercise.type == "free response")
                form.innerHTML = `
                    <div>
                        <input type="text" id="answer" name="answer" required>
                        <label for="answer"></label>
                    </div>
                    <div>
                        <input type="submit" value="Verificare">
                    </div>
                `;
            else
                form.innerHTML = `
                    <div>
                        <input type="radio" id="answer1" name="answer" value="${exercise.answer1}" required>
                        <label for="answer1">${exercise.answer1}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer2" name="answer" value="${exercise.answer2}" required>
                        <label for="answer2">${exercise.answer2}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer3" name="answer" value="${exercise.answer3}" required>
                        <label for="answer3">${exercise.answer3}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer4" name="answer" value="${exercise.answer4}" required>
                        <label for="answer4">${exercise.answer4}</label>
                    </div>
                    <div>
                        <input type="submit" value="Verificare">
                    </div>
                `;

            form.addEventListener("submit", function(event) {
                event.preventDefault();

                var img = document.getElementById("icon");
                if (img)
                    img.remove();

                if (exercise.type == "free response") {
                    var input = document.getElementById("answer").value;
                    var selectedElement = document.querySelector(`label[for = "answer"]`);
                }
                else {
                    var input = null;
                    var selectedElement = null;
                    const options = document.getElementsByName("answer");
                    for (let option of options)
                        if (option.checked) {
                            input = option.value;
                            selectedElement = document.querySelector(`label[for = "${option.id}"]`);
                            break;
                        }
                }

                var img = document.createElement("img");
                if (input.toLowerCase() == exercise.correct.toLowerCase()) {
                    img.src = "images/tick.png";
                    img.alt = "Corect";
                    img.id = "icon";
                }
                else {
                    img.src = "images/x.png";
                    img.alt = "Greșit";
                    img.id = "icon";
                }
                selectedElement.appendChild(img);
            });

            exerciseTab.appendChild(form);
        }
    });
 }
 