window.onload = function() {
    function showTime() {
        const width = window.matchMedia("(max-width:767px)");
        const root = document.documentElement;
        if (!width.matches) {
            const nav = document.querySelector("header nav");
            const time = document.createElement("time");
            time.style.padding = "0.4em";
            time.style.color = getComputedStyle(root).getPropertyValue("--color-dark-blue");
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
                    time.style.color = getComputedStyle(root).getPropertyValue("--color-dark-blue");
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
                sessionStorage.setItem("exercise", exerciseNumber);

                const root = document.documentElement;
                const colorDarkBlue = getComputedStyle(root).getPropertyValue("--color-dark-blue");
                const colorPurple = getComputedStyle(root).getPropertyValue("--color-purple");
                
                const exercisesList = exercisesMenu.getElementsByTagName("div");
                for (let i = 0; i < exercisesList.length; i++)
                        exercisesList[i].style.color = colorDarkBlue;
                exercisesList[exerciseNumber].style.color = colorPurple;

                const exerciseTab = document.getElementById("exercise_tab");
                exerciseTab.innerHTML = ``;

                drawStars();
        
                if (exerciseNumber != 0) {
                    const previousButton = document.createElement("button");
                    previousButton.id = "previous";
                    previousButton.classList.add("button");

                    previousButton.innerHTML = `Anterior`;

                    previousButton.addEventListener("click", function() {
                        showExercise(exerciseNumber - 1);
                    });
                    exerciseTab.appendChild(previousButton);
                }

                if (exerciseNumber != exercises.length - 1) {
                    const nextButton = document.createElement("button");
                    nextButton.id = "next";
                    nextButton.classList.add("button");

                    nextButton.innerHTML = `Următor`;

                    nextButton.addEventListener("click", function() {
                        showExercise(exerciseNumber + 1);
                    });

                    if (exerciseNumber == 0)
                        nextButton.style.marginLeft = "1.2em";

                    exerciseTab.appendChild(nextButton);
                }

                const username = localStorage.getItem("username");
                if (username) {
                    const logOutButton = document.createElement("button");
                    logOutButton.id = "logout";
                    logOutButton.classList.add("button");
                    logOutButton.textContent = "Log Out";
                    logOutButton.style.display = "inline";
                    logOutButton.style.float = "right";
                    logOutButton.style.marginTop = "1em";

                    logOutButton.addEventListener("click", function() {
                        localStorage.removeItem("username");
                        location.reload();
                    });

                    exerciseTab.appendChild(logOutButton);

                    const userScore = document.createElement("p");
                    userScore.id = "user_score";
                    userScore.style.display = "inline";
                    userScore.style.float = "right";

                    userScore.textContent = username.replace(/"/g, "") + ": " + getScore(username) + "/" + exercises.length;
                    exerciseTab.appendChild(userScore);

                    const correctAnswers = localStorage.getItem(username.replace(/"/g, "") + "correctAnswers");
                }
                else {
                    const userScore = document.createElement("p");
                    userScore.id = "user_score";
                    userScore.style.display = "inline";
                    userScore.style.float = "right";

                    userScore.textContent = getScore(username) + "/" + exercises.length;
                    exerciseTab.appendChild(userScore);
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
                            <input type="submit" class="button" value="Verificare">
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
                            <input type="submit" class="button" value="Verificare">
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

                        let username = localStorage.getItem("username");
                        if (username) {
                            username = username.replace(/"/g, "");
                            let correctAnswers = JSON.parse(localStorage.getItem(username + "correctAnswers"));
                            if (!correctAnswers)
                                correctAnswers = new Array();
                            if (!correctAnswers.includes(exerciseNumber))
                                correctAnswers.push(exerciseNumber);

                            localStorage.setItem(username + "correctAnswers", JSON.stringify(correctAnswers));

                            const userScore = document.getElementById("user_score");
                            userScore.textContent = username + ": " + getScore(username) + "/" + exercises.length;
                        }
                        else {
                            let correctAnswers = JSON.parse(sessionStorage.getItem("correctAnswers"));
                            if (!correctAnswers)
                                correctAnswers = new Array();
                            if (!correctAnswers.includes(exerciseNumber))
                                correctAnswers.push(exerciseNumber);
                            
                            sessionStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));

                            const userScore = document.getElementById("user_score");
                            userScore.textContent = getScore(username) + "/" + exercises.length;
                        }

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

            function changeColor() {
                const title = document.getElementById("title");
                if (title) {
                    title.style.cursor = "pointer";

                    let root = document.documentElement;

                    title.addEventListener("click", function(event) {
                        event.target.style.color = getComputedStyle(root).getPropertyValue("--color-purple");
                    });

                    const word = title.getElementsByTagName("span")[0];
                    
                    colors = ["#2c3e50", "#8e44ad", "#e74c3c", "#16a085", "#2980b9", "#d35400", "#f39c12", "#27ae60", "#c0392b", "#f1c40f"];
                    word.style.color = colors[Math.floor(Math.random() * colors.length)];
                    setInterval(function() {
                        word.style.color = colors[Math.floor(Math.random() * colors.length)];
                    }, 1500);

                    word.addEventListener("click", function(event) {
                        title.style.color = getComputedStyle(root).getPropertyValue("--color-dark-blue");
                        event.stopPropagation();
                    });
                }
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
                        alert("Contul a fost creat cu succes!");
                        location.reload();
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
                            let user = users.find(user => user.username === username);
                            if (user && user.password === password) {
                                localStorage.setItem("username", JSON.stringify(username));
                                sessionStorage.removeItem("correctAnswers");
                                showExercise(0);
                            }
                            else
                                alert("Username-ul sau parola sunt greșite!");
                        });
                    });
                }
            }

            function getScore(username) {
                let correctAnswers = null;
                if (username)
                    correctAnswers = JSON.parse(localStorage.getItem(username.replace(/"/g, "") + "correctAnswers"));
                else
                    correctAnswers = JSON.parse(sessionStorage.getItem("correctAnswers"));

                let score = 0;
                if (correctAnswers)
                    score = correctAnswers.length;
                return score;
            }

            function keys() {
                if (document.getElementById("title"))
                    sessionStorage.removeItem("exercise");

                document.addEventListener("keydown", function(event) {
                    let exerciseNumber = sessionStorage.getItem("exercise");
                    if (exerciseNumber) {
                        exerciseNumber = parseInt(exerciseNumber);
                        if (event.key == "ArrowLeft" && exerciseNumber != 0)
                            showExercise(exerciseNumber - 1);
                        if (event.key == "ArrowRight" && exerciseNumber != exercises.length - 1)
                            showExercise(exerciseNumber + 1);
                    }
                });
            }

            function drawStars() {
                const canvas = document.createElement("canvas");
                canvas.width = "1000";
                canvas.height = "500";
                canvas.style.width = "93%";
                canvas.style.height = "95%";
                canvas.style.zIndex = "-1";
                canvas.style.position = "absolute";
                canvas.style.transform = "translate(2%, 0%)";
                canvas.style.opacity = "0.3";
                const ctx = canvas.getContext("2d");

                function drawStar(cx, cy, spikes, outerRadius, innerRadius, strokeColor, fillColor) {
                    let rotation = Math.PI / 2 * 3;
                    let x = cx;
                    let y = cy;
                    let step = Math.PI / spikes;

                    ctx.beginPath();
                    ctx.moveTo(cx, cy - outerRadius);
                    for (let i = 0; i < spikes; i++) {
                        x = cx + Math.cos(rotation) * outerRadius;
                        y = cy + Math.sin(rotation) * outerRadius;
                        ctx.lineTo(x, y);
                        rotation += step;

                        x = cx + Math.cos(rotation) * innerRadius;
                        y = cy + Math.sin(rotation) * innerRadius;
                        ctx.lineTo(x, y);
                        rotation += step;
                    }
                    ctx.lineTo(cx, cy - outerRadius);
                    ctx.closePath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = strokeColor;
                    ctx.stroke();
                    ctx.fillStyle = fillColor;
                    ctx.fill();
                }
                
                const root = document.documentElement;
                const colorPurple = getComputedStyle(root).getPropertyValue("--color-purple");
                const colorLightBlue = getComputedStyle(root).getPropertyValue("--color-light-blue");

                for (let i = 0; i < 15; i++) {
                    let randX = 50 + Math.random() * 900;
                    let randY = 20 + Math.random() * 400;
                    drawStar(randX, randY, 4, 12, 5, colorPurple, colorLightBlue);
                }

                const exerciseTab = document.getElementById("exercise_tab");
                exerciseTab.appendChild(canvas);
            }

            changeColor();
            signupFormCheck();
            loginFormCheck();
            keys();
        });
    }

    showTime();
    feedbackForm();

    if (window.location.pathname == "/exercitii.html")
        Exercises();
}
