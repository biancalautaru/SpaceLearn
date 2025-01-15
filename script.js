window.onload = function() {
    function showTime() {
        const width = window.matchMedia("(max-width:767px)");
        if (!width.matches) {
            const nav = document.querySelector("header nav");
            const time = document.createElement("time");
            time.style.padding = "0.4em";
            nav.appendChild(time);
        }
        width.addEventListener("change", function() {
            const time = document.getElementsByTagName("time")[0];
            if (width.matches) {
                if (time)
                    document.getElementsByTagName("time")[0].remove();
            }
            else {
                const nav = document.querySelector("header nav");
                if (!time) {
                    const time = document.createElement("time");
                    time.style.padding = "0.4em";
                    nav.appendChild(time);
                }
            }
        });

        var lastMinute = null;
        function updateTime() {
            const time = document.getElementsByTagName("time")[0];
            if (time) {
                const now = new Date();

                const day =  String(now.getDate()).padStart(2, "0");
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const year = String(now.getFullYear());
                const hour = String(now.getHours()).padStart(2, "0");
                const minute = String(now.getMinutes()).padStart(2, "0");

                if (minute !== lastMinute) {
                    const date = `${day}/${month}/${year} ${hour}:${minute}`;
                    time.textContent = date;
                    lastMinute = lastMinute;
                }
            }
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    function feedbackForm() {
        const form = document.querySelector("#feedback form");
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            submitMessage = form.getElementsByTagName("span")[0];
            if (submitMessage)
                submitMessage.remove();

            var submitMessage = document.createElement("span");
            submitMessage.textContent = "Feedback-ul a fost trimis!";
            submitMessage.style.padding = "0.2em";
            form.appendChild(submitMessage);
        });
    }

    function Exercises() {
        fetch("exercitii.json").then(response => response.json()).then(exercises => {
            const exercisesMenu = document.getElementById("exercises_menu");

            for (let i = 0; i < exercises.length; i++) {
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

                exercisesItem.addEventListener("click", function() {
                    showExercise(i);
                });

                exercisesMenu.appendChild(exercisesItem);
            }

            function showExercise(exerciseNumber) {
                const root = document.documentElement;
                const colorDarkBlue = getComputedStyle(root).getPropertyValue("--color-dark-blue");
                const colorPurple = getComputedStyle(root).getPropertyValue("--color-purple");
                
                const exercisesList = exercisesMenu.getElementsByTagName("div");
                for (let i = 0; i < exercisesList.length; i++)
                        exercisesList[i].style.color = colorDarkBlue;
                exercisesList[exerciseNumber].style.color = colorPurple;

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

                    if (exerciseNumber == 0)
                        nextButton.style.marginLeft = "1.2em";

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

                        let correctAnswers = JSON.parse(localStorage.getItem("correctAnswers"));
                        if (!correctAnswers)
                            correctAnswers = new Array();
                        correctAnswers.push(exerciseNumber);
                        localStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
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

            function signupFormCheck() {
                const signupForm = document.getElementsByClassName("welcome_form")[0];
                if (signupForm) {
                    signupForm.addEventListener("submit", function(event) {
                        event.preventDefault();
                        const username = document.getElementById("username_signup").value;
                        const usernameRegex = /^[a-z]{3,}\d{2}$/;
                        if (!usernameRegex.test(username)) {
                            alert("Introdu un username ce respectă regulile!");
                            return false;
                        }
                        showExercise(0);
                    });
                }
            }

            function loginFormCheck() {
                const loginForm = document.getElementsByClassName("welcome_form")[1];
                if (loginForm) {
                    loginForm.addEventListener("submit", function(event) {
                        event.preventDefault();
                        const username = document.getElementById("username_login").value;
                        const password = document.getElementById("password_login").value;

                        fetch("users.json").then(response => response.json()).then(users => {
                            users.forEach(function(user) {
                                if(user.username === username && user.password != password) {
                                    alert("Username-ul sau parola sunt greșite!");
                                    return false;
                                }
                            });
                        });
                        showExercise(0);
                    });
                }
            }

            signupFormCheck();
            loginFormCheck();
        });
    }

    showTime();
    feedbackForm();

    if (window.location.pathname == "/exercitii.html")
        Exercises();
    
    // localStorage.removeItem("correctAnswers");
}
